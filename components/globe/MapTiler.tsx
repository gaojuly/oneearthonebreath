"use client";

/* The hero earth rendered by MapTiler: its satellite-hybrid tiles on a sphere,
 * in MapTiler's globe projection (the SDK is MapLibre GL JS underneath). A tap
 * flies the camera down to that point, drops a labelled marker and hands the
 * point to the parent, which names it; the name is also drawn on the marker,
 * so it appears on the earth itself.
 *
 * The SDK is loaded from MapTiler's CDN and kept deliberately untyped here, the
 * same way the stylised globe treats three.js. */

import { useEffect, useRef, useState } from "react";
import {
  VISITOR_CITIES,
  linkCoordinates,
  networkLinks,
  pointAlong,
} from "./visitors";

const SDK_JS = "https://cdn.maptiler.com/maptiler-sdk-js/v4.1.0/maptiler-sdk.umd.min.js";
const SDK_CSS = "https://cdn.maptiler.com/maptiler-sdk-js/v4.1.0/maptiler-sdk.css";

/* The whole earth, seen from far enough out to read as a globe: at this zoom
   the sphere fills about five sixths of the square, the whole planet visible. */
const WORLD_CENTER: [number, number] = [10, 15];
const WORLD_ZOOM = 1;
const WORLD_PITCH = 0;
const WORLD_BEARING = 0;

/* How close the camera comes down on a picked point, and how long it takes. */
const PICK_ZOOM = 9;
const PICK_PITCH = 55;
const FLY_MS = 3000;
const RETURN_MS = 2200;

/* A key or a style that has not drawn inside this budget is treated as a
   failure rather than leaving an empty earth on screen. */
const STEADY_DEADLINE_MS = 12000;

/* Grace after the style loads: whatever tiles have arrived by then are what the
   visitor sees, rather than holding the stylised earth over a working globe. */
const SETTLE_GRACE_MS = 1200;

type LatLng = { lat: number; lng: number };

type MapTilerProps = {
  apiKey: string;
  /* The read-out language, as the shared geocoder spells it: "en" or "zh-TW". */
  language: string;
  /* A point the visitor picked; the parent names it. */
  onPick: (lat: number, lng: number) => void;
  /* Called once the earth has drawn, so the stylised earth underneath can be
     retired. */
  onSteady: () => void;
  /* Called when the key or the map itself reports a problem, so the hero can
     fall back to the stylised earth. */
  onError: () => void;
  /* The visitor's own position, if the browser shares one. */
  you: LatLng | null;
  /* Label drawn on the visitor's own marker. */
  youLabel: string;
  /* The pinned point and its name. */
  pin: (LatLng & { name: string | null }) | null;
  /* Bumped by the parent: returns the camera to the whole earth. */
  resetToken: number;
  /* Asks the parent to return the camera to the whole earth. */
  onResetView: () => void;
  /* Screen-reader description of the map. */
  description: string;
  /* Label for the "back to the whole earth" button. */
  resetLabel: string;
};

/* MapTiler's own label language codes — the map wants "zh-Hant" where the
   geocoder wants "zh-TW". */
function labelLanguage(language: string) {
  return language === "zh-TW" ? "zh-Hant" : "en";
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* One SDK load per page, shared by every mount. */
function loadSdk(): Promise<any> {
  const w = window as any;
  if (w.maptilersdk?.Map) return Promise.resolve(w.maptilersdk);
  if (w.__heroMaptiler) return w.__heroMaptiler;
  w.__heroMaptiler = new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = SDK_CSS;
    const script = document.createElement("script");
    script.src = SDK_JS;
    script.async = true;
    script.onerror = () => reject(new Error("MapTiler SDK failed to load"));
    script.onload = () => {
      const sdk = (window as any).maptilersdk;
      if (sdk?.Map) resolve(sdk);
      else reject(new Error("MapTiler SDK never exposed maptilersdk"));
    };
    /* The stylesheet first: the map's own controls and attribution are styled
       by it, and a late stylesheet would show them unstyled for a frame. */
    document.head.appendChild(link);
    document.head.appendChild(script);
  });
  /* A failed load must not poison the next mount: drop the promise so a retry
     reloads the SDK. */
  w.__heroMaptiler.catch(() => {
    w.__heroMaptiler = null;
  });
  return w.__heroMaptiler;
}

/* The visitor network, as layers over the globe: the same cities and links the
   stylised earth draws with three.js, so the hero tells one story whichever
   earth it is showing. The arcs are still; the pulses travelling them and the
   city dots are what move. Returns a tick for the render loop. */
const PULSE_TRAVEL_MS = 5200;

