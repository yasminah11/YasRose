import { useEffect } from "react";

/**
 * Attaches an IntersectionObserver to all `.reveal` elements inside `root`
 * (defaults to document). When they enter the viewport they get `.in-view`.
 */
export function useReveal(rootSelector?: string) {
  useEffect(() => {
    const root = rootSelector ? document.querySelector(rootSelector) : document;

    if (!root) return;

    const els = root.querySelectorAll<HTMLElement>(".reveal");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [rootSelector]);
}
