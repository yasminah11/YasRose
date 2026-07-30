import type { ReactNode } from "react";
import { useEffect } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

function useReveal() {
  useEffect(() => {
    const run = () => {
      // .reveal elements — fade up
      const revealEls = document.querySelectorAll<HTMLElement>(".reveal");
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              revealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );
      revealEls.forEach((el) => revealObs.observe(el));

      // .stagger-children elements — staggered children
      const staggerEls = document.querySelectorAll<HTMLElement>(".stagger-children");
      const staggerObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              staggerObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
      );
      staggerEls.forEach((el) => staggerObs.observe(el));

      return () => {
        revealObs.disconnect();
        staggerObs.disconnect();
      };
    };

    // Small delay so route content is rendered
    const t = setTimeout(run, 60);
    return () => clearTimeout(t);
  });
}

export function Layout({
  children,
  transparentNav = false,
}: {
  children: ReactNode;
  transparentNav?: boolean;
}) {
  useReveal();

  return (
    <>
      <Nav transparent={transparentNav} />
      <main className={transparentNav ? "" : "pt-20"}>{children}</main>
      <Footer />
    </>
  );
}
