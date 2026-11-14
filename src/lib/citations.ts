// Citations, shared by the Publications page and the case-study pages (spec
// WP3, F3 and F4). The text builders are pure and run at build time; the copy
// handler runs in the browser. One module, so every page cites the same way.

import type { Publication } from "../data/publications";

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";

/** "CO₂" -> "CO2", for search: the typed query and the indexed text alike. */
export const foldSubscripts = (s: string) =>
  s.replace(/[₀-₉]/g, (c) => String(SUBSCRIPTS.indexOf(c)));

/** The bare-DOI link, or the stored URL where there is no DOI. */
export const referenceUrl = (p: Publication) => (p.doi ? `https://doi.org/${p.doi}` : p.url);

/** Display details: "104(3), 1403-1419", "299, 117284", "Patent no. 433616, granted 02 June 2023". */
export function formatDetails(p: Publication): string {
  if (p.type === "patent") {
    return [p.patentNumber && `Patent no. ${p.patentNumber}`, p.granted && `granted ${p.granted}`].filter(Boolean).join(", ");
  }
  if (p.type === "chapter") {
    return [p.editors && `ed. ${p.editors}`, p.publisher, p.pages && `pp. ${p.pages}`].filter(Boolean).join(", ");
  }
  const volume = p.volume ? `${p.volume}${p.issue ? `(${p.issue})` : ""}` : "";
  return [volume, p.pages ?? p.articleNumber].filter(Boolean).join(", ");
}

/** Plain citation. Ends with the DOI link, with no full stop after it. */
export function citation(p: Publication): string {
  const details = formatDetails(p);
  const text = `${p.authors} (${p.year}). ${p.title}. ${details ? `${p.venue}, ${details}` : p.venue}.`;
  return p.doi ? `${text} https://doi.org/${p.doi}` : text;
}

// BibTeX: escape LaTeX specials, and write each run of subscript digits as
// $_n$ inside braces, so CO₂ becomes {CO$_2$} and no Unicode subscript is left.
const latex = (s: string) => s.replace(/([&%#_])/g, "\\$1");
const protectSubscripts = (s: string) =>
  s.replace(/[A-Za-z0-9₀-₉]*[₀-₉][A-Za-z0-9₀-₉]*/g, (word) => {
    const math = word.replace(/[₀-₉]+/g, (run) => {
      const digits = foldSubscripts(run);
      return digits.length === 1 ? `$_${digits}$` : `$_{${digits}}$`;
    });
    return `{${math}}`;
  });

/** BibTeX entry, or undefined for an entry with no key (it is not exported). */
export function bibtex(p: Publication): string | undefined {
  if (!p.key) return undefined;
  const field = (name: string, value: string | number | undefined) =>
    value === undefined || value === "" ? [] : [`  ${name} = {${value}}`];
  const pages = p.pages ? p.pages.replace(/\s*[-–]\s*/, "--") : p.articleNumber;
  const lines = [
    ...field("author", latex(p.authors.split(/\s*,\s*/).join(" and "))),
    ...field("title", `{${protectSubscripts(latex(p.title))}}`),
  ];
  if (p.type === "journal") {
    lines.push(...field("journal", latex(p.venue)), ...field("volume", p.volume), ...field("number", p.issue), ...field("pages", pages));
  } else if (p.type === "chapter") {
    lines.push(
      ...field("booktitle", latex(p.venue)),
      ...field("editor", p.editors && latex(p.editors.split(/\s*,\s*/).join(" and "))),
      ...field("publisher", p.publisher && latex(p.publisher)),
      ...field("pages", pages),
    );
  } else {
    lines.push(...field("howpublished", latex(p.venue)), ...field("number", p.patentNumber), ...field("note", p.granted && `Granted ${p.granted}`));
  }
  lines.push(...field("year", p.year), ...field("doi", p.doi));
  const entryType = p.type === "journal" ? "article" : p.type === "chapter" ? "incollection" : "misc";
  return `@${entryType}{${p.key},\n${lines.join(",\n")}\n}`;
}

/** Lower-cased search text with subscripts folded, so "co2" finds CO₂. */
export const searchText = (p: Publication) =>
  foldSubscripts(`${p.title} ${p.authors} ${p.venue} ${formatDetails(p)}`).toLowerCase();

/**
 * Build-time data check, local data only. Throws (failing the build) on a
 * duplicate key, a journal article or chapter with no key, or a journal entry
 * with a DOI but neither volume with pages nor an article number.
 */
export function checkPublications(list: Publication[]): void {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const p of list) {
    const name = `"${p.title.slice(0, 60)}" (${p.year})`;
    if (p.key) {
      if (seen.has(p.key)) problems.push(`duplicate key ${p.key}: ${name}`);
      seen.add(p.key);
    } else if (p.type === "journal" || p.type === "chapter") {
      problems.push(`${p.type} with no key: ${name}`);
    }
    if (p.type === "journal" && p.doi && !((p.volume && p.pages) || p.articleNumber)) {
      problems.push(`journal entry with a DOI but neither volume with pages nor an article number: ${name}`);
    }
  }
  if (problems.length) throw new Error(`Publication data check failed:\n  ${problems.join("\n  ")}`);
}

/**
 * Browser: wire every [data-copy] button inside root. The button copies the
 * hidden .cite-citation or .cite-bibtex text of its .publication-item. If the
 * clipboard write fails, the button reads "Select and copy" and the text is
 * shown and selected, ready for the reader's own copy command.
 */
export function bindCopyButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
    const label = button.textContent ?? "";
    button.addEventListener("click", async () => {
      const kind = button.dataset.copy === "bibtex" ? ".cite-bibtex" : ".cite-citation";
      const source = button.closest(".publication-item")?.querySelector<HTMLElement>(kind);
      const text = source?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text);
        if (source) source.hidden = true;
        button.textContent = "Copied ✓";
        button.classList.add("copied");
        window.setTimeout(() => {
          button.textContent = label;
          button.classList.remove("copied");
        }, 1500);
      } catch {
        button.textContent = "Select and copy";
        if (!source) return;
        source.hidden = false;
        const range = document.createRange();
        range.selectNodeContents(source);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });
  });
}
