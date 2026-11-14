#!/usr/bin/env node
// Site check (spec WP2, plan Q1). Drives the installed Google Chrome through
// playwright-core (no browser download) against a running copy of the site.
//
//   node scripts/site-check.mjs <base-url> <output-folder>
//   node scripts/site-check.mjs http://localhost:4322 /tmp/site-check
//
// Writes one text report, <output-folder>/site-check-report.txt, and exits 1
// if any check fails (2 on bad arguments or if Chrome cannot start).
// Later work packages add their checks here rather than writing new scripts.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const [baseArg, outArg] = process.argv.slice(2);
if (!baseArg || !outArg) {
  console.error("usage: node scripts/site-check.mjs <base-url> <output-folder>");
  process.exit(2);
}
const BASE = baseArg.replace(/\/+$/, "");
const ROUTES = ["/", "/about/", "/research/", "/publications/", "/teaching/", "/personal/", "/404"];
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };

const results = [];
const record = (name, failures, notes = []) => {
  results.push({ name, ok: failures.length === 0, failures, notes });
  console.log(`${failures.length === 0 ? "PASS" : "FAIL"}  ${name}`);
};

let browser;
try {
  browser = await chromium.launch({ channel: "chrome", headless: true });
} catch (error) {
  console.error(`Could not start Google Chrome through playwright-core: ${error.message}`);
  process.exit(2);
}

const open = async (route, viewport, { phone = false, motion = "reduce" } = {}) => {
  const context = await browser.newContext({
    viewport,
    reducedMotion: motion,
    isMobile: phone,
    hasTouch: phone,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    // The /404 route is served with status 404, which Chrome logs as a failed
    // load of the document itself. That one is expected; nothing else is.
    const own = m.location().url?.replace(/\/+$/, "") === BASE + route.replace(/\/+$/, "");
    if (route === "/404" && own && /status of 404/.test(m.text())) return;
    errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, errors };
};

const px = (n) => Math.round(n * 10) / 10;

// 1. Portraits (WP1, F1). The About portrait keeps its 2:3 shape; the hero
// portrait keeps the size it had before F1.
{
  const failures = [];
  const notes = [];
  const heroExpected = { 1440: [296, 580], 390: [317, 540] };
  for (const [width, height] of [[1440, 900], [1024, 768], [768, 1024], [390, 844]]) {
    for (const [route, selector] of [["/", ".hero-portrait img"], ["/about/", ".about-portrait img"]]) {
      const { context, page } = await open(route, { width, height }, { phone: width < 760 });
      const img = page.locator(selector).first();
      if ((await img.count()) === 0) {
        failures.push(`${width} ${route}: no element matches ${selector}`);
        await context.close();
        continue;
      }
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((el) => (el.complete ? null : new Promise((r) => el.addEventListener("load", r, { once: true }))));
      const box = await img.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height };
      });
      const size = `${px(box.w)}x${px(box.h)}`;
      if (route === "/about/") {
        const ratio = box.h / box.w;
        notes.push(`${width} About ${size}, height/width ${ratio.toFixed(3)}`);
        if (Math.abs(ratio / 1.5 - 1) > 0.02) failures.push(`${width} About portrait ${size}: height/width ${ratio.toFixed(3)} is not within 2 % of 1.5`);
      } else {
        notes.push(`${width} hero ${size}`);
        const want = heroExpected[width];
        if (want && (Math.abs(box.w - want[0]) > 1 || Math.abs(box.h - want[1]) > 1))
          failures.push(`${width} hero portrait ${size}, expected ${want[0]}x${want[1]}`);
        if (box.h > 581) failures.push(`${width} hero portrait ${size} is taller than its 580 px cap`);
      }
      await context.close();
    }
  }
  record("Portrait sizes (About 2:3 at 1440, 1024, 768, 390; hero unchanged)", failures, notes);
}

