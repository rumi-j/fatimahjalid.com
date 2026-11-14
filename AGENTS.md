# AGENTS.md

This file is the single source of instructions for any coding agent working in this repository (Claude Code, Codex and others). `CLAUDE.md` contains only `@AGENTS.md`, which makes Claude Code load this file. Edit this file, never `CLAUDE.md`.

## What this is

Astro 6 static site for `fatimahjalid.com`, the academic and personal portfolio of Fatima Jalid (Chemical Engineering, NIT Srinagar). Live at https://fatimahjalid.com since 10 Oct 2026; Netlify auto-deploys every push to `main` via `netlify.toml`. No test suite beyond the browser check in `scripts/site-check.mjs`, no analytics, no server runtime.

## Commands

```bash
npm run dev      # dev server on http://localhost:4322 (launch.json name: astro-next)
npm run check    # astro check — TypeScript + template diagnostics; run before build
npm run build    # static output to dist/ (also generates sitemap-index.xml)
npm run preview  # serve dist/ on :4322
node scripts/site-check.mjs http://localhost:4322 <out-folder>  # browser checks against a running dev or preview server; writes site-check-report.txt, exits 1 on any failure
```

Pre-push verification is `npm run check && npm run build`, then confirm the seven routes render: `/`, `/about`, `/research`, `/publications`, `/teaching`, `/personal`, `/404`. With the dev server running, also run `scripts/site-check.mjs` and read the report. It drives the installed Google Chrome through `playwright-core` (a devDependency that downloads no browser), so Chrome must be installed; it has been run on the Mac mini only. Later work packages add their checks to this script rather than writing new ones.

## Privacy rule (hard)

`private/source-documents/` holds the CV and original source PDFs. It is gitignored and has never been committed. Never copy anything from it into `public/`, `src/`, or `dist/`, never link to it, and never quote CV contents into committed files beyond what is already in `src/data/`.

The repository is public (since 14 Nov 2026). Anyone can read every committed file and every commit message, and they stay in the history after deletion. So:

- Unpublished research data, draft specs and plans, and external reviews stay out of git. Keep them under `private/` (gitignored). A planning file that must sit elsewhere goes in this computer's `.git/info/exclude`; confirm with `git check-ignore -v <file>`.
- Never commit tokens, keys, passwords or `.env` files. `.env*` is gitignored.
- Before every commit, read `git status` and the staged diff, and keep personal details (phone numbers, private email addresses, home locations) out of files and commit messages.

## Architecture

**Content is data, not markup.** Every editable fact lives in `src/data/*.ts` (site identity and nav in `site.ts`; research, publications, professional, teaching, personal, about, group, news). Pages in `src/pages/` import these and render them. When asked to "update the site" with new content, edit the data file, not the page.

**One layout.** `src/layouts/BaseLayout.astro` owns `<head>` (canonical URL from `site.canonical`, OG tags, JSON-LD Person + BreadcrumbList), the header/footer shell, and the two inline scripts described below. Pages only supply `title`, `description`, and a body.

**Girih geometry engine.** `src/lib/girih.ts` is pure, deterministic, and runs in Astro frontmatter at build time, so all ornament ships as static SVG. It provides a seeded PRNG (mulberry32), 8-point star paths, and the octagon-square (4.8.8) lattice. `NetworkHero`, `MicroNetwork`, the `src/components/girih/*` kit, and the 404 page all consume it. Reuse it rather than hand-drawing SVG; keep seeds fixed so builds are stable.

**Design system: "Girih × Molecular".** Islamic strapwork meets catalytic reaction networks. Color roles in `src/styles/tokens.css` are disciplined and must not be mixed:
- `--gold*` = ornament (use `--gold-text` for small text; it is the AA-contrast variant)
- `--lapis*` = the science/network layer
- `--rust` = human emphasis
- `--ink*` / `--paper` = type and ground

Earlier Editorial, Mihrab, and Modern theme skins plus the Theme/Font switchers were deliberately removed. Do not reintroduce `[data-theme]` machinery.

