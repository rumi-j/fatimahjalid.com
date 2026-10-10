# Deployment Checklist

The site went live at <https://fatimahjalid.com> on 10 October 2026. This file
records how it is deployed and what to check after any change. The original
launch steps are kept at the end for reference.

## How deploys work now

- GitHub repository: <https://github.com/rumi-j/fatimahjalid.com> (private).
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
- `https://fatimahjalid.com/sitemap-index.xml` still lists seven pages;
- a made-up address such as `/nope` still shows the custom 404 page.

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
