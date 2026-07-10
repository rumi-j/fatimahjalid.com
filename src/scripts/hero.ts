// Pointer light for the network hero. Enhancement only: gated on .reveal-on
// (JS + motion welcome) and on a fine pointer being present.

const hero = document.querySelector<HTMLElement>(".network-hero");

if (
  hero &&
  document.documentElement.classList.contains("reveal-on") &&
  window.matchMedia("(pointer: fine)").matches
) {
  let raf = 0;

  hero.addEventListener("pointermove", (event) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--my", `${event.clientY - rect.top}px`);
      hero.classList.add("lit");
    });
  });

  hero.addEventListener("pointerleave", () => hero.classList.remove("lit"));
}
