#!/usr/bin/env python3
"""Build an offline copy of the repository that the prototype suites can run against.

Why this exists
---------------
The prototypes load three things over the network: the Typekit stylesheet
that carries Proxima Soft, the Font Awesome Pro kit, and the Bootstrap 5.1.3
JavaScript bundle from jsDelivr. A build container usually cannot reach any
of them, and the Bootstrap bundle is not optional — ten Buckholt components
depend on it.

So this copies the repository to a scratch directory and, in the copy only,
drops the Typekit link, swaps the Pro kit for Font Awesome Free, and points
the bundle at a vendored file. Nothing in the repository is modified.

What the mirror cannot tell you
-------------------------------
Proxima Soft is unavailable, so the mirror falls back to Arial, and Font
Awesome Free does not carry the Pro-only glyphs. Buckholt sets every line
height in rem, so vertical rhythm and every box measurement are unaffected —
but **text widths and Pro-only glyphs are not** what the real build renders.
Do not measure either against a design in the mirror.

Usage
-----
    python3 test/prototypes/build-mirror.py [DEST]
    cd DEST && python3 -m http.server 8098

DEST defaults to a sibling of the repository, `../buckholt-mirror`.

The vendored Bootstrap and Font Awesome are fetched once with `npm pack` into
`test/prototypes/.vendor/`, which is gitignored.
"""
import os
import shutil
import subprocess
import sys
import tarfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
VENDOR = os.path.join(HERE, '.vendor')

BOOTSTRAP = ('bootstrap', '5.1.3', 'package/dist/js/bootstrap.bundle.min.js')
FONTAWESOME = ('@fortawesome/fontawesome-free', '6.5.2', None)

# Copied into the mirror. Everything else in the repository is irrelevant to
# a running prototype.
TREES = ['css', 'components', 'prototypes', 'foundations', 'patterns']


def fetch(package, version, member):
    """npm pack the package into .vendor and extract it. Idempotent."""
    os.makedirs(VENDOR, exist_ok=True)
    marker = os.path.join(VENDOR, package.replace('/', '-') + '-' + version + '.done')
    if os.path.exists(marker):
        return
    print('  fetching %s@%s' % (package, version))
    subprocess.run(
        ['npm', 'pack', '%s@%s' % (package, version), '--pack-destination', VENDOR],
        check=True, capture_output=True)
    tarball = max(
        (os.path.join(VENDOR, f) for f in os.listdir(VENDOR) if f.endswith('.tgz')),
        key=os.path.getmtime)
    with tarfile.open(tarball) as tar:
        names = [member] if member else tar.getnames()
        tar.extractall(VENDOR, members=[tar.getmember(n) for n in names if n in tar.getnames()])
    open(marker, 'w').close()


def main():
    dest = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(ROOT), 'buckholt-mirror')

    print('vendoring offline dependencies')
    try:
        fetch(*BOOTSTRAP)
        fetch(*FONTAWESOME)
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        sys.exit('could not fetch the offline dependencies with npm: %s' % exc)

    bundle = os.path.join(VENDOR, BOOTSTRAP[2])
    fa = os.path.join(VENDOR, 'package')
    if not os.path.exists(bundle):
        sys.exit('the Bootstrap bundle is missing from %s' % VENDOR)

    print('copying the repository to %s' % dest)
    if os.path.isdir(dest):
        shutil.rmtree(dest)
    os.makedirs(dest)
    for tree in TREES:
        source = os.path.join(ROOT, tree)
        if os.path.isdir(source):
            shutil.copytree(source, os.path.join(dest, tree))

    os.makedirs(os.path.join(dest, 'vendor'), exist_ok=True)
    shutil.copy(bundle, os.path.join(dest, 'vendor'))
    for part in ('css', 'webfonts'):
        src = os.path.join(fa, part)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(dest, 'vendor', 'fa', part))

    print('rewriting the three network dependencies')
    pages = 0
    for root, _dirs, files in os.walk(dest):
        for name in files:
            if not name.endswith('.html'):
                continue
            path = os.path.join(root, name)
            relative = os.path.relpath(root, dest)
            up = '' if relative == '.' else '../' * (relative.count(os.sep) + 1)
            html = open(path, encoding='utf-8').read()
            before = html
            html = html.replace(
                '<link rel="stylesheet" href="https://use.typekit.net/vtl2xbn.css">', '')
            html = html.replace(
                '<script src="https://kit.fontawesome.com/ca92816a31.js" '
                'crossorigin="anonymous"></script>',
                '<link rel="stylesheet" href="%svendor/fa/css/all.min.css">' % up)
            html = html.replace(
                'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
                '%svendor/bootstrap.bundle.min.js' % up)
            if html != before:
                open(path, 'w', encoding='utf-8').write(html)
                pages += 1

    print('mirror built at %s (%d pages rewritten)' % (dest, pages))
    print('serve it with:  cd %s && python3 -m http.server 8098' % dest)


if __name__ == '__main__':
    main()
