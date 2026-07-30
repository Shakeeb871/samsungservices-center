# Samsung Services Center

Static marketing site for a Samsung home-appliance repair business serving the UAE
(Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah). Layout is built; all
business content is placeholder and must be replaced before launch.

## Stack

Hand-written HTML, one CSS file, one JS file. No framework, no build step, no
package manager, **no external requests of any kind**. What is in the repo is what
gets served. Do not introduce a bundler, CDN link or web font unless asked — the
strict CSP in `.htaccess` would block it and the host is shared cPanel.

## Layout

```
index.html            Home: hero, split band, 7 service cards, why-us, 7 detail
                      rows, areas, 5-step stepper, FAQ, CTA band
services.html         All 7 services, one section each (#washing-machine, #top-load,
                      #refrigerator, #microwave, #dishwasher, #cooking-range, #dryer)
areas.html            Coverage by emirate
about.html            Story, pillars, stats, why-us
contact.html          Contact details + validated booking form
blog.html             Post listing (placeholder entries)
404.html              Error page, wired via ErrorDocument in .htaccess

assets/css/style.css  Whole design system. 22 numbered sections, tokens in :root
assets/js/main.js     Mobile nav, dropdown, header shadow, footer year, form validation
assets/img/           logo.png, hero.jpg, service-*.jpg, cta.jpg, og-image.jpg, icons
assets/fonts/README   How to self-host SamsungOne / Samsung Sharp Sans
favicon.ico           Generated from the shield mark in the logo
site.webmanifest      PWA metadata
.htaccess             URLs, error docs, compression, caching, security headers, noindex
.cpanel.yml           cPanel Git Version Control deploy tasks
robots.txt            Crawl-allowed on purpose — see "Search engines" below
sitemap.xml           Canonical URL list (still example.com)
```

## Conventions that matter

**Header, footer, top bar and the SVG sprite are duplicated in every page.** There
is no include system. When you change one, change all seven — and keep the icon
sprite in sync, since `<use href="#i-name">` only resolves against the sprite on
that same page.

**Never use an inline `style` attribute, and never an inline `<style>` block.**
The CSP in `.htaccess` sets `style-src 'self'`, which silently drops both — the
page looks right locally (no CSP on `file://`) and breaks the moment it is served
from Apache. This already happened once. Add a rule or a modifier class in
`style.css` instead; there are `.mt-*` / `.mb-*` utilities for one-off spacing.
To check before pushing, serve the folder with the real header:

```bash
python3 -c "
import http.server,os
CSP=\"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'\"
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Content-Security-Policy', CSP); super().end_headers()
http.server.HTTPServer(('127.0.0.1',8099),H).serve_forever()"
```

then open `http://127.0.0.1:8099/` and look for "Refused to apply inline style"
in the console. The same applies to any script: no inline `onclick`, no inline
`<script>` — `main.js` is an external file for that reason.

**After editing `style.css` or `main.js`, bump the `?v=` on their `<link>` and
`<script>` in all seven pages.** They are referenced as `style.css?v=2` and
`main.js?v=2`. A different query string is a different cache key, which is the
only thing that reliably evicts a copy already sitting in someone's browser or in
a CDN. `.htaccess` also keeps those two files on a 5-minute revalidating cache
rather than the year-long `immutable` used for images — see the comment in section
5 for why immutable on a hand-edited stylesheet breaks the live site invisibly.

**Colours and type come from the tokens in `:root`.** Never hard-code a hex value
in a rule; add a token. The palette is fixed and each colour has one job:

| Token | Value | Where it goes |
| --- | --- | --- |
| `--primary` | `#2189ff` | icons, accents, the process band, active-nav underline |
| `--primary-dark` | `#0a6ede` | blue **surfaces** that carry white text (top bar, CTA band) and all links |
| `--primary-light` | `#7fbaff` | a blue accent sitting **on** a dark surface (eyebrows in dark sections) |
| `--secondary` | `#323333` | every dark surface: dark sections, footer, inner page heads |
| `--btn` | `#010202` | **buttons only** — nothing else |

`#010202` is the button colour, not a background colour. Dark surfaces are
`--secondary`. Getting this backwards makes the whole site read as black, which is
the opposite of the brand.

