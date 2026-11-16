"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   Lightbox: one overlay for every proof image on the page.

   Opened by a `lightbox:open` window event carrying { src, caption }, so any
   tile can raise it without threading state or context through the tree. That
   keeps the tiles dumb and the overlay single: certificates and project shots
   open the same way, with the same focus handling and the same way out.

   Mirrors the easter egg: focus moves to the close control while it is up and
   is handed back to whatever opened it on the way out.
--------------------------------------------------------------------------- */

export type LightboxRequest = { src: string; caption?: string };

const OPEN_EVENT = "lightbox:open";

/* Small helper so callers do not repeat the event name. */
export function openLightbox(detail: LightboxRequest) {
  window.dispatchEvent(new CustomEvent<LightboxRequest>(OPEN_EVENT, { detail }));
}

export default function Lightbox() {
  const [item, setItem] = useState<LightboxRequest | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setItem(null);
    openerRef.current?.focus?.();
    openerRef.current = null;
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<LightboxRequest>).detail;
      if (!detail?.src) return;
      openerRef.current = document.activeElement as HTMLElement | null;
      setItem(detail);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  /* Move focus to the dismiss control while it is up, so a keyboard or
     screen-reader user is not left behind on the page underneath. */
  useEffect(() => {
    if (item) closeRef.current?.focus();
  }, [item]);

  /* Lock scroll while the overlay owns the screen. */
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ? `Image: ${item.caption}` : "Image"}
      onClick={close}
    >
      <figure
        className="lightbox__frame"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export,
            images are unoptimized by config, and these are arbitrary local
            files with unknown intrinsic size. */}
        <img className="lightbox__img" src={item.src} alt={item.caption ?? ""} />

        <figcaption className="lightbox__bar">
          <span className="lightbox__caption hud-label">
            {item.caption ?? ""}
          </span>
          <button
            ref={closeRef}
            type="button"
            className="lightbox__close hud-label"
            onClick={close}
          >
            Close · esc
          </button>
        </figcaption>
      </figure>
    </div>
  );
}
