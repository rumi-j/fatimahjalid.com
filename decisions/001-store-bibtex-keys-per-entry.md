# ADR-001: Store BibTeX keys per publication and change the live keys once

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decided by:** the user, by locking `docs/SITE_SPEC_2026-11.md` version 6 on 14 Nov 2026 (section 7.1 lists the keys; section 16 asks for this note). Drafted by the WP3 build session.
- **Door:** one-way. Once a key is on the live site, readers paste it into their `.bib` files and cite it, and a case-study page can link to `/publications/#<key>`. Changing a key after that breaks their citations and links without telling them.

## Context

Before WP3, `src/pages/publications.astro` computed each key from the first author's surname and the year. The live site therefore exported duplicate keys: `Jalid2021` four times and `Jalid2024` twice. The patent was exported as `collaborators2023`, from the author string "Fatima Jalid and collaborators". Measured in the build of commit `415219c`, these were 15 entries with 11 distinct keys. LaTeX users who copied two of those entries got a clash. The case-study pages planned for WP6 also need a stable anchor on each publication.

## Decision

Every journal article and chapter in `src/data/publications.ts` carries a stored `key`. The keys are exactly those in spec section 7.1:

`Farooqi2026Microkinetic`, `Kumar2022Machine`, `Iyer2022Tracing`, `Jalid2021Exploring`, `Jalid2021Mechanistic`, `Jalid2021Insights`, `Jalid2021CO2`, `Saxena2020InSilico`, `Jalid2019InSilico`, `Khan2018FirstPrinciple`, `Jalid2017Understanding`, `Jalid2024Aqueous`, `Jalid2024Biological`, `Muzaffar2024Mechanical`.

The patent has no key, and so no BibTeX, until Fatima confirms its inventors (F3b, WP5). Its key will then be the first inventor's surname followed by `2023Electrodialytic`. Each keyed `<article class="publication-item">` has `id` set to its key.

The live keys change once, when WP3 is pushed. After that, a key is never renamed or reused. A corrected title, author list or year leaves the key as it is. A new publication gets a new key in the same pattern: first author's surname, year, first significant title word.

## Alternatives rejected

- **Keep the computed `SurnameYear` keys.** Rejected because they are not unique. Four 2021 papers share `Jalid2021`, so a reader who cites two of them gets a clash.
- **Compute keys from surname, year and first significant title word (the plan's proposal).** Rejected because a key would change whenever a title is corrected. The Crossref comparison of 14 Nov 2026 shows titles that may yet be corrected: the biogas paper is missing "the" twice.
- **DOI-based keys.** Rejected because the chapters and the patent have no DOI, and DOI keys are unreadable in a `.bib` file.

## Consequences

Correcting publication metadata is now safe. Keys and anchors no longer move with titles. In exchange, the site is committed to every key above for as long as the entry exists. The point of no return is the WP3 push. After that, any key a reader has copied is in the wild. The one-time change also breaks any citation already made with an old key such as `Farooqi2026`. This is accepted on purpose, because the old keys were already ambiguous.

## Verification

- `checkPublications()` in `src/lib/citations.ts` runs in the Publications page frontmatter. It fails the build on a duplicate key or on a journal article or chapter with no key.
- `scripts/site-check.mjs` (Publications check) fails if two rendered BibTeX entries share a key, or if a keyed record's `id` differs from its key.
- Not enforced by any script: that an existing key is never renamed. A diff to `src/data/publications.ts` that changes a `key:` line contradicts this ADR and needs a superseding one. Revisit if the site ever imports publications from an external source.
