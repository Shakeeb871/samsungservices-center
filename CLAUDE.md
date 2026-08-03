# Samsung Services Center

Static marketing site for a Samsung home-appliance repair business serving the UAE
(Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah). The body copy is the
client's own. Contact details, the domain and the imagery are still placeholder
and must be replaced before launch — see "Before going live".

## The business is a Samsung-authorised repair centre

The site says so in the hero, and everything else has to agree with it. The
first draft of the copy described the business as independent and **not**
authorised by Samsung; the owner has since confirmed it holds Samsung
authorisation, so those lines were rewritten. Twelve sentences changed, listed
in `scratchpad/coverage.py` under `SUPERSEDED`. If you touch any of them, keep
them consistent — a page that claims authorisation in the hero and denies it in
the FAQ is worse than either position on its own.

What that means in practice:

- Parts are **genuine Samsung parts**. The earlier "or a compatible
  replacement" wording is gone from the FAQ and from the parts card.
- Manufacturer-warranty work is handled under those terms, not referred
  elsewhere as third-party repair.
- The footer trademark line describes "Samsung" as a trademark of Samsung
  Electronics **used here to describe the appliances we are authorised to
  repair** — it no longer disclaims affiliation.

Everything else in the copy stays as careful as the client wrote it: the
three-month warranty applies "only when it is stated on the invoice", testing
"does not guarantee that an unrelated component will not fail later", and a
repair estimate comes **after** inspection. Do not firm those up.

**Content lives in one place per sentence.** No paragraph of body copy appears
on two pages — checked mechanically by `scratchpad/coverage.py`, not by eye:

| Source section | Where it lives |
| --- | --- |
| Hero copy (authorised repair centre) | index hero |
| About + intro paragraphs | index split band, under one heading |
| Promotional blurbs, keywords in `<strong>` | index service cards |
| Common *appliance* Problems + What We Inspect + Care Tips | index `#explore`, all three per row |
| Appliance overviews (both paragraphs) | services.html |
| What Customers Can Expect (6 items) | about.html, under the team |
| How Our Appliance Repair Process Works (6 steps) | index `#process` |
| Samsung Appliance Repair Costs | index `#costs` |
| Coverage statement | areas.html page head |
| Frequently Asked Questions (8) | index `#faq` + FAQPage JSON-LD |

Repeated **labels** — the seven service names, "Explore Samsung Services in the
UAE" — are navigation, and are expected on more than one page. Repeated
**sentences** are not.

**Keyword density is measured too.** `scratchpad/density.py` reports how often
each page says "Samsung". Anything at or above 3% is flagged; services.html hit
5.9% when every heading and every opening sentence carried the brand, and is
2.4% now. The brand stays in headings, which is where it earns its place — what
came out were the body sentences repeating it directly beneath a heading that
already said it.

**The site must not repeat itself, and there is a tool that measures it.**
`scratchpad/redundancy.py` reports three things: phrases that recur three or
more times, sentence pairs above 55% word overlap, and sentences that open the
same way. It scored 112 when the first draft of the promotional copy ran one
template through all seven appliances; it is 36 now, with zero near-duplicate
sentences. What is left is inside the client's own symptom lists — several
appliances genuinely share "an error message appearing on the control panel" —
and in place names, neither of which can go without losing information.

Run it after any copy change. If the score climbs, something is being said
twice. Note that headings and link labels are excluded from the sentence
comparison on purpose: naming the same appliance in the nav and in a section
title is how a reader finds their way, not repetition.

Where a client sentence had to be reworded to break a pattern, the original and
the facts that must survive it are recorded in `coverage.py` under `REWORDED` —
seventeen of them, each checked against the component list or claim it carried,
so a rewrite cannot quietly drop a part from one of the long inspection lists.

The service-card blurbs are the only marketing prose on the site that is not
from the client's source document. They live in `content.py` as `promo`, and
they are the one field that is **HTML rather than text** — the target keywords
carry `<strong>`, so `build_content.py` interpolates them raw instead of
through `esc()`.

## Placeholders that must not be invented

`scratchpad/legal.py` carries [SQUARE BRACKET] values: the registered legal
name, the trade licence, the workshop address and the privacy contact.
**Do not fill any of them with something plausible.** They are business facts
that only the client holds, and a made-up licence number on a legal page is
worse than a visible gap.

The named-technician section is gone from the about page at the client's
request, so the technician placeholders went with it. If it ever comes back,
the same rule applies: a named engineer with an invented certification is a
false credential.

