# Samsung Services Center

Starter website template for a Samsung appliance repair and service business.
Plain HTML/CSS/JS — no build step, works on any shared cPanel host.

**Status:** dummy template. All copy, phone numbers and email addresses are
placeholders.

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
