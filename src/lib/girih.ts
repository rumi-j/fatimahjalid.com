// Girih geometry engine. Pure and deterministic — runs in Astro frontmatter
// at build time, so all geometry ships as static SVG markup.

export interface Pt {
  x: number;
  y: number;
}

export interface Edge {
  a: Pt;
  b: Pt;
}

export interface Lattice {
  nodes: Pt[];
  edges: Edge[];
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Seeded PRNG (mulberry32) so "activated" nodes are stable across builds. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** SVG path data for an 8-point khatam star (two squares rotated 45°). */
export function starPath(cx: number, cy: number, r: number, innerRatio = 0.42): string {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * innerRatio;
    pts.push(`${round(cx + radius * Math.cos(angle))} ${round(cy + radius * Math.sin(angle))}`);
  }
  return `M${pts.join("L")}Z`;
}

/**
 * Octagon-and-square girih lattice (the 4.8.8 truncated-square tiling).
 * Each cell holds an octagon; the corner cuts between four neighbouring
 * octagons form the small squares. Edges are deduplicated across cells.
 */
export function octagonSquareLattice(cols: number, rows: number, cell: number): Lattice {
  const cut = cell * 0.29;
  const edgeKeys = new Set<string>();
  const nodeKeys = new Set<string>();
  const edges: Edge[] = [];
  const nodes: Pt[] = [];

  const key = (p: Pt) => `${round(p.x)},${round(p.y)}`;

  const addNode = (p: Pt) => {
    const k = key(p);
    if (!nodeKeys.has(k)) {
      nodeKeys.add(k);
      nodes.push({ x: round(p.x), y: round(p.y) });
    }
  };

  const addEdge = (a: Pt, b: Pt) => {
    const [ka, kb] = [key(a), key(b)].sort();
    const k = `${ka}|${kb}`;
    if (edgeKeys.has(k)) return;
    edgeKeys.add(k);
    edges.push({ a: { x: round(a.x), y: round(a.y) }, b: { x: round(b.x), y: round(b.y) } });
    addNode(a);
    addNode(b);
  };

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const x = col * cell;
      const y = row * cell;
      // Octagon vertices, clockwise from top-left cut.
      const v: Pt[] = [
        { x: x + cut, y },
        { x: x + cell - cut, y },
        { x: x + cell, y: y + cut },
        { x: x + cell, y: y + cell - cut },
        { x: x + cell - cut, y: y + cell },
        { x: x + cut, y: y + cell },
        { x, y: y + cell - cut },
        { x, y: y + cut },
      ];
      for (let i = 0; i < 8; i++) addEdge(v[i], v[(i + 1) % 8]);
    }
  }

  return { nodes, edges };
}

/** SVG path data for a single strap (edge) of the lattice. */
export function strapPath(edge: Edge): string {
  return `M${edge.a.x} ${edge.a.y}L${edge.b.x} ${edge.b.y}`;
}

/**
 * A reaction pathway threaded along lattice straps: a seeded walk of
 * `steps` connected edges, never immediately backtracking. Returns the
 * ordered node sequence and a single SVG path through it.
 */
export function pathway(lattice: Lattice, seed: number, steps: number): { points: Pt[]; d: string } {
  const rand = seededRandom(seed);
  const key = (p: Pt) => `${p.x},${p.y}`;
  const adjacency = new Map<string, Pt[]>();
  for (const e of lattice.edges) {
    for (const [from, to] of [
      [e.a, e.b],
      [e.b, e.a],
    ] as const) {
      const k = key(from);
      if (!adjacency.has(k)) adjacency.set(k, []);
      adjacency.get(k)!.push(to);
    }
  }

  const startIndex = Math.floor(rand() * lattice.nodes.length);
  let current = lattice.nodes[startIndex];
  let previous: Pt | null = null;
  const points: Pt[] = [current];

  for (let i = 0; i < steps; i++) {
    const options = (adjacency.get(key(current)) ?? []).filter((p) => !previous || key(p) !== key(previous));
    if (options.length === 0) break;
    const next = options[Math.floor(rand() * options.length)];
    points.push(next);
    previous = current;
    current = next;
  }

  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join("");
  return { points, d };
}
