# Claude Code Handoff

Open this folder as the project root:

```text
/Users/fatimahjalid/Documents/Projects/Personal Website
```

## What this is

An Astro static website for `fatimahjalid.com`, designed for Netlify deployment.
The site is a multi-page academic and personal portfolio for Dr. Fatima Jalid.

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

## Deployment notes

The public output is created by `npm run build` in `dist/`. Netlify is configured
through `netlify.toml`.

Before launch, verify:

- no private files in `public/` or `dist/`
- `npm run check` passes
- `npm run build` passes
- homepage, About, Research, Publications, Teaching, Personal, and 404 page render
- all external award, DOI, Blogger, Scholar, ORCID, LinkedIn, and NIT links open