`--primary` (#2189ff) is only 3.45:1 on white and 3.67:1 on `--secondary`, so it
must never carry small text on either. Use `--primary-dark` on white and
`--primary-light` on dark. Text on the `#323333` surfaces uses `--on-dark`,
`--on-dark-soft` and `--on-dark-muted`, all of which clear AA.

**Everything is left-aligned.** No centred section heads, no centred hero, no
justified paragraphs, no centred cards. There is no `.center` modifier any more,
and `.text-center` is deliberately defined as `text-align: left` so stale markup
cannot re-centre anything. Do not add `text-align: center` to new components.

**Buttons are small and quiet**: `.62rem 1.25rem`, `.88rem`, weight 600, 1px
border, 4px radius, and a 1px lift on hover. `.btn-sm` and `.btn-lg` sit either
side. Do not scale them up for emphasis — use position and whitespace instead.
Primary calls to action carry a trailing arrow:
`<svg class="btn-arrow"><use href="#i-arrow"></use></svg>` inside the `.btn`.

**Two components have geometry worth knowing before you touch them:**

- `.split` is a two-column band whose image bleeds to the viewport edge while the
  copy stays aligned to the site container. That alignment comes from
  `.split-body { max-width: calc(var(--wrap) / 2); margin-left: auto }` — not from
  a `.container`, so do not wrap the body in one. `.split.is-flipped` mirrors it.
- `.steps` draws one continuous connector line via `.steps::before`, and the
  opaque circles sit on top of it, which is what makes it read as separate
  segments. Its `left`/`right` inset is
  `calc((100% - 4 * var(--step-gap)) / 10)`, which is the exact centre of the
  first and last circle **only for five equal columns**. The line is therefore
  hidden below 1100px, where the grid drops to three columns. If you change the
  number of steps, redo that maths or leave the line off.

**The header is white, the top bar and footer are black.** Anything added to the
header needs dark-on-light colours; anything added to the top bar or footer needs
light-on-dark. The logo PNG has a dark mark, so it sits bare on the white header
but keeps a white plate in the footer (`.footer-logo`).

**`#2189ff` is not a text colour on white** — it measures 3.45:1, below WCAG AA.
Use `--primary-dark` (#0a6ede, 4.89:1) for links, eyebrows, and any button
background that carries white text. Keep `--primary` for icons, accents and
anything on a dark background. Same rule applies to any new colour: check it
before you ship it.

**Light surfaces inside `.section-dark` need their text colours re-asserted.**
`.section-dark` sets a light body colour and white headings, which would make a
white card unreadable. `.svc-body` already does this; any new light card in a dark
section must too.

**Every image needs `width`, `height` and `alt`.** The dimensions prevent layout
shift; below-the-fold images also take `loading="lazy" decoding="async"`. The hero
is the exception — it stays eager with `fetchpriority="high"` and a `<link rel=preload>`.

**Pages link to each other with the `.html` extension** and their `rel=canonical`
matches. `.htaccess` also resolves extension-less URLs, but `.html` is the one
canonical form so internal clicks never pass through a redirect. To change that,
follow the three-step note in `.htaccess` section 2 — all three steps or none.

## Search engines: currently blocked

The site is in development and must not appear in search results. Two layers
enforce it, and they come off **together** at launch:

1. `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">` in the
   `<head>` of all seven pages
2. the `X-Robots-Tag` block in `.htaccess` section 7 (covers images and PDFs that
   a meta tag cannot reach)

`robots.txt` intentionally allows crawling. Do **not** change it to `Disallow: /` —
a blocked crawler never reads the noindex, so URLs Google already knows would stay
indexed. For a hard lock use cPanel → Directory Privacy instead.

**Any new page needs the noindex meta tag too.** The full launch checklist is in
README.md section 3.

## Deployment

Pushing to `main` does not publish. cPanel pulls and deploys:
Git Version Control → the repo → *Pull or Deploy* → **Update from Remote**, then
**Deploy HEAD Commit**, which runs `.cpanel.yml`.

`.cpanel.yml` copies named files into `$HOME/public_html/`. **Adding a new page
means adding a `cp` line for it** — otherwise it silently never reaches the server.
If the site is on an addon domain, change `DEPLOYPATH` to that document root.

## Before going live

Replace: the phone number `+971 50 000 0000` (appears in `tel:`, `wa.me` and
visible text), `info@example.com`, the Business Bay address, every `example.com`
URL in canonicals / Open Graph / sitemap / JSON-LD, the `#` social links, the
placeholder images in `assets/img/`, the stats on about.html, the blog entries,
and all body copy. Uncomment the HTTPS redirect and pick a canonical host in
`.htaccess`, then lift the two noindex layers.
