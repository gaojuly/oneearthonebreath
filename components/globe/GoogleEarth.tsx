"use client";

/* The hero earth rendered by Google's 3D Maps (photorealistic 3D tiles): the
   real Google Earth view, loaded from the Maps JavaScript API with an API key.
   A tap on the globe flies the camera down to that point and hands it to the
   parent, which names it; the name is also drawn as the 3D marker's label, so
   it appears on the earth itself.

   The SDK is loaded from a CDN and kept deliberately untyped here, the same way
   the stylised globe treats three.js. */

import { useEffect, useRef, useState } from "react";

const BOOTSTRAP = "https://maps.googleapis.com/maps/api/js";

/* The whole earth, seen from far enough out to read as a globe. */
const WORLD_CAMERA = { center: { lat: 15, lng: 10, altitude: 0 }, range: 24000000, tilt: 0, heading: 0 };

/* How close the camera comes down on a picked point, and how long it takes. */
const PICK_RANGE = 1200;
const PICK_TILT = 55;
const FLY_MS = 3000;
const RETURN_MS = 2200;

type LatLng = { lat: number; lng: number };

type GoogleEarthProps = {
  apiKey: string;
  /* BCP-47-ish language for the map's own labels, e.g. "en" or "zh-TW". */
  language: string;
  /* A point the visitor picked; the parent names it. */
  onPick: (lat: number, lng: number) => void;
  /* Called once the globe has drawn a steady frame, so the stylised earth
     underneath can be retired. */
  onSteady: () => void;
  /* Called when the SDK or the map itself reports a problem, so the hero can
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

/* Google reports a key it will not serve (billing off, API not enabled, a
   referrer it does not allow) through one global hook, and no element event —
   without this the hero would keep a blank "Something went wrong" panel. */
let authFailure: (() => void) | null = null;

function installAuthFailureHook(onFailure: () => void) {
  authFailure = onFailure;
  const w = window as any;
  if (typeof w.gm_authFailure === "function" && w.gm_authFailure.__hero === true) return;
  const previous = typeof w.gm_authFailure === "function" ? w.gm_authFailure : null;
  const handler = () => {
    try {
      previous?.();
    } catch {
      /* an earlier handler must not stop ours */
    }
    authFailure?.();
  };
  handler.__hero = true;
  w.gm_authFailure = handler;
}

/* The `loading=async` loader is a bootstrap: it defines `google.maps` and then
   injects the library scripts, so `importLibrary` only appears a moment after
   the script's load event. Wait for it. */
function whenImportLibraryReady(timeoutMs = 12000): Promise<any> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const maps = (window as any).google?.maps;
      if (typeof maps?.importLibrary === "function") {
        resolve(maps.importLibrary("maps3d"));
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error("Google Maps SDK never exposed importLibrary"));
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

/* One SDK load per page, shared by every mount. */
function loadMaps(apiKey: string, language: string): Promise<any> {
  const w = window as any;
  if (typeof w.google?.maps?.importLibrary === "function") return w.google.maps.importLibrary("maps3d");
  if (w.__hero3dMaps) return w.__hero3dMaps;
  w.__hero3dMaps = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      libraries: "maps3d",
      loading: "async",
      language,
    });
    script.src = `${BOOTSTRAP}?${params}`;
    script.async = true;
    script.onerror = () => reject(new Error("Google Maps SDK failed to load"));
    script.onload = () => whenImportLibraryReady().then(resolve, reject);
    document.head.appendChild(script);
  });
  return w.__hero3dMaps;
}

