# Claude Code Handoff

Open this folder as the project root:

```text
/Users/fatimahjalid/Documents/Projects/Personal Website
```

## What this is

An Astro static website live at <https://fatimahjalid.com>, hosted on Netlify
and deployed automatically from `main` on GitHub
(<https://github.com/rumi-j/fatimahjalid.com>). The site is a multi-page
academic and personal portfolio for Dr. Fatima Jalid.

## Current architecture

- `src/pages/`: page routes
- `src/layouts/BaseLayout.astro`: shared metadata, header, footer shell
- `src/components/`: header, footer, page intro, the NetworkHero showpiece, and the girih ornament kit (`src/components/girih/`)
- `src/lib/girih.ts`: build-time geometry engine (star paths, octagon-square lattice, seeded pathways)
- `src/data/`: all editable content
- `src/styles/global.css`: full visual system
- `public/`: assets that deploy publicly
- `private/source-documents/`: local-only source context, ignored by git
- `dist/`: generated deployment output, ignored by git

## Commands

```bash
npm install
npm run check
npm run build
npm run dev
```

## Important privacy rule

The CV is present only under `private/source-documents/` for context. It must not
be copied into `public/`, linked from the website, or committed to a public
repository.

## Content editing map

- Identity, email, social links: `src/data/site.ts`
- Research themes: `src/data/research.ts`
- Publications and patent: `src/data/publications.ts`
- Awards, education, talks, memberships: `src/data/professional.ts`
- Courses and course projects: `src/data/teaching.ts`
- Books, Iqbal, writing, hobbies: `src/data/personal.ts`

## Repository

GitHub remote `origin`: `https://github.com/rumi-j/fatimahjalid.com` (private, default
branch `main`, GitHub account `rumi-j`, HTTPS auth through the `gh` CLI).

## Deployment notes

The site is live. Netlify builds `main` using `netlify.toml`, so pushing to
`main` is the deploy; nothing else is required. `docs/DEPLOYMENT_CHECKLIST.md`
has the post-deploy checks and the launch record.

Before pushing, verify:

- no private files in `public/` or `dist/`
- `npm run check` passes
- `npm run build` passes
- homepage, About, Research, Publications, Teaching, Personal, and 404 page render
- all external award, DOI, Blogger, Scholar, ORCID, LinkedIn, and NIT links open
