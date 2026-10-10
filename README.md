# fatimahjalid.com

Deployment-ready academic and personal website for Dr. Fatima Jalid. The site is
an Astro static build designed for Netlify and a custom `fatimahjalid.com`
domain.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Astro, usually `http://localhost:4322`.

## Build for deployment

```bash
npm run check
npm run build
```

The deployable static output is generated in `dist/`.

## Update content

Content is intentionally separated from layouts:

- `src/data/site.ts`: identity, public email, and profile links
- `src/data/research.ts`: research themes and sponsored project
- `src/data/publications.ts`: papers, book chapters, and patent
- `src/data/professional.ts`: awards, education, talks, and memberships
- `src/data/teaching.ts`: course archive and course projects
- `src/data/personal.ts`: books, hobbies, and curated Blogger posts

The private CV source file is local context only. It is ignored by git, is not
deployed, and must not be copied into `public/`.

## Handoff and resources

- `docs/RESOURCE_MANIFEST.md`: inventory of public assets, private source
  context, and external links.
- `docs/CLAUDE_HANDOFF.md`: concise guide for Claude Code or another coding
  assistant.
- `docs/DEPLOYMENT_CHECKLIST.md`: launch checklist.
- `private/source-documents/`: local-only context files. This folder is ignored
  by git and is not deployed.

## Photography gallery

The first release intentionally shows a reserved gallery panel without empty
image placeholders. Add approved photography assets under `public/images/` and
create gallery entries when a set of images is ready.

## Repository

- GitHub: <https://github.com/rumi-j/fatimahjalid.com> (private, account `rumi-j`)
- Default branch: `main`
- Pushes go over HTTPS via the `gh` CLI.

## Netlify deployment

1. Repository is on GitHub (see above).
2. Import the repository in Netlify.
3. Netlify reads the included `netlify.toml`, runs `npm run build`, and serves
   `dist/`.
4. Check that `fatimahjalid.com` is available, register it, and add it as the
   Netlify custom domain.
5. Point DNS to Netlify and enable Netlify-managed HTTPS.
6. Verify the `www.fatimahjalid.com` redirect and production links.

The site intentionally launches without visitor analytics.
