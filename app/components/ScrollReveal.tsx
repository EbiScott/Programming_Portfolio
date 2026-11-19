"use client";

import { useEffect } from "react";

const HIDDEN = "will-reveal";
const SHOWN = "is-revealed";

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section")).filter(
      (section) => section.id !== "top",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add(SHOWN);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const section of sections) {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      section.classList.add(HIDDEN);
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
      for (const section of sections) section.classList.remove(HIDDEN, SHOWN);
    };
  }, []);

  return null;
}
