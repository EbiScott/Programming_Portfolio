"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   SectionHeading: section number + title that type themselves in once when
   they scroll into view. The full heading stays in the DOM for search and
   screen readers; the animated copy is aria-hidden. Reduced motion shows the
   whole heading immediately.
--------------------------------------------------------------------------- */

type Props = {
  eyebrow: string;
  title: string;
  titleId?: string;
  className?: string;
};

const EYE_MS = 24;
const TITLE_MS = 28;

export default function SectionHeading({
  eyebrow,
  title,
  titleId,
  className = "sec__title",
}: Props) {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const [eyeN, setEyeN] = useState(0);
  const [titleN, setTitleN] = useState(0);
  const [typing, setTyping] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => {
        setEyeN(eyebrow.length);
        setTitleN(title.length);
      }, 0);
      return () => clearTimeout(id);
    }

    const el = h2Ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;

    const run = () => {
      setTyping(true);
      let i = 0;
      const eye = () => {
        i += 1;
        setEyeN(i);
        if (i < eyebrow.length) {
          timer = setTimeout(eye, EYE_MS);
        } else {
          let j = 0;
          const ttl = () => {
            j += 1;
            setTitleN(j);
            if (j < title.length) timer = setTimeout(ttl, TITLE_MS);
            else setTyping(false);
          };
          timer = setTimeout(ttl, 120);
        }
      };
      timer = setTimeout(eye, 80);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          run();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [eyebrow, title]);

  const eyeDone = eyeN >= eyebrow.length;

  return (
    <div className="sec__head">
      <span className="sec__eyebrow" aria-hidden="true">
        {eyebrow.slice(0, eyeN)}
        {typing && !eyeDone && <span className="caret" />}
      </span>
      <h2 ref={h2Ref} id={titleId} className={`relative ${className}`}>
        <span className="invisible" aria-hidden="true">
          {title}
        </span>
        <span className="sec__typed" aria-hidden="true">
          {title.slice(0, titleN)}
          {typing && eyeDone && <span className="caret" />}
        </span>
        <span className="sr-only">{title}</span>
      </h2>
    </div>
  );
}
