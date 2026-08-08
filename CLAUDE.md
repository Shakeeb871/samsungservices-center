# Samsung Services Center

Static marketing site for a Samsung home-appliance repair business serving the UAE
(Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah). The body copy is the
client's own. The domain, the phone number, the two inboxes and the three
branch addresses are all real and live. What is still placeholder is named in
"Before going live", and none of it may be invented.

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

Repeated **labels** — the seven service names, "We Service & Repair All Samsung
Appliances Problems" — are navigation, and are expected on more than one page.
Repeated **sentences** are not.

That section title has changed once already. When it changes again, the
sentence on services.html that points at it by name has to change with it, or
the link promises a heading the destination does not carry; and the old string
goes into `coverage.py`'s `SUPERSEDED` set, otherwise coverage reports it as a
source unit that went missing.

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

`scratchpad/legal.py` carries one [SQUARE BRACKET] value: `[EMIRATE]` in
terms clause 13, the emirate whose courts have jurisdiction. **Do not fill it
with something plausible.** That is a legal choice, not a fact to be read off
the branch address.

Three others are gone, removed at the client's request rather than filled: the
registered legal name, the trade licence and the registered address. The two
clauses that carried them were rewritten to work without them, and both still
do their job under the name the whole site trades under:

> Samsung Service Center is the controller of the personal data described
> here.

> They are an agreement between you, the customer, and Samsung Service Center.

If the real values ever arrive, they belong back in those two sentences.
`llms.txt` states that the business does not publish them, so that paragraph
has to change at the same time.

The two contact placeholders that used to be here are filled — the privacy
contact is `info@samsungservices-center.com` and the complaints address is
`support@samsungservices-center.com`, both supplied by the client.

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

**`AggregateRating` is now published**, at the client's explicit request, and
that is a second, larger step than the badge. `team.py`'s `PUBLISH_RATING`
gates it; `build_meta.py` reads the value and the count straight off `REVIEWS`
so the markup and the visible summary can never disagree, and it is what puts
stars in a search result. Google's review-snippet guidelines require those
ratings to be genuine, and a manual action for review spam lands on the
client's own domain. Individual `Review` nodes are deliberately still **not**
emitted: the stars come from the aggregate alone, and a `Review` node attaches
a named person to a specific quote, which is a far more specific claim.
Replacing the six drafts with real profile reviews is what makes the whole
thing true; setting `PUBLISH_RATING = False` takes the markup back off without
touching the visible section.

## Dates are a claim, not a counter

**There is no visible date anywhere on the site**, and no `<time>` element.
The "Last updated 31 July 2026" line on the about, privacy and terms page
heads is gone, and so are the three dates on the blog cards, all at the
client's request. `fixdead.py` strips them after every build, so a skeleton
clone cannot bring one back, and the three CSS rules that styled them are
removed.

What stays is the `datePublished` / `dateModified` pair on every page's
`WebPage` node. That is the half search engines actually read, it is not
visible to a reader, and `sitemap.xml` takes its `<lastmod>` from it — remove
it and the sitemap loses the one field Google does use. Those dates are
literals in `scratchpad/build_dates.py`, not generated at build time.

Change them when the content actually changes. A date that bumps itself on
every deploy is not a freshness signal — it is a lie that search engines learn
to discount.

## Every page except the home page opens on the same photograph

`assets/img/samsung-home-appliances-repairer.webp` is the backdrop of the
`.page-head` band on all nine inner pages. It is decorative — `alt=""`, the
heading is the content — and it sits under a wash that is weighted to the left
on desktop and vertical on mobile, mirroring the hero.

**Do not lighten those stops without re-measuring.** `scratchpad/headcontrast.mjs`
plus `headcontrast.py` screenshot each band with the copy hidden and report the
worst contrast behind the real glyph line boxes; it is 6.14:1 today against the
4.5 AA minimum. Two things that measurement gets wrong if you are not careful,
both now handled: the floating call buttons are `position: fixed` and land in
an element screenshot as if they were the photograph, and an element's box runs
the full column width even when its text stops early, so the sample has to come
from Range rects over the text nodes rather than from the element box.

