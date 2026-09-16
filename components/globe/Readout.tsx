"use client";

import { useTranslations } from "next-intl";

/* What a pinned point resolved to: the place name, the exact coordinates it
   landed on, and whether the lookup is still in flight. */
export type PinnedPlace = { name: string | null; coords: string; loading: boolean };

type ReadoutProps = {
  /* The visitor's own place, once the browser shares a position. */
  you: string | null;
  /* The place they pinned, or null when nothing is pinned. */
  place: PinnedPlace | null;
  /* The invitation, shown until the first pick. */
  showHint: boolean;
  onClear: () => void;
};

/* One reserved-height row under the earth: a hint, the visitor's own place and
   the place they pinned. Shared by both hero globes. */
export default function Readout({ you, place, showHint, onClear }: ReadoutProps) {
  const t = useTranslations("Home");
  return (
    <div className="hero__readout">
      {showHint && <p className="hero__hint">{t("globeHint")}</p>}
      <p className="hero__loc" hidden={!you} title={t("globeYou")}>
        {you ? `🧭 ${you}` : ""}
      </p>
      {place && (
        <div className="hero__place" role="status" aria-live="polite">
          <span className="hero__place-text">
            <span className="hero__place-name">
              {place.name ? `📍 ${place.name}` : t("globeLooking")}
            </span>
            {place.name !== place.coords && (
              <span className="hero__place-coords">{place.coords}</span>
            )}
          </span>
          <button
            type="button"
            className="hero__place-clear"
            onClick={onClear}
            aria-label={t("globeClear")}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