// 2. Hero labels (WP1, F2): shown, and no two overlap, at six desktop sizes.
{
  const failures = [];
  const notes = [];
  for (const [width, height] of [[1280, 800], [1366, 768], [1440, 900], [1536, 864], [1920, 1080], [2560, 1440]]) {
    const { context, page } = await open("/", { width, height });
    const r = await page.evaluate(() => {
      const group = document.querySelector(".net-annotations");
      const shown = !!group && getComputedStyle(group).display !== "none";
      const labels = [...document.querySelectorAll(".net-annotations text:not(.folio-caption)")].map((t) => ({
        text: t.textContent.trim(),
        b: t.getBoundingClientRect(),
      }));
      const hits = [];
      for (let i = 0; i < labels.length; i++)
        for (let j = i + 1; j < labels.length; j++) {
          const [a, b] = [labels[i].b, labels[j].b];
          if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
            hits.push(`${labels[i].text} × ${labels[j].text}`);
        }
      return { shown, names: labels.map((l) => l.text), hits };
    });
    notes.push(`${width}x${height}: ${r.shown ? r.names.join(", ") || "(none)" : "hidden"}${r.hits.length ? `; overlaps ${r.hits.join("; ")}` : ""}`);
    if (!r.shown || r.names.length === 0) failures.push(`${width}x${height}: no hero labels shown`);
    for (const h of r.hits) failures.push(`${width}x${height}: ${h} overlap`);
    await context.close();
  }
  record("Hero labels shown and not overlapping (6 desktop sizes)", failures, notes);
}

// 3. Targets (WCAG 2.2, 2.5.8). Every visible link and button under 24 CSS px
// in either dimension, with its spacing result: a 24 px circle centred on it
// must not touch another target or another undersized target's circle. A
// target inside a run of text passes under the criterion's inline exception.
{
  const failures = [];
  const notes = [];
  // scope: measure only targets inside this element (the open phone menu
  // covers the page, so targets behind it are not counted).
  const measure = (page, scope) =>
    page.evaluate((scope) => {
        const sel = "a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link]";
        const all = [...(scope ? document.querySelector(scope) : document).querySelectorAll(sel)]
          .filter((el) => el.checkVisibility({ visibilityProperty: true, opacityProperty: true }))
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          // Visually hidden until focused (skip link): 1 px, clipped.
          .filter(({ r }) => r.width > 1 && r.height > 1);
        const name = (el) =>
          `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`;
        const centre = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        const distToRect = (p, r) =>
          Math.hypot(Math.max(r.left - p.x, 0, p.x - r.right), Math.max(r.top - p.y, 0, p.y - r.bottom));
        // In a sentence: the target is laid out inline (flex and grid items are
        // not), and its block holds rendered text, in the same run of lines,
        // that is not itself a link or button.
        const isInline = (el) => getComputedStyle(el).display.startsWith("inline");
        const blockOf = (node) => {
          let el = node.parentElement;
          while (el && isInline(el)) el = el.parentElement;
          return el;
        };
        const inline = (el) => {
          if (!isInline(el)) return false;
          const block = blockOf(el);
          if (!block) return false;
          const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (!n.textContent.trim() || n.parentElement.closest("a, button") || blockOf(n) !== block) continue;
            const range = document.createRange();
            range.selectNodeContents(n);
            if (range.getClientRects().length > 0) return true;
          }
          return false;
        };
        const small = all.filter(({ r }) => r.width < 24 || r.height < 24);
        return small.map((s) => {
          const c = centre(s.r);
          const clash = all.find(
            (o) =>
              o !== s &&
              !o.el.contains(s.el) &&
              !s.el.contains(o.el) &&
              (distToRect(c, o.r) < 12 ||
                ((o.r.width < 24 || o.r.height < 24) && Math.hypot(centre(o.r).x - c.x, centre(o.r).y - c.y) < 24)),
          );
          const size = `${Math.round(s.r.width)}x${Math.round(s.r.height)}`;
          if (!clash) return { ok: true, text: `${name(s.el)} ${size}: passes on spacing` };
          if (inline(s.el)) return { ok: true, text: `${name(s.el)} ${size}: passes as inline text (spacing touches ${name(clash.el)})` };
          return { ok: false, text: `${name(s.el)} ${size}: fails, its 24 px circle touches ${name(clash.el)}` };
        });
      }, scope);
  const add = (where, list) => {
    for (const t of list) {
      const line = `${where} ${t.text}`;
      notes.push(line);
      if (!t.ok) failures.push(line);
    }
  };
  for (const [label, viewport, phone] of [["1440", DESKTOP, false], ["390", PHONE, true]]) {
    for (const route of ROUTES) {
      const { context, page } = await open(route, viewport, { phone });
      add(`${label} ${route}`, await measure(page, null));
      // The phone menu's links are hidden until it opens; measure them once.
      if (phone && route === "/") {
        const toggle = page.locator(".menu-toggle");
        if (await toggle.isVisible()) {
          await toggle.click();
          await page.waitForSelector(".primary-nav.open");
          await page.waitForTimeout(500);
          add(`${label} ${route} (menu open)`, await measure(page, "#primary-nav"));
        } else failures.push(`${label} ${route}: menu toggle not visible`);
      }
      await context.close();
    }
  }
  if (notes.length === 0) notes.push("no visible link or button is under 24 px");
  record("Targets under 24 px meet WCAG 2.2 criterion 2.5.8 (all routes, 1440 and 390)", failures, notes);
}

