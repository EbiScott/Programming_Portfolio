"use client";

import { openLightbox } from "./Lightbox";

/* ---------------------------------------------------------------------------
   Tile: a proof image, or the reserved space for one.

   Two shapes:
     thumb: a small square beside a certificate row
     wide: a full-width frame above a project's copy

   With no `src` it renders an empty framed slot rather than a broken image, so
   entries can ship before their screenshot does. Clicking opens the shared
   lightbox; an empty tile is inert.
--------------------------------------------------------------------------- */

type TileProps = {
  src?: string;
  caption?: string;
  /** Accessible name for the thumbnail image. */
  alt?: string;
  variant?: "thumb" | "wide";
};

export default function Tile({
  src,
  caption,
  alt,
  variant = "thumb",
}: TileProps) {
  const shape = `tile tile--${variant}`;

  if (!src) {
    return (
      <span
        className={`${shape} tile--empty`}
        aria-hidden="true"
        title="Image coming soon"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-40" fill="none">
          <circle cx="12" cy="12" r="6" stroke="var(--fog)" strokeWidth="1.5" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="var(--fog)" strokeWidth="1.5" />
        </svg>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={shape}
      onClick={() => openLightbox({ src, caption })}
      aria-label={caption ? `Enlarge: ${caption}` : "Enlarge image"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export;
          see Lightbox for the rationale. */}
      <img className="tile__img" src={src} alt={alt ?? caption ?? ""} loading="lazy" />
    </button>
  );
}