The file is cropped to the slice the band shows and shipped at three widths,
because `object-fit: cover` was otherwise making every inner page download
420px of image height that never appeared.

## sitemap.xml and llms.txt are generated, not maintained

Both are written by `scratchpad/build_sitemap.py` and `scratchpad/build_llms.py`
from the finished pages, which is why they run at the **end** of
`buildall.sh`, after `golive.py` and `fixdead.py`. Editing either file by hand
lasts until the next build.

**A browser opening sitemap.xml gets `sitemap.xsl` applied** and sees a
readable table. That is not decoration: Chrome's built-in XML viewer styles
itself with an *inline* stylesheet, and this site's CSP sets
`style-src 'self'`, so Chrome refuses it and falls back to an unstyled wall of
blue text that looks broken to anyone who opens the URL. Crawlers ignore the
`<?xml-stylesheet?>` instruction and parse the XML underneath, so none of it
changes what Google reads — verified by parsing the file back after every
build. The CSS lives in `assets/css/sitemap.css` for the same reason the rest
of the site has no inline styles, and `.htaccess` declares `text/xsl`
explicitly because `nosniff` is on and an `.xsl` served as `text/plain` would
put the unstyled view straight back.

**sitemap.xml** carries `<loc>` and `<lastmod>` and nothing else. `<priority>`
and `<changefreq>` were on all nineteen entries with numbers somebody chose by
feel; Google has said for years that it ignores both, so they are gone. That
is not a missing feature, it is the difference between a sitemap that only
says true things and one padded with fields nobody reads. `lastmod` comes from
the page's own `WebPage.dateModified`, so the rule in "Dates are a claim, not
a counter" governs it too. The image sitemap extension lists the 69 content
photographs; icons, the logo and the share image are excluded because they are
chrome, not something to offer to image search.

**llms.txt** is the llmstxt.org convention: one markdown file at the root with
a summary of the business and every page as a link plus a sentence on what it
covers, short enough that a model can hold the whole index and decide what to
fetch. **llms-full.txt** is the text of all nineteen pages in one file, about
35,000 words, for when fetching them one at a time is not worth it. The
summaries are each page's own meta description, so they cannot drift.

The four unfilled legal placeholders are named explicitly in `llms.txt`. A
model that reads `[LICENCE NUMBER]` off the privacy page and repeats it as
fact is a worse outcome than one told plainly that the value is not published.
Keep that paragraph in step with what is actually still bracketed.

`techseo.py` asserts llms.txt lists every indexable page, that it points at
llms-full.txt, and that `.cpanel.yml` copies both — a generator that quietly
stops covering a page is exactly what that check is for.

## Structured data

`scratchpad/build_schema.py` runs over the finished HTML, so it reads what is
really on each page rather than what a builder meant to put there. Everything
it emits is either a fact already visible on the page or a link between two
nodes that already exist.

| Page | Nodes |
| --- | --- |
| index | WebPage, WebSite, LocalBusiness + HomeAndConstructionBusiness, FAQPage, HowTo, Service |
| about | AboutPage, BreadcrumbList |
| contact | ContactPage, BreadcrumbList |
| services, blog | CollectionPage, BreadcrumbList (+ ItemList on services) |
| areas | CollectionPage, BreadcrumbList, ItemList of the four emirates |
| 7 appliance pages | WebPage, BreadcrumbList, Service |
| 4 emirate pages | WebPage, BreadcrumbList, Service (+ HowTo on three) |

Four things worth knowing before touching it:

- **It is one graph, not a pile.** Every page node links to its own
  `BreadcrumbList` (`breadcrumb`), to the thing the page is about
  (`mainEntity`) and to its lead photograph (`primaryImageOfPage`).
  `techseo.py` resolves every `@id` reference against the nodes in the same
  file, so a dangling pointer fails the build rather than sitting there.