function addVisitorNetwork(map: any) {
  const links = networkLinks();

  map.addSource("visitor-arcs", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: links.map((link) => ({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: linkCoordinates(link, 64) },
      })),
    },
  });
  map.addLayer({
    id: "visitor-arcs",
    type: "line",
    source: "visitor-arcs",
    paint: { "line-color": "#bcd9ff", "line-width": 0.9, "line-opacity": 0.4 },
  });

  map.addSource("visitor-cities", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: VISITOR_CITIES.map((city) => ({
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [city.lng, city.lat] },
      })),
    },
  });
  map.addLayer({
    id: "visitor-cities",
    type: "circle",
    source: "visitor-cities",
    paint: {
      "circle-color": "#a9ddff",
      "circle-blur": 0.5,
      "circle-radius": 3.2,
      "circle-opacity": 0.9,
    },
  });

  map.addSource("visitor-pulses", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
  map.addLayer({
    id: "visitor-pulses",
    type: "circle",
    source: "visitor-pulses",
    paint: {
      "circle-color": "#ffffff",
      "circle-blur": 0.7,
      "circle-radius": 3,
      "circle-opacity": 0.95,
    },
  });

  return function tick(now: number) {
    const features = links.map((link, index) => {
      /* Each pulse has its own head start, so the network twinkles continuously
         instead of pulsing in unison. */
      const t = (now / PULSE_TRAVEL_MS + index / links.length) % 1;
      const [lng, lat] = pointAlong(link, t);
      return {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [lng, lat] },
      };
    });
    map.getSource("visitor-pulses")?.setData({ type: "FeatureCollection", features });
    /* The cities breathe in time with the traffic between them. */
    map.setPaintProperty(
      "visitor-cities",
      "circle-radius",
      3.2 * (1 + 0.3 * Math.sin(now / 900))
    );
  };
}

