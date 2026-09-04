# Proxima Soft font assets

Buckholt expects the font family name:

```css
"Proxima-soft", Arial, sans-serif
```

The actual licensed font binaries are not committed by default. Before adding them to this repository, confirm that the Open GI/OGI font licence permits storage and distribution in this private repository.

If approved, place the relevant `.woff2` files in this directory and add the matching `@font-face` declarations in a consuming stylesheet. Example only:

```css
@font-face {
  font-family: "Proxima-soft";
  src: url("./ProximaSoft-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Use the real file names and weights supplied by the licensed font package. Do not rename different font weights as Regular.

If the files are not present, Buckholt falls back to Arial. Claude should report that fallback during visual validation rather than silently choosing another font.
