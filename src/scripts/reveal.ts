// Scroll choreography. Only runs when <html> carries .reveal-on
// (JS available + prefers-reduced-motion: no-preference — set inline in BaseLayout).
// Without it, every element renders in its final, fully-visible state.

const root = document.documentElement;

if (root.classList.contains("reveal-on")) {
  const targets = new Set<Element>([
    ...document.querySelectorAll("main > section"),
    ...document.querySelectorAll("[data-reveal]"),
  ]);

  // Stagger groups: index children so CSS can delay each via --i.
  document.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty("--i", String(i));
    });
  });

  const show = (el: Element) => el.classList.add("is-visible");

  if (!("IntersectionObserver" in window)) {
    targets.forEach(show);
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));
  }
}