The reviews section on the home page is presented as **Google reviews**, with a
"Verified Google review" badge and an aggregate score. The six review bodies in
`team.py` are drafts written from a sample testimonial the client supplied.
The names on them are written copy, not attributions: no customer has been
asked, and the client asked for the area and the date to be left off. That
badge raises the stakes, because a badge is a claim about Google rather than
about us, and an entry under it that is not on the profile is a fabricated
third-party endorsement rather than marketing copy. Before `DATA_IS_REAL` is
set, every entry has to be replaced with a review that actually exists on the
Google Business Profile, carrying that reviewer's name and their words, and
`GOOGLE_PROFILE_URL` has to point at the real profile, which is what turns the
review count into a link a visitor can check.

## Dates are a claim, not a counter

Every page carries a `WebPage` node with `datePublished` / `dateModified`,
which is the half search engines read. The footer no longer shows a visible
date; the only visible ones left are on the about, privacy and terms pages,
where a revision date is part of what the document is for. Those dates are
literals in
`scratchpad/build_dates.py`, not generated at build time, and the sitemap
`lastmod` matches them.

Change them when the content actually changes. A date that bumps itself on
every deploy is not a freshness signal — it is a lie that search engines learn
to discount.

## Stack

Hand-written HTML, one CSS file, one JS file. No framework, no build step, no
package manager, **no external requests of any kind**. What is in the repo is what
gets served. Do not introduce a bundler, CDN link or web font unless asked — the
strict CSP in `.htaccess` would block it and the host is shared cPanel.

## Layout

```
index.html            Home: hero, about band, 7 service cards, Explore (faults +
                      diagnosis + care per appliance), reviews, areas,
                      6-step stepper, costs, FAQ, CTA
services.html         Appliance overviews, one section each (#washing-machine,
                      #ac-repair, #refrigerator, #microwave, #dishwasher,
                      #cooking-range, #dryer), each linking into Explore
areas.html            Coverage by emirate
about.html            Six long-form sections, each with a photo, then what to expect
privacy.html          Privacy policy, 10 numbered clauses
terms.html            Terms of service, 14 numbered clauses
contact.html          Contact details + validated booking form
blog.html             Post listing (placeholder entries)
404.html              Error page, wired via ErrorDocument in .htaccess

assets/css/style.css  Whole design system. 22 numbered sections, tokens in :root
assets/js/main.js     Mobile nav, dropdown, header shadow, footer year,
                      FAQ accordion animation, reviews slider, form validation
assets/img/           logo.png, icons, og-image.jpg, and the real photography as
                      samsung-*.webp (hero, split band, one per service)
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
| `--primary-dark` | `#0961c6` | blue **surfaces** that carry white text (top bar, CTA band), and links on a light background |
| `--primary-light` | `#7fbaff` | a blue accent **on** a dark surface — eyebrows, and links in `.section-dark` / `.page-head` |
| `--secondary` | `#323333` | every dark surface: dark sections, footer, inner page heads |
| `--btn` | `#010202` | **buttons only** — nothing else |

`#010202` is the button colour, not a background colour. Dark surfaces are
`--secondary`. Getting this backwards makes the whole site read as black, which is
the opposite of the brand.