export default function GoogleEarth({
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
}: GoogleEarthProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const libraryRef = useRef<any>(null);
  /* Bumped once the map element exists, which is what the marker effect waits
     for. */
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
    let steadyTimer = 0;
    /* An error before the first steady frame means the stand-in must stay. */
    let failed = false;

    const onSteadyChange = (event: any) => {
      if (event?.isSteady) {
        window.clearTimeout(steadyTimer);
        steadyRef.current();
      }
    };
    const onMapError = () => {
      failed = true;
      window.clearTimeout(steadyTimer);
      errorRef.current();
    };
    /* A tap anywhere on the earth: report the point under the cursor and fly
       down to it, which is the reveal. */
    const onClick = (event: any) => {
      const position = event?.position;
      if (!position || typeof position.lat !== "number") return;
      pickRef.current(position.lat, position.lng);
      mapRef.current?.flyCameraTo?.({
        endCamera: {
          center: { lat: position.lat, lng: position.lng, altitude: 0 },
          range: PICK_RANGE,
          tilt: PICK_TILT,
        },
        durationMillis: FLY_MS,
      });
    };

    loadMaps(apiKey, language)
      .then((library: any) => {
        if (cancelled) return;
        libraryRef.current = library;
        installAuthFailureHook(() => {
          failed = true;
          window.clearTimeout(steadyTimer);
          errorRef.current();
        });
        const Map3DElement = library.Map3DElement;
        const map = new Map3DElement({
          ...WORLD_CAMERA,
          mode: "HYBRID",
          /* Cooperative: one finger still scrolls the page, two fingers work the
             globe, and a single tap is a click. Note the enum values are upper
             case — "cooperative" makes the element constructor throw. */
          gestureHandling: "COOPERATIVE",
          description,
        });
        map.className = "hero__globe3d";
        map.addEventListener("gmp-click", onClick);
        map.addEventListener("gmp-steadychange", onSteadyChange);
        map.addEventListener("gmp-error", onMapError);
        map.addEventListener("gmp-map-id-error", onMapError);
        host.appendChild(map);
        mapRef.current = map;
        setReadyToken((n) => n + 1);
        /* No steady frame inside the budget: treat that as a failure rather than
           revealing a map that may never draw, so a working stylised earth is
           never replaced by an empty one. */
        steadyTimer = window.setTimeout(() => {
          failed = true;
          errorRef.current();
        }, 12000);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        /* A key that exists but cannot draw (not enabled, no billing, a
           restricted referrer, a bad option) is worth saying out loud: the hero
           falls back to the stylised earth either way. */
        console.warn("[hero] Google 3D globe unavailable, using the stylised earth:", reason);
        errorRef.current();
      });

    return () => {
      cancelled = true;
      window.clearTimeout(steadyTimer);
      const map = mapRef.current;
      if (map) {
        map.removeEventListener("gmp-click", onClick);
        map.removeEventListener("gmp-steadychange", onSteadyChange);
        map.removeEventListener("gmp-error", onMapError);
        map.removeEventListener("gmp-map-id-error", onMapError);
        map.remove();
      }
      mapRef.current = null;
    };
  }, [apiKey, language, description]);

  /* The visitor's own dot and the pinned point, each a 3D marker carrying its
     label — the pinned one shows the place name on the earth itself. */
  useEffect(() => {
    const map = mapRef.current;
    const Marker3DElement = libraryRef.current?.Marker3DElement;
    if (!map || !Marker3DElement) return;
    const placed: any[] = [];
    const place = (position: LatLng, label: string, className: string) => {
      const marker = new Marker3DElement({
        position: { lat: position.lat, lng: position.lng, altitude: 0 },
        altitudeMode: "CLAMP_TO_GROUND",
        /* The camera is flown by hand, so markers never move it. */
        autofitsCamera: false,
        sizePreserved: true,
        label,
      });
      marker.className = className;
      map.append(marker);
      placed.push(marker);
    };
    if (you) place(you, youLabel, "hero__pin3d");
    if (pin) place(pin, pin.name || "", "hero__pin3d hero__pin3d--place");
    return () => {
      placed.forEach((marker) => marker.remove());
    };
  }, [you, youLabel, pin, readyToken]);

  /* Clearing a place, or asking for the whole earth again, flies back out. */
  useEffect(() => {
    if (resetToken > 0) {
      mapRef.current?.flyCameraTo?.({ endCamera: WORLD_CAMERA, durationMillis: RETURN_MS });
    }
  }, [resetToken]);

  return (
    <>
      <div className="hero__globe hero__globe--3d" ref={hostRef} />
      {pin && (
        <button type="button" className="hero__globe-reset" onClick={onResetView}>
          {resetLabel}
        </button>
      )}
    </>
  );
}
