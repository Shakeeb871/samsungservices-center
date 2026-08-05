<?xml version="1.0" encoding="UTF-8"?>
<!--
  A browser opening /sitemap.xml gets this stylesheet applied and sees a
  readable table. Without it Chrome falls back to its own built-in XML viewer,
  and that viewer styles itself with an INLINE stylesheet, which this site's
  CSP (style-src 'self') refuses. The result was an unstyled wall of blue text
  that looks broken to anyone who opens the URL.

  Crawlers ignore the xml-stylesheet instruction entirely and parse the XML
  underneath, so none of this affects what Google reads.

  The CSS lives in /assets/css/sitemap.css rather than in a <style> block here
  for exactly the same reason the rest of the site has no inline styles: the
  CSP would drop it and we would be back where we started.
-->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" encoding="UTF-8" indent="yes"
              doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Sitemap | Samsung Services Center</title>
        <meta name="robots" content="noindex, follow"/>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <link rel="stylesheet" href="/assets/css/sitemap.css"/>
      </head>
      <body>
        <div class="wrap">
          <p class="eyebrow">Samsung Services Center</p>
          <h1>XML Sitemap</h1>
          <p class="lead">
            <xsl:value-of select="count(s:urlset/s:url)"/> pages, with
            <xsl:value-of select="count(s:urlset/s:url/image:image)"/> images.
            This file is for search engines. It is generated from the pages
            themselves, so it cannot fall out of step with the site.
            <a href="/">Go to the home page</a>.
          </p>

          <table>
            <thead>
              <tr>
                <th class="c-num">#</th>
                <th>URL</th>
                <th class="c-date">Last modified</th>
                <th class="c-num">Images</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="c-num"><xsl:value-of select="position()"/></td>
                  <td>
                    <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                  </td>
                  <td class="c-date"><xsl:value-of select="s:lastmod"/></td>
                  <td class="c-num"><xsl:value-of select="count(image:image)"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