`--primary` (#2189ff) is only 3.45:1 on white and 3.67:1 on `--secondary`, so it
must never carry small text on either. Use `--primary-dark` on white and
`--primary-light` on dark — the default link colour is `--primary-dark`, so a
link dropped into a dark section needs the override that `.page-head p a` and
`.section-dark a:not(.btn)` provide. Text on the `#323333` surfaces uses `--on-dark`,
`--on-dark-soft` and `--on-dark-muted`, all of which clear AA.

**"Not sure which one it is?" is a `<p class="svc-invite-title">`, not a heading.**
It is set at `<h2>` size on purpose, but it introduces the card grid rather than
titling a section of its own — as an `<h2>` it was a heading with nothing
beneath it, which is a hole in the document outline. Because it is a `<p>` it
does not pick up `.section-dark`'s white heading colour, so the rule sets
`color: #fff` explicitly. Anything similar should follow the same pattern.

**Everything is left-aligned.** No centred section heads, no centred hero, no
justified paragraphs, no centred cards. There is no `.center` modifier any more,
and `.text-center` is deliberately defined as `text-align: left` so stale markup
cannot re-centre anything. Do not add `text-align: center` to new components.

**There are exactly three buttons in the body of the whole site**, and they are
all on the home page: the two in the hero, and the one in the About band. Every
other call-to-action button was removed at the client's request — the service
cards, the Explore rows, the areas block and the closing CTA band on every page
now carry their message without one. The CTA bands were kept; only their buttons
went. Do not add a button back to a body section without asking.

The exceptions, which are not CTA buttons and must stay: the contact page's
phone and WhatsApp buttons (they *are* the contact details), its form submit,
the header phone button, and the floating WhatsApp/call actions.

**Buttons are small and quiet**: `.62rem 1.25rem`, `.88rem`, weight 600, 1px
border, 4px radius, and a 1px lift on hover. `.btn-sm` and `.btn-lg` sit either
side. Do not scale them up for emphasis — use position and whitespace instead.
Primary calls to action carry a trailing arrow:
`<svg class="btn-arrow"><use href="#i-arrow"></use></svg>` inside the `.btn`.

**Photography is `.webp`, named `samsung-<subject>.webp`.** Keep filenames
kebab-case — a space becomes `%20` and an `&` has to be escaped in `src`, which is
a needless way to break an image. Every `<img>` carries the file's real pixel
`width`/`height`; CSS `aspect-ratio` and `object-fit: cover` handle the framing, so
a replacement photo of a different size only needs those two numbers updated.

Two kinds of image, treated differently:

- **Lifestyle shots** (`samsung-*-repair.webp`) — engineers and kitchens. Cropped
  with `object-fit: cover`; used in the hero, the split band and the service cards.
- **Product cut-outs** (`samsung-*-problems.webp`) — a single appliance on a
  **transparent** background (RGBA, alpha 0), used in the detail rows. They carry
  `class="is-product"`, which sets `object-fit: contain` so the appliance is never
  cropped, and a `transparent` background so it sits directly on whatever section
  it is in — `--bg-soft` on the home page, white on services.html. Keep
  replacements transparent; giving them a background of their own puts a visible
  plate behind the appliance.

  When checking one of these in Python, open it as RGBA. `Image.open(f).convert('RGB')`
  discards the alpha channel and reports transparent pixels as `(0, 0, 0)`, which
  reads as a black background when there is none.

**The hero overlay is contrast-critical.** `.hero::after` is weighted to the left
on desktop so the photograph stays visible on the right, and switches to a
vertical wash below 900px where the copy spans the full width. Both were measured
against the actual hero image with the text hidden: worst case 10.22:1 on desktop
and 8.19:1 on mobile, against a 4.5:1 minimum. **Re-measure whenever the hero
photo or the hero copy changes** — not just the photo. Lengthening the copy
pushes it further across the picture and dropped the desktop figure to 4.61:1,
which is why the 38% and 68% stops in `.hero::after` are darker than they were.
`scratchpad/herocontrast.mjs` captures the crop and `herocontrast.py` measures it.

**Nothing on this site is a circle.** Every icon tile, badge, social chip and
floating action uses `--radius-icon` (7px). Do not write `border-radius: 50%` or
`999px` — the only round things left are the 6–8px bullet dots in list markers.
This is a standing rule, not a one-off for a single section.

**Two components have geometry worth knowing before you touch them:**

- `.split` is a two-column band whose image bleeds to the viewport edge while the
  copy stays aligned to the site container. That alignment comes from
  `.split-body { max-width: calc(var(--wrap) / 2); margin-left: auto }` — not from
  a `.container`, so do not wrap the body in one.
- The FAQ is a real `<details>` element. `<details>` still cannot be transitioned
  in every browser, so `main.js` animates its height with the Web Animations API
  and calls `preventDefault()` on the summary click. Two consequences: that block
  **must stay above the booking-form section in `main.js`**, which returns early
  on pages with no form, and the accordion must keep working with the script
  absent — so never move the open/close state out of the `open` attribute.
  `prefers-reduced-motion` skips the animation entirely.
- `.steps` draws one continuous connector line via `.steps::before`, and the
  opaque icon tiles sit on top of it, which is what makes it read as separate
  segments. The line has to start and end at the centre of the first and last
  tile, and the tiles are **left-aligned in their columns** (like everything
  else on the site), so the insets are `--step-size / 2` on the left and
  `one column − --step-size / 2` on the right. Both are derived from
  `--step-count`, so changing the number of steps only means changing that one
  token — set it on `.steps` and the grid and the line both follow. It used to
  be hard-coded for five columns; going to six left the line hanging in mid-air
  until it was rewritten. The line is hidden below 1100px, where the grid drops
  to three columns and the maths no longer applies.
- `.why-grid` is three across because there are six cards. Four across leaves a
  ragged row of two.

**The header is white, the top bar and footer are black.** Anything added to the
header needs dark-on-light colours; anything added to the top bar or footer needs
light-on-dark. The logo PNG has a dark mark, so it sits bare on the white header
but keeps a white plate in the footer (`.footer-logo`).

**`#2189ff` is not a text colour on white** — it measures 3.45:1, below WCAG AA.
Use `--primary-dark` (#0961c6, 5.9:1) for links, eyebrows, and any button
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

## URLs

**The canonical URL of every page is extension-less with a trailing slash** —
`/`, `/services/`, `/contact/`. The files on disk stay flat (`services.html`) and
`.htaccess` section 2 maps one onto the other. Three things follow, and getting
any of them wrong breaks either the page or the SEO:

- **Every internal link, canonical, `og:url`, sitemap entry and JSON-LD URL uses
  the slash form.** `/services.html` and `/services` both 301 onto `/services/`,
  so a link written the old way still lands — but it costs the visitor a redirect
  and splits the ranking signals across two URLs until Google re-crawls. There is
  no reason to write one.
- **Asset and link paths are root-relative: `/assets/…`, not `assets/…`.** This is
  not a style preference. Served at `/services/`, a relative `assets/css/style.css`
  resolves to `/services/assets/css/style.css` and 404s, so the page arrives with
  no stylesheet at all. Same for `/send.php` in the form action, `/favicon.ico`
  and `/site.webmanifest`.
- **The rewrite rules are order-dependent and every one carries
  `RewriteCond %{ENV:REDIRECT_STATUS} ^$`.** Read the comment in `.htaccess`
  before editing them. Short version: the redirects match on `THE_REQUEST`, so
  the internal rewrite cannot feed itself back into them and loop; the
  `REDIRECT_STATUS` guard stops the ErrorDocument subrequest from being
  redirected instead of rendered. Both were found by running a real Apache
  against this `.htaccess` — the second one only shows up on `/404.html`.

**Adding a page** means: the file `foo.html`; links to it written `/foo/`; a
self-canonical `https://host/foo/`; a `<loc>https://host/foo/</loc>` in
`sitemap.xml`; and a `cp` line in `.cpanel.yml`. No `.htaccess` change — the
rules are generic.

`404.html` is the ErrorDocument and deliberately has **no** canonical and **no**
`og:url`: it renders at whatever URL the visitor asked for, so any fixed URL on it
would be a lie. Rule A in `.htaccess` also makes `/404`, `/404/` and `/404.html`
answer with a real 404 status instead of 200 — that is what keeps it from being a
soft 404, i.e. an indexable thin page.

To check the rules after editing them, run a real Apache over the repo rather
than trusting the regexes by eye:

```bash
apt-get install -y apache2 && a2enmod rewrite headers expires deflate
# DocumentRoot at the repo, AllowOverride All, then:
curl -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://127.0.0.1:8100/services.html
```

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

Replace: the phone number `+971 50 000 0000` (appears in `tel:`, `wa.me`, the
top bar, the footer, the hero, the floating call button and the three branch
cards), `info@example.com`, every `example.com` URL in canonicals / Open Graph
/ sitemap / JSON-LD, the `#` social links, and the blog entries. Set
`TO_EMAIL` and `FROM_EMAIL` in `send.php`. Uncomment the HTTPS redirect and
pick a canonical host in `.htaccess`, then lift the two noindex layers.

The three branch addresses in `content.py`'s `BRANCHES` are real and already
in place, in the top bar, on the contact page, in the branch cards beside the
repair costs, and in the LocalBusiness schema.

The **body copy is final**. It is the client's own text and is not a
placeholder. The photography is stock and can be swapped, but re-measure the
hero contrast if the hero shot changes, and keep the `-problems.webp` cut-outs
transparent.

## Copy: no em dashes

There is not one em dash or en dash in the visible copy, and that is
deliberate. The client reads a dash-joined clause as machine-written, so a
sentence that wants one gets rewritten instead: a full stop, a comma, a
colon, or a rephrase. Ranges are spelled out too — "Mon to Sun, 8am to 10pm",
"Jumeirah 1 to 3" — rather than set with an en dash.

`scratchpad/aitells.py` asserts this, along with a list of the usual
machine-written giveaways ("not just X but Y", "when it comes to", "seamless",
"designed to", "rest assured", and forty more). Run it after any copy change.
Prose inside the Python build scripts is exempt; it never ships.
