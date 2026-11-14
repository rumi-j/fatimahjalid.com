# Deployment Checklist

The site went live at <https://fatimahjalid.com> on 10 October 2026. This file
records how it is deployed and what to check after any change. The original
launch steps are kept at the end for reference.

## How deploys work now

- GitHub repository: <https://github.com/rumi-j/fatimahjalid.com> (public since
  14 November 2026).
- Netlify project `timely-phoenix-a25d4c` builds from `main` using
  `netlify.toml` (`npm run build`, publish `dist/`).
- Pushing to `main` is the deploy. A build takes roughly 25 seconds.
- Domain `fatimahjalid.com` and `www.fatimahjalid.com` are attached in Netlify
  Domain management; DNS is Netlify DNS; HTTPS is automatic.

## Before every push

```bash
npm run check
npm run build
```

Both must finish with zero errors. The build also regenerates the sitemap.

## After every deploy

Open the deploy in Netlify (Deploys tab) and confirm it says Published, then
spot-check on the live site:

- the page you changed, on desktop and on a phone;
- `https://fatimahjalid.com/sitemap-index.xml` still points at `sitemap-0.xml`,
  which lists the six indexable pages (the 404 page is deliberately absent);
- a made-up address such as `/nope` still shows the custom 404 page.

If the change added a page, renamed a URL, or rewrote a page's title or
description, also open Google Search Console, paste the page's full URL into
URL Inspection and click **Request indexing**. Routine content edits do not
need this; Google recrawls on its own.

## Google Search Console

Property: Domain property `fatimahjalid.com`, verified on 10 October 2026
through a `google-site-verification` TXT record on the root domain in Netlify
DNS. Signed in with the owner's Google account.

- **Do not delete the TXT record.** Google rechecks it and the property loses
  verification without it. It is harmless to the site.
- Submitted sitemap: `https://fatimahjalid.com/sitemap-index.xml` (Search
  Console needs the full URL, not a relative path).
- Indexing of the homepage was requested on launch day. Expect "Couldn't
  fetch" on the Sitemaps page and "URL is not on Google" in URL Inspection
  until the first crawl; both are placeholders on a new property.

What to look at, and how often:

- **First week after launch:** Indexing → Pages should list the six URLs as
  indexed, and Sitemaps should read Success with 6 discovered pages. If a page
  is listed under "Not indexed", open it and read the reason before changing
  anything.
- **After any URL change:** URL Inspection on the new URL, then Request
  indexing. Google's chosen canonical shown there should be the trailing-slash
  form, matching the site's canonical tags.
- **Monthly glance:** Performance for the queries bringing visitors, and
  Security & Manual Actions, which should always be empty.

### Indexing log

- **13 November 2026.** Indexing → Pages (last update 9 Nov 2026): 1 indexed,
  8 not indexed. 3 were "Page with redirect", which is expected: the `http://`,
  `www.` and no-trailing-slash variants, each confirmed to 301 to the canonical
  URL. 5 were "Discovered - currently not indexed", flat since mid-October.
  The live site was checked and does not block crawling: `robots.txt` allows
  everything and names the sitemap, all six pages return 200 with a
  self-referencing canonical and no `noindex`, and the homepage links to the
  other five. Indexing was requested through URL Inspection for `/about/`,
  `/research/`, `/publications/`, `/teaching/` and `/personal/`. Recheck around
  27 November 2026. If pages are still not indexed, add links to the site from
  the NIT Srinagar profile, Google Scholar, ORCID and LinkedIn rather than
  changing the site.

## Yearly

- Domain renewal: 10 October 2027 (auto-renew is on; confirm the card on the
  Netlify team is still valid a month before).
- The TLS certificate renews itself; nothing to do.

## Do not deploy

- `private/`
- `node_modules/`
- `.astro/`
- local screenshots or Downloads files

These are ignored by `.gitignore`.

## Launch record (completed 10 October 2026)

1. `npm run check` and `npm run build` passed with zero errors.
2. Repository pushed to GitHub under account `rumi-j`.
3. Netlify site imported from the repository; first deploy published.
4. Site visibility set to public; the injected "Powered by Netlify" badge was
   switched off in project settings.
5. `fatimahjalid.com` purchased through Netlify and attached as the primary
   domain with `www` as an alias.
6. Verified live: HTTPS on both hostnames, `www` and `http` redirects to
   `https://fatimahjalid.com`, all pages 200, custom 404, PDF and social
   image served, HSTS header present, mobile navigation and publication
   filters working.
7. Post-launch accessibility and SEO audit applied (contrast, pressed
   states, trailing-slash links, cache and security headers, 404 noindex).
8. Google Search Console: domain verified via Netlify DNS TXT record,
   sitemap submitted, homepage indexing requested.