// 4. Publications page: record count, every type and topic filter, a search
// with no match, and citation and BibTeX copy on every button the page renders.
{
  const failures = [];
  const notes = [];
  const { context, page, errors } = await open("/publications/", DESKTOP);
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(BASE).origin });
  const state = () =>
    page.evaluate(() => {
      const items = [...document.querySelectorAll(".publication-item")];
      const visible = items.filter((i) => !i.hidden);
      return {
        total: items.length,
        visible: visible.length,
        types: visible.map((i) => i.dataset.type),
        tags: visible.map((i) => (i.dataset.tags ?? "").split(",").filter(Boolean)),
        count: document.querySelector(".result-count")?.textContent.trim() ?? "",
        openGroups: [...document.querySelectorAll(".pub-year-group")].filter((g) => !g.hidden).length,
      };
    });
  const countMatches = (s) => new RegExp(`^${s.visible} records?$`).test(s.count);

  const start = await state();
  notes.push(`${start.total} records rendered; count reads "${start.count}"`);
  if (start.total === 0) failures.push("no .publication-item on the page");
  if (start.visible !== start.total || !countMatches(start)) failures.push(`on load: ${start.visible} of ${start.total} shown, count reads "${start.count}"`);

  for (const filter of await page.$$eval(".filter-row .filter[data-filter]", (els) => els.map((e) => e.dataset.filter))) {
    await page.click(`.filter-row .filter[data-filter="${filter}"]`);
    const s = await state();
    notes.push(`type ${filter}: ${s.visible} shown, count "${s.count}"`);
    if (!countMatches(s)) failures.push(`type ${filter}: ${s.visible} shown but count reads "${s.count}"`);
    if (filter === "all" && s.visible !== start.total) failures.push(`type all: ${s.visible} shown, expected ${start.total}`);
    if (filter !== "all" && (s.visible === 0 || s.types.some((t) => t !== filter)))
      failures.push(`type ${filter}: ${s.visible} shown, types ${[...new Set(s.types)].join(",") || "none"}`);
  }
  await page.click('.filter-row .filter[data-filter="all"]');

  for (const topic of await page.$$eval(".topic-row .topic[data-topic]", (els) => els.map((e) => e.dataset.topic))) {
    const button = `.topic-row .topic[data-topic="${topic}"]`;
    await page.click(button);
    const s = await state();
    notes.push(`topic ${topic}: ${s.visible} shown, count "${s.count}"`);
    if (!countMatches(s)) failures.push(`topic ${topic}: ${s.visible} shown but count reads "${s.count}"`);
    if (s.visible === 0 || s.tags.some((t) => !t.includes(topic))) failures.push(`topic ${topic}: ${s.visible} shown, not all tagged ${topic}`);
    await page.click(button);
    const off = await state();
    if (off.visible !== start.total) failures.push(`topic ${topic} off again: ${off.visible} shown, expected ${start.total}`);
  }

  await page.fill(".pub-search", "zzqxzzqx");
  const none = await state();
  notes.push(`search "zzqxzzqx": ${none.visible} shown, count "${none.count}", ${none.openGroups} year groups open`);
  if (none.visible !== 0 || !countMatches(none) || none.openGroups !== 0)
    failures.push(`search with no match: ${none.visible} shown, count "${none.count}", ${none.openGroups} year groups open`);
  await page.fill(".pub-search", "");
  const cleared = await state();
  if (cleared.visible !== start.total) failures.push(`search cleared: ${cleared.visible} shown, expected ${start.total}`);

  for (const kind of ["citation", "bibtex"]) {
    const buttons = page.locator(`.publication-item [data-copy="${kind}"]`);
    const n = await buttons.count();
    let good = 0;
    for (let i = 0; i < n; i++) {
      const button = buttons.nth(i);
      const title = (await button.evaluate((b) => b.closest(".publication-item")?.querySelector("h3")?.textContent ?? "")).trim().slice(0, 50);
      const expected = await button.evaluate(
        (b, k) => b.closest(".publication-item")?.querySelector(k === "bibtex" ? ".cite-bibtex" : ".cite-citation")?.textContent ?? "",
        kind,
      );
      await page.evaluate(() => navigator.clipboard.writeText(""));
      await button.click();
      await page.waitForFunction((want) => navigator.clipboard.readText().then((t) => t === want), expected, { timeout: 2000 }).catch(() => {});
      const got = await page.evaluate(() => navigator.clipboard.readText());
      const problems = [];
      if (!expected.trim()) problems.push("nothing to copy");
      if (got !== expected) problems.push("clipboard differs from the record's text");
      if (kind === "bibtex") {
        if (!/^\s*@\w+\{/.test(got)) problems.push("does not start with @type{");
        let depth = 0;
        for (const ch of got) {
          depth += ch === "{" ? 1 : ch === "}" ? -1 : 0;
          if (depth < 0) break;
        }
        if (depth !== 0) problems.push("unbalanced braces");
      }
      if (problems.length) failures.push(`${kind} copy, "${title}": ${problems.join("; ")}`);
      else good += 1;
    }
    notes.push(`${kind} copy: ${good} of ${n} buttons copied the record's text`);
    if (n === 0) failures.push(`no ${kind} copy buttons rendered`);
  }

  // WP3 (F3): keys distinct, each keyed record's id is its key, no Unicode
  // subscript left in any BibTeX, and an entry with no key has no BibTeX.
  const bib = await page.evaluate(() =>
    [...document.querySelectorAll(".publication-item")].map((item) => ({
      id: item.id,
      title: item.querySelector("h3")?.textContent.trim().slice(0, 50),
      bibtex: item.querySelector(".cite-bibtex")?.textContent ?? null,
      button: !!item.querySelector('[data-copy="bibtex"]'),
    })),
  );
  const keys = bib.filter((b) => b.bibtex).map((b) => b.bibtex.match(/^\s*@\w+\{([^,\s]+),/)?.[1]);
  notes.push(`BibTeX: ${keys.length} entries, ${new Set(keys).size} distinct keys; ${bib.length - keys.length} records without BibTeX`);
  if (new Set(keys).size !== keys.length) failures.push(`duplicate BibTeX keys: ${keys.join(", ")}`);
  for (const b of bib) {
    const key = b.bibtex?.match(/^\s*@\w+\{([^,\s]+),/)?.[1];
    if (b.bibtex && b.id !== key) failures.push(`"${b.title}": id "${b.id}" is not its BibTeX key "${key}"`);
    if (b.bibtex && /[₀-₉]/.test(b.bibtex)) failures.push(`"${b.title}": Unicode subscript left in BibTeX`);
    if (!b.bibtex && (b.button || b.id)) failures.push(`"${b.title}": no BibTeX text but has a BibTeX button or an id`);
  }

  // WP3 (F6): subscripts fold in search, so "co2" and "CO₂" find the same records.
  const hits = {};
  for (const q of ["co2", "CO₂"]) {
    await page.fill(".pub-search", q);
    hits[q] = (await state()).visible;
  }
  await page.fill(".pub-search", "");
  notes.push(`search "co2": ${hits.co2} records; "CO₂": ${hits["CO₂"]} records`);
  if (hits.co2 === 0 || hits.co2 !== hits["CO₂"]) failures.push(`search "co2" found ${hits.co2}, "CO₂" found ${hits["CO₂"]}`);

  // WP3 (F4): with a type, a topic and a search that match nothing, the empty
  // line shows; "Clear filters" resets all three and restores every record.
  await page.click('.filter-row .filter[data-filter="journal"]');
  await page.click(".topic-row .topic[data-topic]");
  await page.fill(".pub-search", "zzz");
  const emptyLine = await page.evaluate(() => {
    const el = document.querySelector(".pub-empty");
    return el && !el.hidden && el.checkVisibility() ? el.innerText.trim() : null;
  });
  notes.push(`search "zzz": empty state ${emptyLine ? JSON.stringify(emptyLine.split("\n")[0]) : "not shown"}`);
  if (!emptyLine?.startsWith("No records match these filters.")) failures.push(`search "zzz": the line "No records match these filters." is not shown`);
  const clearButton = page.locator(".pub-clear");
  if (await clearButton.isVisible()) {
    await clearButton.click();
    const reset = await state();
    const controls = await page.evaluate(() => ({
      search: document.querySelector(".pub-search").value,
      type: document.querySelector(".filter-row .filter.active")?.dataset.filter,
      topics: document.querySelectorAll(".topic-row .topic.active").length,
      emptyShown: !document.querySelector(".pub-empty").hidden,
    }));
    notes.push(`"Clear filters": ${reset.visible} records, count "${reset.count}", type ${controls.type}, ${controls.topics} topics on`);
    if (reset.visible !== start.total || controls.search !== "" || controls.type !== "all" || controls.topics !== 0 || controls.emptyShown)
      failures.push(`"Clear filters" left ${reset.visible} of ${start.total} records, search "${controls.search}", type ${controls.type}, ${controls.topics} topics on`);
  } else failures.push('"Clear filters" button not shown with no matches');

  for (const e of errors) failures.push(`console: ${e}`);
  await context.close();

  // WP3 (F4): when the clipboard write is refused, the button says so and the
  // citation is shown and selected. The refusal is simulated by replacing
  // navigator.clipboard.writeText with one that rejects, as a denied
  // permission does; headless Chrome does not reliably refuse on its own.
  {
    const ctx = await browser.newContext({ viewport: DESKTOP, reducedMotion: "reduce" });
    await ctx.addInitScript(() => {
      Object.defineProperty(navigator.clipboard, "writeText", {
        value: () => Promise.reject(new DOMException("Write permission denied.", "NotAllowedError")),
      });
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "/publications/", { waitUntil: "networkidle" });
    const button = p.locator('.publication-item [data-copy="citation"]').first();
    await button.click();
    await p.waitForFunction(() => document.querySelector('.publication-item [data-copy="citation"]').textContent.trim() !== "Copy citation", null, { timeout: 2000 }).catch(() => {});
    const r = await p.evaluate(() => {
      const item = document.querySelector(".publication-item");
      const shown = item.querySelector(".cite-citation");
      return {
        label: item.querySelector('[data-copy="citation"]').textContent.trim(),
        shown: !!shown && !shown.hidden && shown.getBoundingClientRect().height > 0,
        selected: String(window.getSelection()) === shown?.textContent,
      };
    });
    notes.push(`copy refused: button reads "${r.label}", citation ${r.shown ? "shown" : "not shown"}, ${r.selected ? "selected" : "not selected"}`);
    if (r.label !== "Select and copy" || !r.shown || !r.selected)
      failures.push(`copy refused: button reads "${r.label}", citation shown ${r.shown}, selected ${r.selected}`);
    await ctx.close();
  }
  record("Publications: count, filters, searches, empty state, BibTeX keys, citation and BibTeX copy", failures, notes);
}

// 5. Every route at 1440 and 390: no console errors (with and without reduced
// motion, so the motion scripts run too), no horizontal overflow, no <img>
// without alt.
{
  const failures = [];
  const notes = [];
  for (const [label, viewport, phone] of [["1440", DESKTOP, false], ["390", PHONE, true]]) {
    for (const route of ROUTES) {
      for (const motion of ["reduce", "no-preference"]) {
        const { context, page, errors } = await open(route, viewport, { phone, motion });
        if (motion === "no-preference") {
          // Scroll through so reveal and hero scripts run, then return to the top.
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 500) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 40));
            }
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(300);
        } else {
          const r = await page.evaluate(() => ({
            docW: document.documentElement.scrollWidth,
            wide: [...document.querySelectorAll("body *")]
              .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(el).position !== "fixed")
              .slice(0, 5)
              .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`),
            noAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc || i.src),
            // WP3 (F6): CO₂ in visible text. CO2 may stay in attributes and keys.
            co2: (document.body.innerText.match(/.{0,30}CO2.{0,30}/g) ?? []).map((s) => s.trim()),
          }));
          if (r.docW > viewport.width) failures.push(`${label} ${route}: page is ${r.docW} px wide (overflow); widest: ${r.wide.join(", ")}`);
          for (const src of r.noAlt) failures.push(`${label} ${route}: <img> without alt: ${src}`);
          for (const s of r.co2) failures.push(`${label} ${route}: visible text shows "CO2": …${s}…`);
        }
        for (const e of errors) failures.push(`${label} ${route} (${motion}): console: ${e}`);
        await context.close();
      }
    }
  }
  notes.push(`${ROUTES.length} routes × 2 widths × 2 motion settings loaded`);
  record("Every route at 1440 and 390: no console errors, no horizontal overflow, every <img> has alt, no visible \"CO2\"", failures, notes);
}

await browser.close();

// Report.
let commit = "";
try {
  commit = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  if (execSync("git status --porcelain --untracked-files=no", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()) commit += " (with uncommitted changes)";
} catch {
  commit = "unknown";
}
const failed = results.filter((r) => !r.ok);
const lines = [
  "Site check report",
  `Base URL: ${BASE}`,
  `Run: ${new Date().toISOString()}`,
  `Working copy: ${commit}`,
  `Result: ${failed.length === 0 ? "PASS" : "FAIL"}, ${results.length - failed.length} of ${results.length} checks passed`,
  "",
];
for (const r of results) {
  lines.push(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  for (const f of r.failures) lines.push(`  ✗ ${f}`);
  for (const n of r.notes) lines.push(`    ${n}`);
  lines.push("");
}
fs.mkdirSync(outArg, { recursive: true });
const reportPath = path.join(outArg, "site-check-report.txt");
fs.writeFileSync(reportPath, lines.join("\n"));
console.log(`\n${failed.length === 0 ? "PASS" : "FAIL"}: ${results.length - failed.length} of ${results.length} checks passed. Report: ${reportPath}`);
process.exit(failed.length === 0 ? 0 : 1);
