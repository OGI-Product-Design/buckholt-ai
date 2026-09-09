#!/usr/bin/env python3
"""Verify components/*/examples.html against the supplied Buckholt Code & specs pages.

Evidence: code-specs-html/*.html - the saved Buckholt documentation pages. Each page
embeds its canonical examples as escaped HTML inside
`<pre class="wp-block-code"><code>...</code></pre>`.

Two directions are checked, and both must pass:

  FORWARD   every documented code block appears in the matching examples.html
            (nothing documented has been dropped or altered)
  REVERSE   every example block in examples.html appears in the documented source
            (nothing has been invented, inferred or borrowed from another component)

Comparison is structural: comments are stripped and whitespace between and inside
tags is normalised, so indentation may be cleaned up but hierarchy, classes, element
order, attributes and icon placement must match exactly.

Non-HTML documented blocks (for example the Breadcrumb Sass snippet) are reported
separately and are not failures - SCSS is not an implementation source.

Usage:  python3 test/source-parity/check-source-parity.py [-v]
Exit:   0 all components verified, 1 any mismatch
"""
import glob
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Documentation page name -> component folder. Table is absent by design: no Code &
# specs page was supplied for it, which is why it is recorded SOURCE PARTIAL.
PAGE_TO_COMPONENT = {
    'Accordion': 'accordion', 'Alert': 'alert', 'Avatar': 'avatar',
    'Breadcrumb': 'breadcrumb', 'Button': 'button', 'Card': 'card',
    'Checkbox': 'checkbox', 'Collapse': 'collapse', 'Dropdown': 'dropdown',
    'Form': 'form', 'Heading attachment': 'heading-attachment',
    'Icon block': 'icon-block', 'Input group': 'input-group',
    'Input row': 'input-row', 'Key-value pair': 'key-value-pair', 'Link': 'link',
    'List': 'list', 'Lookup': 'lookup', 'Menu': 'menu', 'Menu button': 'menu-button',
    'Modal': 'modal', 'Multi-field input': 'multi-field-input',
    'Nested inputs': 'nested-inputs', 'Number input': 'number-input',
    'Page navigation': 'page-navigation', 'Progress': 'progress-bar',
    'Radio': 'radio', 'Response button': 'response-button', 'Select': 'select',
    'Slider': 'slider', 'Summary-meta': 'summary-meta', 'Switch': 'switch',
    'Tabs': 'tabs', 'Tag': 'tag', 'Text area': 'text-area',
    'Text block': 'text-block', 'Text input': 'text-input', 'Toast': 'toast',
    'Tooltip': 'tooltip', 'Versa-tile': 'versa-tile',
}

CODE_BLOCK = re.compile(r'<pre class="wp-block-code"><code>(.*?)</code></pre>', re.S)


def normalise(markup):
    """Structural form: comments removed, whitespace collapsed."""
    markup = re.sub(r'<!--.*?-->', '', markup, flags=re.S)
    markup = re.sub(r'>\s+<', '><', markup)
    return re.sub(r'\s+', ' ', markup).strip()


def documented_blocks(page_path):
    source = open(page_path, encoding='utf-8', errors='replace').read()
    return [html.unescape(m.group(1)).strip() for m in CODE_BLOCK.finditer(source)]


def repository_blocks(examples_path):
    raw = open(examples_path, encoding='utf-8').read()
    blocks = []
    for part in re.split(r'\n\s*\n(?=<)', raw):
        body = re.sub(r'^\s*<!--.*?-->\s*', '', part.strip(), flags=re.S).strip()
        if body.startswith('<'):
            blocks.append(body)
    return blocks


def main():
    verbose = '-v' in sys.argv
    pages = sorted(glob.glob(os.path.join(ROOT, 'code-specs-html', '*.html')))
    if not pages:
        print('FAIL  code-specs-html/ is empty or missing - source parity cannot be checked.')
        return 1

    failures, non_html, checked_fwd, checked_rev = [], [], 0, 0

    for page_path in pages:
        page = os.path.basename(page_path).split('_')[0].strip()
        component = PAGE_TO_COMPONENT.get(page)
        if component is None:
            failures.append(f'{page}: no component mapping for this documentation page')
            continue

        examples = os.path.join(ROOT, 'components', component, 'examples.html')
        if not os.path.exists(examples):
            failures.append(f'{component}: components/{component}/examples.html is missing')
            continue

        repo_text = normalise(open(examples, encoding='utf-8').read())
        source_blocks = documented_blocks(page_path)
        source_text = ' '.join(normalise(b) for b in source_blocks)

        for index, block in enumerate(source_blocks):
            if not block.lstrip().startswith('<'):
                non_html.append(f'{component} block {index}: {block.splitlines()[0][:60]}')
                continue
            checked_fwd += 1
            if normalise(block) not in repo_text:
                failures.append(f'{component}: documented block {index} is not in examples.html')

        for block in repository_blocks(examples):
            checked_rev += 1
            if normalise(block) not in source_text:
                failures.append(
                    f'{component}: examples.html contains a block absent from the '
                    f'documented source: {normalise(block)[:70]}')

        if verbose:
            print(f'  {component:22s} {len(source_blocks):>3d} documented')

    print(f'\n  forward  {checked_fwd} documented HTML blocks checked against the repository')
    print(f'  reverse  {checked_rev} repository blocks checked against the documented source')
    if non_html:
        print(f'  skipped  {len(non_html)} non-HTML documented block(s), not an implementation source:')
        for item in non_html:
            print(f'             {item}')
    if failures:
        print(f'\nFAIL  {len(failures)} mismatch(es):')
        for item in failures:
            print(f'  - {item}')
        return 1
    print('\nPASS  canonical markup matches the documented source in both directions.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
