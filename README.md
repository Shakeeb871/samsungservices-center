# Samsung Services Center

Starter website template for a Samsung appliance repair and service business.
Plain HTML/CSS/JS — no build step, works on any shared cPanel host.

**Status:** dummy template, development phase. All copy, phone numbers and email
addresses are placeholders, and the site is **blocked from search engines** — see
[Search engine blocking](#3-search-engine-blocking-development-phase) below before launch.

Branding uses `assets/img/logo.png` (600×180 transparent PNG) in the header and
footer; `favicon.ico` and the touch icon are generated from the shield mark in it.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, six service cards, booking steps, CTA |
| `about.html` | About the business |
| `contact.html` | Booking form (demo handler — not yet sending mail) |

## Local preview

No tooling needed. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

`.htaccess` rules (pretty URLs, gzip, caching) only apply on Apache, so extension-less
URLs will not work in the Python preview — that is expected.

---

## 1. Connecting the repo to cPanel

This repo ships a `.cpanel.yml`, which is the file cPanel's Git Version Control
needs in order to deploy.

**One-time setup**

1. Log in to cPanel → **Files** → **Git Version Control** → **Create**.
2. Leave *Clone a Repository* **on**.
3. **Clone URL:** `https://github.com/Shakeeb871/samsungservices-center.git`
4. **Repository Path:** `/home/<your-cpanel-user>/repositories/samsungservices-center`
   (keep it **outside** `public_html` — the repo is the source, `public_html` is the output).
5. **Repository Name:** `samsungservices-center` → **Create**.

For a private repo, cPanel cannot use a password. Go to **Terminal** in cPanel, run
`ssh-keygen -t ed25519`, then add `~/.ssh/id_ed25519.pub` to GitHub under
*Settings → Deploy keys*, and clone with the SSH URL
(`git@github.com:Shakeeb871/samsungservices-center.git`) instead. This repo is
public, so the HTTPS URL above is fine as-is.

**Check the deploy path**

`.cpanel.yml` copies the site into `$HOME/public_html/`. That is correct for a
**primary** domain. If this site is on an addon domain or subdomain, open
`.cpanel.yml` and change:

```yaml
- export DEPLOYPATH=$HOME/public_html/
```

to the document root cPanel lists for that domain, e.g.
`$HOME/public_html/samsungservices/`. Commit the change before deploying.

**Each time you want to publish**

cPanel → Git Version Control → the repo → **Manage** → *Pull or Deploy* tab →
**Update from Remote**, then **Deploy HEAD Commit**.

Pushing to GitHub alone does **not** update the live site. To automate it, add a
GitHub webhook pointing at your cPanel deploy endpoint, or run
`cd ~/repositories/samsungservices-center && git pull && /usr/local/cpanel/bin/cpanel-git-deploy`
from a cPanel cron job.

**If a deploy fails**

- *"No .cpanel.yml"* — you deployed a commit from before this file existed. Pull first.
- *Files land in the wrong folder* — `DEPLOYPATH` is wrong; see above.
- *Old page still shows* — clear the cPanel/Cloudflare cache and hard-refresh.

---

## 2. Connecting the repo to Claude

Claude reads `CLAUDE.md` in the repo root for project context — stack, file layout,
conventions and deploy steps — so it is already set up on the code side.

To let Claude work on this repo from the web:

1. Open **[claude.ai/code](https://claude.ai/code)**.
2. Pick an environment (or create one) and add **`Shakeeb871/samsungservices-center`**
   as a source. If the repo is not listed, install/authorise the **Claude GitHub
   App** for the `Shakeeb871` account and grant it access to this repo.
3. Start a session and describe the change. Claude commits to a branch and pushes;
   you review the pull request on GitHub, merge, then deploy from cPanel as above.

For the CLI, install Claude Code and run it from a local clone:

```bash
git clone https://github.com/Shakeeb871/samsungservices-center.git
cd samsungservices-center
claude
```

Keep `CLAUDE.md` current — when the structure or deploy path changes, update it in
the same commit.

---

## 3. Search engine blocking (development phase)

The site is deliberately kept out of Google and other search engines while it is
being built. Two layers do this:

| Where | What |
| --- | --- |
| every `.html` `<head>` | `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">` |
| `.htaccess` | `Header set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet, noimageindex"` |

The header layer matters because it covers files a meta tag cannot reach — images,
PDFs, anything non-HTML.

**Why `robots.txt` still says `Allow: /`.** This looks backwards but is correct.
`Disallow: /` blocks crawling, and a crawler that cannot fetch the page never sees
the noindex — so any URL Google already knows about can sit in the index
indefinitely, sometimes shown as a bare title with no description. Allowing the
crawl lets Google read the noindex and drop the page properly.

**If you need a hard lock** (nothing public at all, not even to someone with the
URL), use cPanel → **Directory Privacy** on the document root and set a username
and password. That returns 401 to everyone, crawlers included.

**Verify it is working** — once deployed, run:

```bash
curl -I https://your-domain.com/
# look for: x-robots-tag: noindex, nofollow, ...
```

**At launch, remove all of it in one commit:**

1. delete the `<meta name="robots" ...>` line from `index.html`, `about.html`, `contact.html`
2. delete the `X-Robots-Tag` block from `.htaccess`
3. uncomment the `Sitemap:` line in `robots.txt` and set the real host
4. update the URLs in `sitemap.xml`
5. deploy, then submit the sitemap in Google Search Console

Missing step 1 or 2 is the usual reason a new site never ranks — check both.
