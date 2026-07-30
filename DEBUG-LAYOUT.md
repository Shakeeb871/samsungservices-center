# If the live layout looks wrong

Work down this list in order. Each step tells you which layer is at fault, so you
stop guessing. Replace `your-domain.com` with the real domain.

## 0. What kind of "wrong" is it?

| What you see | Meaning | Go to |
| --- | --- | --- |
| Plain black text on white, everything stacked in one column, links underlined and blue | The stylesheet is **not being applied at all** | step 1 |
| Fonts and colours are right, but sections are misaligned, spaced oddly, or a grid is stacked | The stylesheet **is** applied but is an **old version** | step 3 |
| A page shows "Internal Server Error" | `.htaccess` was rejected by the server | step 5 |
| A page shows "Not Found" | The file was never deployed | step 4 |

## 1. Is the stylesheet reaching the browser?

```bash
curl -sI "https://your-domain.com/assets/css/style.css?v=2" | head -20
```

Look at three things:

- **Status** must be `200`. A `404` means the file is not on the server → step 4.
  A `403` means a permission or `.htaccess` deny rule → step 5.
- **`content-type`** must be `text/css`. If it says `text/plain` or
  `application/octet-stream`, the browser refuses the file because the site also
  sends `X-Content-Type-Options: nosniff`, and the page renders with no styling.
  `.htaccess` declares `AddType text/css .css` to prevent this; if it still comes
  back wrong, the host is stripping `.htaccess` → step 5.
- **`cache-control`** should read `public, max-age=300, must-revalidate`. If it
  still says `immutable`, the old `.htaccess` is live → the deploy did not run.

## 2. Is the browser refusing it?

Open the site, press **F12** → **Console**. Two messages matter:

- `Refused to apply inline style because it violates the following Content
  Security Policy directive: "style-src 'self'"` — an inline `style="…"` attribute
  crept back into the HTML. Move it into `assets/css/style.css`; the CSP blocks
  inline styles by design. See CLAUDE.md.
- `Refused to apply style from … because its MIME type ('text/plain') is not a
  supported stylesheet MIME type` — that is the MIME problem from step 1.

Then open the **Network** tab, reload, and click `style.css?v=2`. Confirm it is
`200`, `text/css`, and the **Response** tab shows real CSS and not an error page.

## 3. Are you looking at an old stylesheet?

This is the most common cause and it is invisible — the page is styled, just
wrongly, because the HTML is new and the CSS is not.

1. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac).
2. If that fixes it, the file on the server is correct and it was purely a cache.
   Anyone who visited before will keep seeing the broken version until their cache
   expires — that is exactly why the URL carries `?v=2`. **After every CSS or JS
   edit, bump that number in all seven pages.**
3. If you use Cloudflare, also purge there: *Caching → Configuration → Purge
   Everything*. cPanel's own cache lives under *Optimize Website* / LiteSpeed Cache.
4. Confirm the server really has the new file:

```bash
curl -s "https://your-domain.com/assets/css/style.css?v=2" | tail -5
```

The last lines should be the `@media print` block. If they are not, the deploy
did not copy the file → step 4.

## 4. Did the deploy actually run?

Pushing to GitHub does **not** publish. In cPanel:

**Git Version Control → the repo → Manage → Pull or Deploy →
Update from Remote**, then **Deploy HEAD Commit**.

Check the commit hash shown on that screen against the latest on GitHub. If they
differ, *Update from Remote* has not been run.

Then confirm what is actually on disk — cPanel → **File Manager** →
`public_html`. You should see all seven `.html` files, `assets/`, `.htaccess`
(enable *Show hidden files* in Settings), `favicon.ico`, `robots.txt`,
`sitemap.xml`, `site.webmanifest`.

A file missing from `public_html` but present in the repo means it has no `cp`
line in `.cpanel.yml`. Every new page needs one.

If `public_html` also contains files from a different site, the two are mixing —
in particular a second `.htaccess` will have been overwritten by this one. Put
this site on its own domain or subdomain and point `DEPLOYPATH` there.

## 5. Is `.htaccess` being rejected?

A `500` on every page usually means one directive is not permitted by the host's
`AllowOverride` setting. Find out which:

```bash
# cPanel → Metrics → Errors, or:
tail -30 ~/logs/your-domain.com.error.log
```

`Options not allowed here` or `.htaccess: Invalid command` names the line. Comment
out that one line and re-test — do **not** delete the whole file, or you lose the
error page, the security headers and the noindex block.

To bisect quickly, rename it and add sections back in order:

```bash
cd ~/public_html && mv .htaccess .htaccess.full && cp .htaccess.full .htaccess
# then comment out sections 1, 4, 6 in turn until the 500 clears
```

## 6. Still wrong?

Capture these three things and they will identify almost anything left:

```bash
curl -sI "https://your-domain.com/" | head -25
curl -sI "https://your-domain.com/assets/css/style.css?v=2" | head -15
curl -s  "https://your-domain.com/" | grep -o 'assets/css/[^"]*'
```

Plus a screenshot of the page and of the browser Console tab.