- **HowTo only where the page really lists steps.** Three emirate pages and
  the home page carry an ordered list with a heading and a description per
  item. The Dubai page's "How It Works" is prose, so it gets none — a HowTo
  whose steps were invented from paragraphs is a lie in a machine-readable
  field. Extracting them needs a depth-counting split on `<li>`, because a
  step can contain a tick list and a non-greedy regex cuts the step's text in
  half at the nested `</li>`.
- **WebPage has subclasses, and three builders have to agree about it.**
  `AboutPage`, `ContactPage` and `CollectionPage` are all WebPages.
  `build_dates.py` strips "the WebPage node" before re-adding one and
  `build_sitemap.py` reads `dateModified` off it; both were matching the bare
  string `'WebPage'`, so a retyped node survived the strip and the page ended
  up with two. `techseo.py` now fails on more than one page-level node.
- **The business has traded since 2010.** The client supplied the year; the
  site had only said "for more than a decade" and named none. It is
  `foundingDate` on the LocalBusiness node **and** the opening words of the
  About band, so the markup is not the only place the claim exists — a
  structured-data value with nothing visible behind it is the pattern Google
  treats as unsupported. The old sentence is in `coverage.py`'s `SUPERSEDED`
  set. Sixteen years is more than a decade, so nothing the sentence used to
  claim has been weakened.
- **What it deliberately does not emit**: `Review` nodes (see the reviews
  section above), any price or `priceRange` (the site says the estimate
  follows inspection), `geo` (still placeholder), and `speakable` (Google
  restricts it to news publishers).

## The favicon: four separate things had to be right

Nothing blocks it — `robots.txt` allows every crawler, the `X-Robots-Tag`
block is gone, and `.htaccess` section 8 explicitly grants `favicon.ico`
alongside `robots.txt` and `sitemap.xml`. Verified with a real Apache:
`/favicon.ico` and the three PNG sizes all answer 200 with no robots header.

That is worth stating plainly because "Google is not showing our icon" reads
like something is blocked, and on this site it never was. Four things went
wrong instead, in the file and in the way it was served, and each one on its
own is enough to produce the generic globe. Check all four before assuming a
fifth.

The thing that *does* stop a favicon appearing in a search result is its
size. Google's requirement is a square whose sides are a multiple of 48px; it
downsamples to 16x16 itself, but it will not upscale, so a 16x16 source gets
dropped and the generic globe is shown. This site shipped a single-layer
16x16 `favicon.ico` until 4 August.

There is a second half to that, and it is the one that is easy to miss.
**Order inside the `.ico` matters.** Pillow writes the directory
smallest-first, so after 32 and 48 were added, entry 0 was still 16x16. A
parser that reads the first entry rather than scanning for the largest sees
16x16 and is straight back to the same problem. `favicon.py` writes the
directory by hand, largest first — 48, 32, 16 — and asserts by reading the
file back that entry 0 is a multiple of 48.

Third: **the layers are uncompressed DIBs, not PNGs.** Pillow encodes every
`.ico` layer as a PNG. That is legal, but PNG-in-ICO was introduced for the
256x256 layer and is only universally understood there; at 16, 32 and 48 the
form every icon toolchain emits is a plain 32-bit BMP, and a decoder that
assumes BMP below 256 reads the PNG signature as a bitmap header and gets
noise. Nothing here proved Google's decoder is one of those — this is an
unknown removed, not a diagnosed bug, and it costs about 8 KB. `favicon.py`
now writes the DIBs itself (`BITMAPINFOHEADER` with `biHeight` doubled for
the AND mask, BGRA rows bottom-up), asserts no layer starts with a PNG
signature, and decodes each layer back to compare it pixel for pixel against
the resize it came from.

Fourth, and the one most likely to make a *fixed* icon still look broken:
**the icons must not be cached `immutable`.** They were, for a year, by the
images rule in `.htaccess` section 5. `immutable` means "never re-check", so
every cache that picked up the broken 16x16 file is entitled to serve it
until 2026 and never ask again. Replacing the file does not reach any of
them. There is now a `FilesMatch` for `favicon.ico`, `favicon-NN.png` and
`apple-touch-icon.png` at `max-age=86400, must-revalidate`, placed *after*
the images block because both match and the last `Header set` wins. Every
other image keeps the year: a new photograph gets a new filename, the
favicon never does.