export default function MapTiler({
  apiKey,
  language,
  onPick,
  onSteady,
  onError,
  you,
  youLabel,
  pin,
  resetToken,
  onResetView,
  description,
  resetLabel,
}: MapTilerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  /* Bumped once the map exists, which is what the marker effect waits for. */
  const [readyToken, setReadyToken] = useState(0);
  /* Newest callbacks, so the one-time map setup never holds a stale one. */
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const steadyRef = useRef(onSteady);
  steadyRef.current = onSteady;
  const errorRef = useRef(onError);
  errorRef.current = onError;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !apiKey) return;
    let cancelled = false;
    /* Once a frame has been drawn, a late tile error is no longer a reason to
       take the earth away — unless it is the key being refused. */
    let steady = false;
    let steadyTimer = 0;
    let graceTimer = 0;
    /* The visitor network's render loop, started with the style. */
    let networkRaf = 0;
    let networkTick: ((now: number) => void) | null = null;

    const fail = (reason: unknown, always = false) => {
      if (cancelled || (steady && !always)) return;
      /* A key that exists but cannot serve (a referrer it does not allow, a
         service it is not enabled for, an exhausted key) is worth saying out
         loud: the hero falls back to the stylised earth either way. */
      console.warn("[hero] MapTiler globe unavailable, using the stylised earth:", reason);
      errorRef.current();
    };
    const settle = () => {
      if (cancelled || steady) return;
      steady = true;
      window.clearTimeout(steadyTimer);
      window.clearTimeout(graceTimer);
      steadyRef.current();
    };
    /* A drawn frame, so the stylised earth can retire: `idle` is the honest
       signal, but a long tail of tiles must not keep the stand-in over a
       working globe, so a short grace after the style loads counts too. */
    const onLoaded = () => {
      if (cancelled) return;
      graceTimer = window.setTimeout(settle, SETTLE_GRACE_MS);
    };
    const onMapError = (event: any) => {
      const status = event?.error?.status;
      /* A refused (or exhausted) key is fatal whenever it arrives: a globe that
         has lost its tiles must not stay on screen. Anything else only counts
         before the earth has drawn, where it means nothing ever will. */
      const refused = status === 401 || status === 403 || status === 429;
      if (refused) fail(`HTTP ${status}`, true);
      else if (!steady) fail(event?.error ?? event);
    };
    /* A tap anywhere on the earth: report the point under the cursor and fly
       down to it, which is the reveal. */
    const onClick = (event: any) => {
      const position = event?.lngLat;
      if (!position || typeof position.lat !== "number") return;
      pickRef.current(position.lat, position.lng);
      mapRef.current?.flyTo?.({
        center: [position.lng, position.lat],
        zoom: PICK_ZOOM,
        pitch: PICK_PITCH,
        duration: prefersReducedMotion() ? 0 : FLY_MS,
        essential: true,
      });
    };

    loadSdk()
      .then((sdk: any) => {
        if (cancelled) return;
        const map = new sdk.Map({
          container: host,
          apiKey,
          /* Satellite imagery with place labels, on MapTiler's newest hybrid
             style — the same reading as the photorealistic earth it replaced. */
          style: sdk.MapStyle.HYBRID,
          projection: "globe",
          language: labelLanguage(language),
          center: WORLD_CENTER,
          zoom: WORLD_ZOOM,
          pitch: WORLD_PITCH,
          bearing: WORLD_BEARING,
          /* The hero is a globe, not a control panel: no zoom buttons, no
             geolocation, no scale — only the attribution and the MapTiler logo
             their terms ask for, compact so the earth keeps the room. */
          navigationControl: false,
          geolocateControl: false,
          scaleControl: false,
          fullscreenControl: false,
          terrainControl: false,
          projectionControl: false,
          attributionControl: { compact: "auto" },
          /* One finger scrolls the page, two fingers work the globe, and a
             single tap is a click — the same deal as the stylised earth. */
          cooperativeGestures: true,
          /* No space box and no halo: the hero's own light shows around the
             earth, the way the stylised globe has it. */
          space: false,
          halo: false,
        });
        /* The style's background would paint a rectangle around the globe, and
           the hero already has a light behind it. */
        map.on("style.load", () => {
          try {
            for (const layer of map.getStyle()?.layers ?? []) {
              if (layer.type === "background") {
                map.setPaintProperty(layer.id, "background-color", "rgba(0, 0, 0, 0)");
              }
            }
          } catch {
            /* A style we cannot repaint is not worth failing the hero over. */
          }
          /* The visitor network goes on with the style: the cities, the links
             between them, and a pulse travelling each link. Pulse travel is
             motion, so with reduced motion the network goes on still. */
          try {
            networkTick = addVisitorNetwork(map);
            if (!prefersReducedMotion()) {
              const loop = (now: number) => {
                networkRaf = window.requestAnimationFrame(loop);
                networkTick?.(now);
              };
              networkRaf = window.requestAnimationFrame(loop);
            }
          } catch {
            /* A style that will not take the layers is not worth failing the
               hero over either. */
          }
        });
        map.on("idle", settle);
        map.once("load", onLoaded);
        map.on("error", onMapError);
        map.on("click", onClick);
        map.setPrefersReducedMotion?.(prefersReducedMotion());
        mapRef.current = map;
        setReadyToken((n) => n + 1);
        /* No drawn frame inside the budget: treat that as a failure rather than
           revealing a map that may never draw, so a working stylised earth is
           never replaced by an empty one. */
        steadyTimer = window.setTimeout(() => fail("no drawn frame"), STEADY_DEADLINE_MS);
      })
      .catch((reason: unknown) => {
        if (!cancelled) fail(reason);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(steadyTimer);
      window.clearTimeout(graceTimer);
      window.cancelAnimationFrame(networkRaf);
      const map = mapRef.current;
      if (map) {
        map.off("idle", settle);
        map.off("error", onMapError);
        map.off("click", onClick);
        map.remove();
      }
      mapRef.current = null;
    };
  }, [apiKey, language]);

  /* The visitor's own dot and the pinned point, each a marker carrying its
     label — the pinned one shows the place name on the earth itself. */
  useEffect(() => {
    const map = mapRef.current;
    const sdk = (window as any).maptilersdk;
    if (!map || !readyToken || typeof sdk?.Marker !== "function") return;
    const placed: any[] = [];
    const place = (position: LatLng, label: string, variant: string) => {
      const element = document.createElement("div");
      element.className = `hero__pin2d hero__pin2d--${variant}`;
      const text = document.createElement("span");
      text.className = "hero__pin2d-label";
      text.textContent = label;
      const dot = document.createElement("span");
      dot.className = "hero__pin2d-dot";
      /* Label over dot, anchored at the bottom: the dot marks the point, the
         name sits just above it. */
      element.append(text, dot);
      placed.push(
        new sdk.Marker({ element, anchor: "bottom" })
          .setLngLat([position.lng, position.lat])
          .addTo(map)
      );
    };
    if (you) place(you, youLabel, "you");
    if (pin) place(pin, pin.name ?? "", "place");
    return () => {
      placed.forEach((marker) => marker.remove());
    };
  }, [you, youLabel, pin, readyToken]);

  /* Clearing a place, or asking for the whole earth again, flies back out. */
  useEffect(() => {
    if (!resetToken) return;
    mapRef.current?.flyTo?.({
      center: WORLD_CENTER,
      zoom: WORLD_ZOOM,
      pitch: WORLD_PITCH,
      bearing: WORLD_BEARING,
      duration: prefersReducedMotion() ? 0 : RETURN_MS,
      essential: true,
    });
  }, [resetToken]);

  return (
    <>
      {/* The tiles replace the stylised earth only once they have drawn (see
          onSteady), so an empty box is never the visitor's first sight. */}
      <div
        className="hero__globe hero__globe--tiles"
        ref={hostRef}
        role="img"
        aria-label={description}
      />
      {pin && (
        <button type="button" className="hero__globe-reset" onClick={onResetView}>
          {resetLabel}
        </button>
      )}
    </>
  );
}