**Fonts are self-hosted** via Fontsource in `src/styles/fonts.css` with metric-matched fallbacks. Never add Google Fonts or any CDN font link. Noto Nastaliq Urdu is scoped by unicode-range and only loads where Urdu renders.

**Motion is gated, not assumed.** An inline script in `BaseLayout` adds `.reveal-on` to `<html>` only when JS runs and `prefers-reduced-motion: no-preference` matches. `src/scripts/reveal.ts` (scroll reveal via IntersectionObserver, `[data-reveal]` and `[data-reveal-stagger]`) and `src/scripts/hero.ts` (pointer light, also requires `pointer: fine`) both check that class first. Without it, everything renders in its final visible state. Any new animation must follow this gate so the site is fully usable with JS off.

**Publications page has a frozen contract.** The inline script in `src/pages/publications.astro` depends on these selectors and data attributes: `.publication-section`, `.pub-search`, `.filter-row .filter[data-filter]`, `.topic-row .topic[data-topic]`, `.publication-item[data-type][data-tags][data-text]`, `.pub-year-group[data-year]`, `.result-count`, `[data-copy]`. Restyle freely; do not rename them.

## Deployment

The site is live. Netlify project `timely-phoenix-a25d4c` (free plan) builds `main` with `netlify.toml` (build `npm run build`, publish `dist/`, 301 from `www` to apex); a push to `main` is the deploy and takes about 25 s. The free plan is credit-based: 300 credits per billing cycle and 15 per production deploy, so about 20 deploys; when the credits run out, Netlify pauses the site until the next cycle. Batch commits into one push per piece of work. `fatimahjalid.com` was bought through Netlify (Netlify DNS, Let's Encrypt HTTPS, renews 10 Oct 2027). `astro.config.mjs` sets `site: "https://fatimahjalid.com"`, which drives canonical URLs and the sitemap. `docs/DEPLOYMENT_CHECKLIST.md` has the post-deploy checks and launch record; `docs/RESOURCE_MANIFEST.md` lists which public assets exist and which external links are intentionally not bundled.

When link-checking: RSC and Wiley DOI pages return 403 to non-browser clients and LinkedIn returns 429. These are bot blocks, not broken links.

## Git and GitHub

- Repository: https://github.com/rumi-j/fatimahjalid.com (public since 14 Nov 2026; owner account `rumi-j`; default branch `main`). GitHub account `Zulqar-sentinel` is a collaborator with write access (added 13 Nov 2026). It was made public because Netlify's free plan builds commits from only one contributor on a private repository. No licence is granted: all rights reserved.
- The site is worked on from two computers. Each keeps its own git identity in the repo's local config (`git config user.name` / `user.email`), so commit authorship shows who made each change. Do not change another computer's identity.

| Computer | Folder | Push access | Commit identity |
|---|---|---|---|
| Fatima's MacBook Air (user `fatimahjalid`) | `~/Documents/Projects/Personal Website` | account `rumi-j`, `gh` CLI over HTTPS | Fatima Jalid <fatima@nitsri.ac.in> |
| Mac mini (user `homelab`) | `~/Documents/Projects/fatimahjalid-website` | account `Zulqar-sentinel`, SSH remote `git@github.com:rumi-j/fatimahjalid.com.git` | Peerzada Zulqarnain <250874909+Zulqar-sentinel@users.noreply.github.com> |

- Run `git pull --ff-only` before starting work on either computer, and push when done, so the two copies do not diverge.
- Commit subjects for changes to the current design use a `[girih]` prefix; documentation-only commits use `Docs:`.
- Netlify deploys from this repo's `main` automatically (see Deployment). Pushing is publishing, so run check and build first.
- A partial, older copy of the source sits in Fatima's Research Repository (`00 Profile, CV & Website/Website fatimahjalid.com (Astro source)`). It is an archive snapshot with no git history; do not edit it or treat it as current.
