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

1. Push the project to a GitHub repository.
2. Import the repository in Netlify.
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