There is also an `AddType image/x-icon .ico` in section 1. Section 6 sets
`nosniff`, so on a host whose `mime.types` has no `.ico` entry the file comes
back as `text/plain`, the browser refuses to treat it as an image, and there
is no console warning to tell you — the only symptom is the generic globe.

The head links `favicon-32.png`, `-48`, `-96` and `-144`. Three of those are
multiples of 48, which is the thing Google asks for; the 32 is there because
browsers use it for the tab. All are downscales from `apple-touch-icon.png`
(180x180), the largest square copy of the shield mark in the repo — nothing
is upscaled, which is also why there is no 192 despite the manifest
convention.

`scratchpad/favicon.py` regenerates the whole set from that one master. Rerun
it if the mark changes. Keep the transparency: Google composites the icon
onto its own surface, and a white plate baked into the file shows as a white
square in a dark-themed result.

Last thing, and it is process rather than code: Google refreshes a site's
favicon when it recrawls the **home page**, not when the icon file changes.
There is no way to submit an icon. After deploying, request indexing for the
home page in Search Console and expect days, not minutes. Until the deploy
actually runs in cPanel, none of the above is on the server at all — the
repo being correct proves nothing about what Google fetched.

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
samsung-washing-machine-repair.html
samsung-refrigerator-repair.html
samsung-ac-repair.html
samsung-dishwasher-repair.html
samsung-microwave-oven-repair.html
samsung-cooking-range-oven-repair.html
samsung-dryer-repair.html
                      Long-form appliance pages, one per appliance, all seven.
                      Copy on the left, a sticky rail of sibling appliance
                      pages and site links on the right. All seven render
                      through scratchpad/servicepage.py from one data module
                      each (wm, fridge, ac, dishwasher, microwave,
                      cookingrange, dryer), so the layout, sidebar and schema
                      cannot drift apart. Every appliance link in the nav,
                      the footer, the sidebars and the services.html Service
                      schema points at these pages; nothing on the site links
                      to /services/#slug any more.
                      Adding another: write the data module, add it to
                      PAGE_FOR in servicepage.py, a line each in buildall.sh
                      and build_dates.py, a cp line in .cpanel.yml, a sitemap
                      entry, repoint the nav/footer link, and add the URL to
                      audit_browser.mjs, deadcss.mjs and spacing.mjs.
                      pagecheck.py then proves every supplied sentence
                      landed.
