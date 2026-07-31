# Samsung Services Center

Website for a Samsung home-appliance repair business serving the UAE. Hand-written
HTML, CSS and vanilla JavaScript — no build step, no dependencies, no external
requests. Deploys to any shared cPanel host.

**Status: development.** The layout, markup, SEO scaffolding, accessibility work
and the body copy are complete. The contact details, domain and photography are
still placeholder, and the site is deliberately **blocked from search
engines**. See [section 3](#3-search-engine-blocking-development-phase) before launch.

---

## Pages

| File | URL | Purpose |
| --- | --- | --- |
| `index.html` | `/` | Home — hero, about band, 7 service cards, Explore (faults, diagnosis and care per appliance), coverage, 6-step process, costs, FAQ, CTA |
| `services.html` | `/services/` | Appliance overviews, anchored (`#washing-machine`, `#refrigerator`, …), each linking into Explore on the home page |
| `areas.html` | `/areas/` | Coverage listed emirate by emirate |
| `about.html` | `/about/` | What customers can expect from a repair visit |
| `contact.html` | `/contact/` | Contact details and a validated booking form posting to `send.php` |
| `blog.html` | `/blog/` | Post listing (placeholder entries) |
| `404.html` | — | Error page, served via `ErrorDocument`; has no URL of its own |

The URL column is the canonical form. `.htaccess` maps `/services/` onto
`services.html` internally, and 301s both `/services.html` and `/services` onto
it, so every page has exactly one address.

## Local preview

The site can no longer be previewed over `file://` or a plain static server: asset
paths are root-relative (`/assets/…`) and the pretty URLs need the rewrite rules,
so either would give you an unstyled page and broken links. Run Apache over the
repo instead:

```bash
apt-get install -y apache2
a2enmod rewrite headers expires deflate
# add a vhost with DocumentRoot = this folder and AllowOverride All, then
apache2ctl start
curl -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://127.0.0.1:8100/services.html
```

That is also the only way to test the rest of `.htaccess` — redirects, gzip,
caching and the security headers — before deploying.

## Design tokens

The palette and type live in `:root` at the top of `assets/css/style.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--primary` | `#2189ff` | icons, accents, anything on a dark background |
| `--primary-dark` | `#0961c6` | links, eyebrows, blue surfaces that carry white text |
| `--secondary` | `#323333` | every dark surface — dark sections, footer, page heads |
| `--btn` | `#010202` | button fill, and nothing else |

`#2189ff` measures **3.45:1** on white, below the WCAG AA minimum of 4.5:1, so it is
never used for text — `--primary-dark` (5.9:1) is. Keep that split if you add
colours.

Typography uses Samsung's own faces first (`SamsungOne`, `Samsung Sharp Sans`) and
falls back to the system UI stack, so the site adopts them automatically once the
font files are present. See `assets/fonts/README.md` for how to self-host them and
for a free alternative.

---

## 1. Connecting the repo to cPanel

This repo ships a `.cpanel.yml`, which is the file cPanel's Git Version Control
needs in order to deploy.

**One-time setup**

1. cPanel → **Files** → **Git Version Control** → **Create**.
2. Leave *Clone a Repository* **on**.
3. **Clone URL:** `https://github.com/Shakeeb871/samsungservices-center.git`
4. **Repository Path:** `/home/<your-cpanel-user>/repositories/samsungservices-center`
   — keep it **outside** `public_html`. The repo is the source; `public_html` is the output.
5. **Repository Name:** `samsungservices-center` (a label only) → **Create**.

For a private repo, cPanel cannot use a password: open **Terminal**, run
`ssh-keygen -t ed25519`, add `~/.ssh/id_ed25519.pub` to GitHub under
*Settings → Deploy keys*, and clone the SSH URL instead.

**Check the deploy path.** `.cpanel.yml` copies the site into `$HOME/public_html/`,
which is right for a **primary** domain. For an addon domain or subdomain, change:

```yaml
- export DEPLOYPATH=$HOME/public_html/
```

to the document root cPanel lists for that domain, then commit before deploying.

**Publishing.** Git Version Control → the repo → **Manage** → *Pull or Deploy* →
**Update from Remote**, then **Deploy HEAD Commit**. Pushing to GitHub alone does
**not** update the live site.

To automate it, add a GitHub webhook pointing at your cPanel deploy endpoint, or
run this from a cPanel cron job:

```bash
cd ~/repositories/samsungservices-center && git pull && /usr/local/cpanel/bin/cpanel-git-deploy
```

**If a deploy fails**

| Symptom | Cause |
| --- | --- |
| "No `.cpanel.yml` found" | You deployed a commit from before the file existed — pull first |
| Files land in the wrong folder | `DEPLOYPATH` is wrong; see above |
| A new page 404s after deploy | It has no `cp` line in `.cpanel.yml` — every page needs one |
| Old page still showing | Clear the cPanel/Cloudflare cache and hard-refresh |

---

## 2. Connecting the repo to Claude

`CLAUDE.md` in the repo root gives Claude the project context — stack, layout,
conventions, the contrast rule, the deploy flow — so the code side is already set up.

To work on this repo from the web:

1. Open **[claude.ai/code](https://claude.ai/code)**.
2. Pick or create an environment and add **`Shakeeb871/samsungservices-center`** as a
   source. If the repo is not listed, authorise the **Claude GitHub App** for the
   `Shakeeb871` account and grant it access.
3. Describe the change. Claude commits to a branch and pushes; you review the pull
   request on GitHub, merge, then deploy from cPanel.

For the CLI:

```bash
git clone https://github.com/Shakeeb871/samsungservices-center.git
cd samsungservices-center && claude
```

Keep `CLAUDE.md` current — when the structure or the deploy path changes, update it
in the same commit.

---

## 3. Search-engine blocking (development phase)

Two layers keep the site out of Google while it is being built:

| Where | What |
| --- | --- |
| every `.html` `<head>` | `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">` |
| `.htaccess` section 7 | `Header always set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet, noimageindex"` |

The header layer matters because it covers files a meta tag cannot reach — images,
PDFs, anything non-HTML.

**Why `robots.txt` still says `Allow: /`.** This looks backwards but is correct.
`Disallow: /` blocks crawling, and a crawler that cannot fetch the page never sees
the noindex — so any URL Google already knows can sit in the index indefinitely,
often shown as a bare title with no description. Allowing the crawl lets Google
read the noindex and drop the page properly.

**For a hard lock** (nothing public at all, not even to someone with the URL), use
cPanel → **Directory Privacy** on the document root. That returns 401 to everyone,
crawlers included.

**Verify after deploying:**

```bash
curl -I https://your-domain.com/          # expect: x-robots-tag: noindex, nofollow, ...
curl -sI https://your-domain.com/ | grep -i content-security   # CSP present
curl -s -o /dev/null -w "%{http_code}\n" https://your-domain.com/no-such-page   # 404
```

### Launch checklist

Do these in one commit, then deploy:

1. Delete the `<meta name="robots">` line from all seven `.html` files.
2. Delete the `X-Robots-Tag` block from `.htaccess` section 7.
3. Replace every `example.com` — `rel=canonical`, Open Graph `og:url` / `og:image`,
   `sitemap.xml`, and the JSON-LD blocks in `index.html`, `services.html` and
   `contact.html`.
4. Replace the placeholder business details: `+971 50 000 0000` (in `tel:`, `wa.me`
   and visible text), `info@example.com`, the Business Bay address, the `#` social
   links.
5. Replace the placeholder images in `assets/img/` — keep the filenames and the
   aspect ratios (`hero.jpg` 16:9, `service-*.jpg` 10:7, `cta.jpg` 25:18,
   `og-image.jpg` 1200×630) and no markup needs to change.
6. Uncomment the `Sitemap:` line in `robots.txt` and the HTTPS redirect in
   `.htaccess`; pick a canonical www / non-www host there too.
7. Enable HSTS in `.htaccess` **only after** HTTPS is confirmed working.
8. Set `TO_EMAIL` and `FROM_EMAIL` at the top of `send.php`. `FROM_EMAIL` must be
   an address on this domain, or the host's mail server will drop the message.
9. Deploy, then submit the sitemap in Google Search Console and request indexing.

Missing step 1 or 2 is the usual reason a brand-new site never ranks. Check both.

**Confirm the URL scheme survived the deploy** — a host that ignores `.htaccess`
serves the pretty URLs as 404s, and one that overrides `DirectoryIndex` breaks the
home page:

```bash
for u in / /services/ /services.html /services /404.html /no-such-page; do
  printf '%-18s ' "$u"
  curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "https://your-domain.com$u"
done
# expect: 200 / 200 / 301 to /services/ / 301 to /services/ / 404 / 404
```

---

## 4. What is already implemented

**SEO.** Unique title and meta description per page (within length limits),
canonical URLs, Open Graph and Twitter card tags, semantic landmarks, exactly one
`<h1>` per page with no heading-level jumps, breadcrumbs with `BreadcrumbList`
schema, `LocalBusiness` + `WebSite` + `FAQPage` schema on the home page, `ItemList`
of `Service` entities on services, `ContactPage` on contact, `sitemap.xml`,
`robots.txt`, and a real 404 page.

**Accessibility.** Skip link, keyboard-operable nav and dropdown with correct
`aria-expanded` / `aria-controls` and Escape handling, visible `:focus-visible`
outlines, `aria-current="page"` on the active nav item, labelled form fields with
`aria-invalid` and `role="alert"` error messages, `aria-live` submit status,
decorative SVGs hidden from screen readers, meaningful `alt` on every image,
accessible names on every icon-only link, `prefers-reduced-motion` and
`forced-colors` support, and a palette checked against WCAG AA.

**Performance.** No external requests. Inline SVG sprite instead of an icon font.
Hero preloaded with `fetchpriority="high"`; everything below the fold lazy-loaded
and async-decoded. Explicit image dimensions so CLS stays at zero. Deferred script.
Brotli/gzip and one-year immutable caching for assets configured in `.htaccess`.

**Security.** Strict `Content-Security-Policy` (`default-src 'self'`),
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`, directory listing disabled,
dotfiles and repo files denied, `.git` returning 404, HSTS ready to enable.

**Responsive.** Breakpoints at 1100, 980, 900, 720 and 460px. Verified with no
horizontal overflow at 390, 820 and 1440px.

### Not done yet

- Each of the seven services should become its own page with its own title,
  canonical and `Service` schema. They currently share `services.html` as anchors,
  which is fine for launch but weaker for local search than individual pages.
- Blog posts are listing entries only; each needs its own page with `BlogPosting`
  schema.
- No analytics. Adding any third-party script means adding its host to the CSP in
  `.htaccess` — the strict policy will block it otherwise.
- The contact form has no server side and no spam protection.
