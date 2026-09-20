"use client";

/* The hero earth.
 *
 * Where a MapTiler API key is configured (served by /api/maps-key) the hero is
 * MapTiler's satellite tiles on a globe, and a tap flies the camera down to that
 * point and names it. Without a key, or if that globe fails to load or draw, the
 * stylised three.js earth takes over. Both report their picks here, so the
 * read-out, the geocoding and the clearing behave the same either way. */

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import MapTiler from "./globe/MapTiler";
import Readout, { type PinnedPlace } from "./globe/Readout";
import StylisedGlobe from "./globe/Stylised";
import { formatCoords, formatPlace, geocodeLanguage, lookupPlace } from "./globe/place";

type LatLng = { lat: number; lng: number };

export default function Globe() {
  const locale = useLocale();
  const t = useTranslations("Home");
  const language = geocodeLanguage(locale);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [tilesReady, setTilesReady] = useState(false);
  const [tilesFailed, setTilesFailed] = useState(false);
  const [you, setYou] = useState<string | null>(null);
  const [youAt, setYouAt] = useState<LatLng | null>(null);
  const [place, setPlace] = useState<PinnedPlace | null>(null);
  const [pinAt, setPinAt] = useState<LatLng | null>(null);
  const [explored, setExplored] = useState(false);
  const [clearToken, setClearToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);

  /* Newest lookup wins; an area already named is answered from memory. */
  const token = useRef(0);
  const cache = useRef(new Map<string, string>());

  /* Which earth the hero shows: MapTiler's tiles while a key is configured and
     they have not failed. */
  const tiles = !!apiKey && !tilesFailed;

  /* The key is fetched at runtime, so one build works with or without it. */
  useEffect(() => {
    let alive = true;
    fetch("/api/maps-key")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive) setApiKey(typeof data?.key === "string" && data.key ? data.key : null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /* Name a point: the coordinates appear at once, the place name follows. */
  const namePlace = useCallback(
    (lat: number, lng: number) => {
      const coords = formatCoords(lat, lng);
      const cacheKey = `${language}:${lat.toFixed(2)},${lng.toFixed(2)}`;
      const known = cache.current.get(cacheKey);
      const mine = ++token.current;
      setPlace({ name: known ?? null, coords, loading: !known });
      if (known) return;
      lookupPlace(lat, lng, language)
        .then((data: any) => {
          const name = formatPlace(data) || coords;
          cache.current.set(cacheKey, name);
          if (mine === token.current) setPlace({ name, coords, loading: false });
        })
        .catch(() => {
          if (mine === token.current) setPlace({ name: coords, coords, loading: false });
        });
    },
    [language]
  );

  /* A pick from either globe. */
  const onPick = useCallback(
    (lat: number, lng: number) => {
      setExplored(true);
      setPinAt({ lat, lng });
      namePlace(lat, lng);
    },
    [namePlace]
  );

  /* The visitor's own position, named once the browser shares it. */
  const onVisitor = useCallback(
    (lat: number, lng: number) => {
      setYouAt({ lat, lng });
      const coords = formatCoords(lat, lng);
      lookupPlace(lat, lng, language)
        .then((data: any) => setYou(formatPlace(data) || coords))
        .catch(() => setYou(coords));
    },
    [language]
  );

  /* Drop the pin: the stylised earth hides it by token, Google's because its
     marker is gone, and either camera comes back out. */
  const clear = useCallback(() => {
    setPlace(null);
    setPinAt(null);
    setClearToken((n) => n + 1);
    setResetToken((n) => n + 1);
  }, []);

  /* Back to the whole earth, keeping the name. */
  const resetView = useCallback(() => setResetToken((n) => n + 1), []);

  const onTilesError = useCallback(() => {
    setTilesFailed(true);
    setTilesReady(false);
  }, []);

  const stylised = (
    <StylisedGlobe
      onPick={onPick}
      onVisitor={onVisitor}
      onClear={clear}
      clearToken={clearToken}
      label={t("globeA11y")}
    />
  );

  return (
    <div className="hero__visual">
      <div className="hero__orbit">
        {tiles ? (
          <>
            {/* The tested stylised earth stands in until the tiles have drawn a
                frame, and returns if the key or the SDK fails. */}
            {!tilesReady && stylised}
            <MapTiler
              apiKey={apiKey}
              language={language}
              onPick={onPick}
              onSteady={() => setTilesReady(true)}
              onError={onTilesError}
              you={youAt}
              youLabel={t("globeYou")}
              pin={pinAt ? { ...pinAt, name: place?.name ?? null } : null}
              resetToken={resetToken}
              onResetView={resetView}
              description={t("globeA11y")}
              resetLabel={t("globeReset")}
            />
          </>
        ) : (
          stylised
        )}
      </div>
      <Readout you={you} place={place} showHint={!explored} onClear={clear} />
    </div>
  );
}
