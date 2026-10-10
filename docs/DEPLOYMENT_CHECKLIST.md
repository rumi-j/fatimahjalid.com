# Deployment Checklist

## Local verification

```bash
npm run check
npm run build
```

Optional local preview:

```bash
python3 -m http.server 8001 --directory dist
```

Then open:

```text
http://127.0.0.1:8001/
```

## Netlify

1. Repository: `https://github.com/rumi-j/fatimahjalid.com` (private, `main`). Done 10 Oct 2026.
2. Import that repository in Netlify (sign in with the `rumi-j` GitHub account).
3. Use the included `netlify.toml`.
4. Build command: `npm run build`.
5. Publish directory: `dist`.
6. Connect `fatimahjalid.com`.
7. Enable HTTPS.
8. Confirm `www.fatimahjalid.com` redirects to `fatimahjalid.com`.

## Do not deploy

- `private/`
- `node_modules/`
- `.astro/`
- local screenshots or Downloads files

These are ignored by `.gitignore`.
