# Fonts

The site currently renders in the system UI font stack, declared in
`assets/css/style.css` as `--font-sans` and `--font-display`. Samsung's own
faces are named first in those stacks, so the moment the files are present the
site picks them up with no other change.

## Why nothing is loaded from a CDN

`.htaccess` sets a strict `Content-Security-Policy` with `font-src 'self'`, and
the site has no external requests at all. That is deliberate: it keeps the page
fast, keeps it working offline, and avoids sending visitor IPs to a third party.
If you add a web font, **self-host it** rather than linking to Google Fonts or a
CDN — otherwise the CSP will block it.

## Adding SamsungOne / Samsung Sharp Sans

You need a licence for these — they are Samsung's corporate typefaces, not free
downloads. If your licence covers web use, drop the `.woff2` files in this folder
and add this to the top of `style.css`:

```css
@font-face {
  font-family: "SamsungOne";
  src: url("../fonts/SamsungOne-400.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "SamsungOne";
  src: url("../fonts/SamsungOne-700.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: "Samsung Sharp Sans";
  src: url("../fonts/SamsungSharpSans-Bold.woff2") format("woff2");
  font-weight: 700 800;
  font-display: swap;
}
```

Then add a preload for the two faces that appear above the fold, in the `<head>`
of every page, immediately before the stylesheet link:

```html
<link rel="preload" href="assets/fonts/SamsungOne-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/SamsungSharpSans-Bold.woff2" as="font" type="font/woff2" crossorigin>
```

`font-display: swap` matters — without it the text stays invisible while the font
downloads, which shows up as a failed "text remains visible during webfont load"
audit in Lighthouse.

## A free alternative

If you cannot licence the Samsung faces, **Poppins** or **Inter** (both OFL, both
self-hostable) are the closest common substitutes for the geometric look. Replace
the first entries in `--font-sans` / `--font-display` with whichever you pick.
