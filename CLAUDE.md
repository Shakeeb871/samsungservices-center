# Samsung Services Center

Static marketing site for a Samsung appliance repair business. Currently a dummy
starter template — content is placeholder text and must be replaced before launch.

## Stack

Plain HTML, CSS and vanilla JS. No build step, no framework, no package manager.
Edit the files directly; what is in the repo is what gets served.

## Layout

```
index.html            Home (hero, services grid, steps, CTA)
about.html            About page
contact.html          Booking form (demo handler only — not wired to email)
assets/css/style.css  All styles. Design tokens live in :root at the top.
assets/js/main.js     Mobile nav, footer year, contact-form placeholder
.htaccess             Apache rules: pretty URLs, gzip, caching, headers
.cpanel.yml           cPanel Git Version Control deployment tasks
robots.txt            Update the Sitemap host before launch
```

## Conventions

- Every page repeats the same `<header>` and `<footer>` markup. When you change one,
  change all of them — there is no include system.
- Styling goes in `assets/css/style.css`, not in inline `style` attributes.
  Colours and spacing come from the CSS variables in `:root` — add a token rather
  than hard-coding a new hex value.
- Pages are linked without the `.html` extension only in copy, never in `href` —
  `.htaccess` handles the rewrite, but the raw links stay explicit so the site
  still works if mod_rewrite is off.
- Keep it dependency-free. Do not add a bundler, CDN script, or web font unless
  asked — the host is shared cPanel and the site should stay static.

## Deployment

Pushing to `main` does not publish. cPanel pulls and deploys:

1. cPanel → Files → **Git Version Control** → this repo → **Pull or Deploy**
2. **Update from Remote** pulls the new commits
3. **Deploy HEAD Commit** runs the tasks in `.cpanel.yml`

`.cpanel.yml` copies files into `$HOME/public_html/`. If this site lives on an
addon domain or subdomain, change `DEPLOYPATH` in that file to the document root
cPanel shows for the domain.

## Before going live

Replace: phone numbers (`000 000 0000`), `hello@example.com`, the `tel:` links,
the `Sitemap:` host in `robots.txt`, and all placeholder body copy. Uncomment the
HTTPS redirect in `.htaccess` once the SSL certificate is issued.