areas.html            Coverage by emirate
samsung-service-center-dubai.html
samsung-service-center-abu-dhabi.html
samsung-service-center-sharjah.html
samsung-service-center-ajman.html
                      One page per emirate, same left-copy / right-rail layout
                      as the appliance pages. Built from scratchpad/
                      locations.py, which holds the copy, and build_locations.py.
                      The slug, the title, the H1 and the nav label all carry
                      the phrase the page targets, "Samsung Service Center
                      <city>"; the earlier /samsung-repair-<city>/ URLs 301
                      onto these (.htaccess rule D2).
                      All four are the client's own long-form copy, each
                      checked sentence by sentence against its source document
                      by scratchpad/citycheck.py — the documents live beside
                      it as *_supplied.txt.
                      Sharjah and Ajman carry no 'areas' block: their supplied
                      copy names the districts itself, so the pin list
                      underneath would print them twice. Ajman carries no
                      'centre' block either — BRANCHES has no Ajman address,
                      and the paragraph the page used to carry ("We do not
                      have a service centre in Ajman") contradicts the heading
                      the client has since supplied. If an Ajman address ever
                      arrives, add it to BRANCHES and put the block back.
                      build_locations.py composes each page from an ordered
                      list of blocks. A city that supplies its own `blocks`
                      gets exactly that order, which is how the two long pages
                      keep the district list and the branch address inside the
                      supplied copy instead of losing them. Inside a block, a
                      plain string is a paragraph and a tuple is one of
                      ('h3', title), ('ticks', [...]) or ('steps', [(title,
                      [paras])]) — the last reuses .fault-list, so a numbered
                      process gets the same badge as the fault entries. Any of
                      those strings may carry [[label|/path/]]; the marker is
                      resolved after esc(), so the copy stays plain text and no
                      source string is trusted as raw HTML.
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

**There are no social links except WhatsApp.** The footer's row of four and
two of the three in the top bar were all `href="#"`, which reads as a
placeholder on a development site and as a link that scrolls you to the top of
the page on a live one. Nobody has supplied the real profile URLs, so they were
removed rather than invented. The top bar keeps the WhatsApp icon, which points
at the real number. To put them back: a `<ul class="social">` under the footer
logo, plus the three `.site-footer .social` rules noted in `style.css` where
they used to be, and a `sameAs` array on the LocalBusiness node.

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

**One origin: `https://samsungservices-center.com`.** Before this was
enforced, four spellings of every page each answered 200 in their own
right: http and https, crossed with www and non-www. That is four URLs of
identical content with the link signals split across them. Two rules at the
top of `.htaccess` section 2 send the other three to the canonical one, and
they are ordered so every case costs exactly one redirect: the www rule
goes straight to `https://` rather than preserving the scheme, so
`http://www/` does not take two hops.

Non-www was chosen because that is what the canonical tags already said.
Switching to www means changing both rules **and** `HOST` in
`scratchpad/golive.py`, which is what writes the canonicals.

If the site ever stops loading after a deploy, the first suspect is rule ii
(`http -> https`) against a certificate that does not cover the domain.
Comment out those three lines and run AutoSSL. Rule i is safe either way.

Verify with a real Apache after touching any of it — the matrix that
matters is the four host/scheme spellings of one deep page, not just the
home page:

```bash
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' \
  -H 'Host: www.samsungservices-center.com' http://127.0.0.1:8100/samsung-service-center-dubai/
```

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

## Search engines: open, and nothing is blocked

The two layers that used to hold the site out of the index are gone, and they
came off together because either one left behind blocks the site with no
visible symptom:

1. the `noindex` meta tag on every page, now
   `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`.
   Those three `max-*` values are opt-in, which is why they are stated rather
   than left to the default.
2. the `X-Robots-Tag` block in `.htaccess` section 7, removed. Section 7 is
   now a comment recording what was there.

`robots.txt` names fifteen crawlers explicitly on top of `User-agent: *` —
GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended and the
rest — because some of them treat a specific record as the only one that
applies to them, so a bare wildcard is not reliably read as permission. It
also declares the sitemap, which is how non-Google crawlers find it.

Do **not** set `Disallow: /` here if the site ever needs hiding again: a
blocked crawler never reads the noindex, so URLs Google already knows would
stay indexed. Put the noindex back instead, or use cPanel → Directory Privacy.

**Any new page inherits the positive robots meta from the skeleton** —
`newpages.py` clones `areas.html`. Check it is there before pushing.

`scratchpad/golive.py` is the script that did all of this. It is idempotent,
so re-running it after a rebuild is safe and is the way to catch a page that
came back from a builder with the old markup.

## The build and check scripts

`scratchpad/buildall.sh` regenerates every `<main>` from the content modules.
Two scripts run **after** it, every time, because the builders rebuild pages
from a skeleton and would otherwise undo them:

```sh
sh buildall.sh && python3 golive.py && python3 fixdead.py
```

- `golive.py` — the positive robots meta, the canonical host, the twitter card
  fields, the share-image alt, the phone number, robots.txt and the
  X-Robots-Tag removal. Idempotent; re-running it is how you catch a page that
  came back from a builder with stale markup.
- `fixdead.py` — strips the dead social links and puts `noindex` back on
  `404.html`, which is the one page that should still carry it.

Then the checks. `techseo.py` is the one that looks *between* pages, which is
where the real problems live: a title repeated on two of them, a sitemap entry
nothing links to, an internal link written in a form that 301s, an orphan page,
a heading level skipped, a file `.cpanel.yml` never copies. `audit_static.py`
and `audit_browser.mjs` look at one page at a time.

## Deployment

Pushing to `main` does not publish. cPanel pulls and deploys:
Git Version Control → the repo → *Pull or Deploy* → **Update from Remote**, then
**Deploy HEAD Commit**, which runs `.cpanel.yml`.

`.cpanel.yml` copies named files into `$HOME/public_html/`. **Adding a new page
means adding a `cp` line for it** — otherwise it silently never reaches the server.
If the site is on an addon domain, change `DEPLOYPATH` to that document root.

## Before going live

Done: the phone number is `+971 50 619 1442` in `tel:`, `wa.me` and the
visible text on all twenty pages, driven by `content.py`'s `PHONE_HREF` /
`PHONE_TEXT`; the host is `https://samsungservices-center.com` in every
canonical, `og:url`, sitemap entry and JSON-LD `@id`; both indexing blocks
are off.

Two inboxes are live, and the site says which is which rather than listing
both under one "Email" label:

| Address | Where |
| --- | --- |
| `info@samsungservices-center.com` | footer "General", contact page "General enquiries", LocalBusiness `email`, the customer-service `contactPoint`, the privacy-policy contact, `send.php` `FROM_EMAIL` |
| `support@samsungservices-center.com` | footer "Support", contact page "Existing repairs", the technical-support `contactPoint`, the terms complaints clause |

`send.php` posts bookings to **both**, comma-separated. Nobody said which
address owns the form, and a booking in the wrong inbox is still a booking
while a booking in neither is a lost customer. `FROM_EMAIL` has to be a real
mailbox on this domain or cPanel's mail server rejects the message, which is
why it is `info@` rather than a `no-reply@` that may not exist; the customer's
own address is on `Reply-To`.

The Search Console tag
(`google-site-verification` / `tNihezSQ...`) is on all twenty pages rather
than only the home page, so verification holds whichever URL the property was
created for. `golive.py` maintains it.

**Still placeholder, and not to be invented:**

- `[REGISTERED LEGAL NAME]`, `[LICENCE NUMBER]` and `[REGISTERED ADDRESS]` in
  `privacy.html` clause 1 and `terms.html` clause 1, and `[EMIRATE]` in
  `terms.html` clause 13. These are live, indexable legal pages now, so the
  gaps are public — but a made-up trade licence on a privacy policy is worse
  than a visible gap, and the governing-law emirate is a legal choice rather
  than a fact that can be read off the branch address.
- the geo coordinates on the LocalBusiness node, and the blog entries.

Not done on purpose: the HTTPS redirect and the canonical-host choice in
`.htaccess` are still commented out. Turning on a forced HTTPS redirect
before the host's SSL certificate covers the domain takes the site down, so
that one needs confirming rather than assuming.

The three branch addresses in `content.py`'s `BRANCHES` are real and already
in place, in the top bar, on the contact page, in the branch cards beside the
repair costs, and in the LocalBusiness schema.

The **body copy is final**. It is the client's own text and is not a
placeholder. The photography is stock and can be swapped, but re-measure the
hero contrast if the hero shot changes, and keep the `-problems.webp` cut-outs
transparent.

## The four appliance pages repeat each other by design

Each one carries the client's own coverage section, and those sections list
the same Dubai, Sharjah and Abu Dhabi districts in near-identical sentences.
`scratchpad/redundancy.py` scores the site at 887 with all seven live and the
four emirate pages beside them, against 51 before any existed. Only one of the
pairs it reports involves an emirate page, so that copy is doing its job, and almost every pair it reports is a coverage
or customer-care line rather than anything about the appliance itself.

This is the supplied copy and has been left alone. It is worth knowing that
six service pages whose area sections read the same way is the shape Google
treats as templated, so if rankings disappoint, those are the paragraphs to
rewrite per appliance first — not the fault lists, which are genuinely
different page to page.

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
