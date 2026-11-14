#!/usr/bin/env node
// Offline comparison of src/data/publications.ts with Crossref (spec WP3, F3).
// Run by hand, once, when publication data is added or questioned; the build
// never calls Crossref. Sends DOIs only.
//
//   node scripts/crossref-compare.mjs <output-folder>
//
// Writes crossref-raw.json (the "message" of each Crossref record) and
// crossref-compare.txt (field by field, stored value against Crossref).

import fs from "node:fs";
import path from "node:path";
import { publications } from "../src/data/publications.ts";

const out = process.argv[2];
if (!out) {
  console.error("usage: node scripts/crossref-compare.mjs <output-folder>");
  process.exit(2);
}

const doiOf = (p) => p.doi ?? (p.url?.includes("doi.org/") ? p.url.split("doi.org/")[1] : undefined);
const norm = (s) =>
  String(s ?? "")
    .normalize("NFKC") // CO₂ -> CO2
    .replace(/\s*<su[bp]>\s*/g, "") // "CO <sub>2</sub> reduction" -> "CO2 reduction"
    .replace(/\s*<\/su[bp]>/g, "")
    .replace(/<[^>]+>/g, "") // other markup, such as <i>
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[‐-―−-]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const raw = {};
const lines = [`Crossref comparison, run ${new Date().toISOString()}`, ""];
let differences = 0;

for (const p of publications) {
  const doi = doiOf(p);
  const label = `${p.year} ${p.venue}: ${p.title.slice(0, 60)}`;
  if (!doi) {
    lines.push(`SKIP  ${label} (no DOI)`, "");
    continue;
  }
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { "User-Agent": "site-publication-check/1.0" },
  });
  if (!res.ok) {
    lines.push(`ERROR ${label}: HTTP ${res.status} for ${doi}`, "");
    differences += 1;
    continue;
  }
  const m = (await res.json()).message;
  // Keep only what is compared, so the saved file stays small and readable.
  raw[doi] = Object.fromEntries(
    ["DOI", "type", "title", "container-title", "volume", "issue", "page", "article-number", "issued", "published-print", "published-online", "author"]
      .filter((k) => m[k] !== undefined)
      .map((k) => [k, k === "author" ? m.author.map(({ given, family, sequence }) => ({ given, family, sequence })) : m[k]]),
  );
  const issued = m.issued?.["date-parts"]?.[0]?.[0];
  const printed = m["published-print"]?.["date-parts"]?.[0]?.[0];
  const online = m["published-online"]?.["date-parts"]?.[0]?.[0];
  const cr = {
    title: m.title?.[0],
    venue: m["container-title"]?.[0],
    volume: m.volume,
    issue: m.issue,
    pages: m.page,
    articleNumber: m["article-number"],
    year: printed ?? issued,
    authors: (m.author ?? []).map((a) => [a.given, a.family].filter(Boolean).join(" ")).join(", "),
  };
  const stored = {
    title: p.title,
    venue: p.venue,
    volume: p.volume,
    issue: p.issue,
    pages: p.pages,
    articleNumber: p.articleNumber,
    year: p.year,
    authors: p.authors,
    details: p.details,
  };
  lines.push(`DOI   ${doi}  (${label})`);
  lines.push(`      Crossref years: issued ${issued ?? "-"}, print ${printed ?? "-"}, online ${online ?? "-"}`);
  for (const field of ["title", "venue", "volume", "issue", "pages", "articleNumber", "year", "authors"]) {
    const a = stored[field];
    const b = cr[field];
    if (a === undefined && b === undefined) continue;
    // Before WP3, volume and pages live only in the details string: match whole tokens.
    const tokens = norm(stored.details).split(/[\s,()·]+/).filter(Boolean);
    const inDetails = a === undefined && b !== undefined && tokens.includes(norm(b));
    const same = norm(a) === norm(b) || inDetails;
    if (!same) differences += 1;
    lines.push(`      ${same ? "same" : "DIFF"}  ${field}: stored ${JSON.stringify(a ?? (inDetails ? `(in details: ${stored.details})` : null))} | Crossref ${JSON.stringify(b ?? null)}`);
  }
  lines.push("");
}

lines.splice(1, 0, `Records with a DOI: ${Object.keys(raw).length}; fields that differ: ${differences}`);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "crossref-raw.json"), JSON.stringify(raw, null, 2));
fs.writeFileSync(path.join(out, "crossref-compare.txt"), lines.join("\n"));
console.log(lines.join("\n"));
