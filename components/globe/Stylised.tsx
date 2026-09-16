"use client";

/* The stylised earth: a three.js sphere repainted from the blue-marble photo,
   with the visitor's own dot, a pin for a picked point, and arrow-key
   traversal. This is the hero globe and the fallback whenever the 3D-maps key
   is missing or Google's globe fails to load. It names nothing itself: a pick
   is reported to the parent, which holds the read-out. */

import { useEffect, useRef } from "react";

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
const TEXTURE_URL = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";

/* Stylised "network globe" palette — flat blues, as in the reference artwork. */
const OCEAN = [8, 30, 62];
const LAND = [50, 156, 212];
const NET_COLOR = 0xbcd9ff;
const NET_NODES = 1800;
const NET_LINK_DIST = 0.2;
const NET_LINKS_PER_NODE = 3;

/* The pinned place is ice blue with a white pin, deliberately unlike the red
   dot that marks the visitor's own position. */
const YOU_COLOR = 0xff4d5e;
const YOU_GLOW = [255, 90, 90] as const;
const PIN_COLOR = 0xf4fbff;
const PIN_GLOW = [150, 232, 255] as const;

/* Repaint the blue-marble photo as two flat blues so the globe reads like the
   reference: light continents over a deep-navy ocean. Phones show the globe at
   ~300px, so they repaint at half resolution (see `compact` in start()). */
function flatEarthTexture(THREE: any, image: any, size = 2048) {
  const w = size;
  const h = size / 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    /* Land in the blue marble is warm (browns and greens) or bright snow and
       ice; the ocean — including the pale continental shelves — is blue.
       Classifying by hue keeps the continents flat instead of mottled. */
    const land = r > b + 6 || lum > 150 || (g > b + 8 && lum > 34);
    px[i] = land ? LAND[0] : OCEAN[0];
    px[i + 1] = land ? LAND[1] : OCEAN[1];
    px[i + 2] = land ? LAND[2] : OCEAN[2];
  }
  ctx.putImageData(data, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeNodeTexture(THREE: any) {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(190,235,255,0.85)");
  g.addColorStop(1, "rgba(120,200,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

/* Nodes joined by short links, wrapped around the sphere like the reference mesh. */
function addNetwork(THREE: any, globe: any) {
  const r = 1.018;
  const nodes: any[] = [];
  for (let i = 0; i < NET_NODES; i++) {
    const y = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - y * y);
    nodes.push(new THREE.Vector3(s * Math.cos(a) * r, y * r, s * Math.sin(a) * r));
  }

  const segments: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const near: { d: number; j: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const d = nodes[i].distanceTo(nodes[j]);
      if (d < NET_LINK_DIST) near.push({ d, j });
    }
    near.sort((p, q) => p.d - q.d);
    for (const n of near.slice(0, NET_LINKS_PER_NODE)) {
      segments.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[n.j].x, nodes[n.j].y, nodes[n.j].z);
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
  globe.add(
    new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: NET_COLOR,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      })
    )
  );

  const points: number[] = [];
  nodes.forEach((n) => points.push(n.x, n.y, n.z));
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  globe.add(
    new THREE.Points(
      dotGeo,
      new THREE.PointsMaterial({
        map: makeNodeTexture(THREE),
        color: 0xffffff,
        size: 0.018,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
      })
    )
  );
}

type StylisedGlobeProps = {
  /* A point the visitor picked; the parent looks its name up. */
  onPick: (lat: number, lng: number) => void;
  /* Where the browser says the visitor is, once it shares a position. */
  onVisitor: (lat: number, lng: number) => void;
  /* Escape asks the parent to drop the pinned place and its read-out. */
  onClear: () => void;
  /* Bumped by the parent's clear button, which also hides the 3D pin. */
  clearToken: number;
  /* Accessible name for the interactive globe. */
  label: string;
};

export default function StylisedGlobe({
  onPick,
  onVisitor,
  onClear,
  clearToken,
  label,
}: StylisedGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  /* The newest callbacks, so the one-time three.js setup never holds a stale
     one. */
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const visitorRef = useRef(onVisitor);
  visitorRef.current = onVisitor;
  const clearRef = useRef(onClear);
  clearRef.current = onClear;
  /* Lets the parent's clear button reach the 3D pin. */
  const clearPinRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (clearToken > 0) clearPinRef.current();
  }, [clearToken]);

  useEffect(() => {
    const container = containerRef.current!;
    if (container.clientWidth < 10) return;

    let raf = 0;
    let renderer: any = null;
    let sphereMesh: any = null;
    let paused = false;
    const cleanupListeners: Array<() => void> = [];
    /* Last coordinates the browser reported for the visitor: the red dot, and
       where a keyboard traversal starts from. */
    const self = { lat: 0, lng: 0 };

    function latLngToVector3(THREE: any, lat: number, lng: number, radius: number) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + 180) * Math.PI) / 180;
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    function vector3ToLatLng(v: any) {
      const r = v.length();
      const phi = Math.acos(Math.max(-1, Math.min(1, v.y / r)));
      const lat = 90 - (phi * 180) / Math.PI;
      const theta = (Math.atan2(v.z, -v.x) * 180) / Math.PI;
      /* atan2 spans -180..180, which maps to -360..0 here; folding it back keeps
         longitudes inside -180..180 so eastern places are named and plotted
         (and geocoded) with the longitude everyone else uses. */
      const lngDeg = theta - 180;
      const lng = lngDeg < -180 ? lngDeg + 360 : lngDeg;
      return { lat, lng };
    }

    function makeGlowTexture(THREE: any, rgb: readonly [number, number, number] = YOU_GLOW) {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      const [red, green, blue] = rgb;
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.3, `rgba(${red},${green},${blue},0.9)`);
      g.addColorStop(1, `rgba(${red},${green},${blue},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    function start(THREE: any) {
      /* Small screens render the globe at ~280–320px, so the texture repaint
         and the sphere tessellation are stepped down to keep the first frame
         cheap on phones; the mesh is identical everywhere. */
      const compact = window.matchMedia("(max-width: 1024px)").matches;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        /* No WebGL on this device — the CSS glow behind the map remains. */
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      /* A near-orthographic camera: the continents keep their true proportions. */
      const camera = new THREE.PerspectiveCamera(
        26,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 6);

      const globe = new THREE.Group();
      /* Start centred on the Atlantic at ~18°N, like the reference artwork.
         (A positive x tilt tips the north pole towards the camera.) */
      globe.rotation.y = -0.61;
      globe.rotation.x = 0.31;
      scene.add(globe);
      /* Lit from the upper left, like the reference; a high ambient term keeps
         the limb bright so the network mesh does not read as an outline.
         (Intensities are pre-multiplied by π: three r155+ treats light
         intensity as physical irradiance.) */
      scene.add(new THREE.AmbientLight(0xffffff, 3));
      const dir = new THREE.DirectionalLight(0xffffff, 1.1);
      dir.position.set(-2.4, 3.2, 6);
      scene.add(dir);

      const marker: { glow: any; dot: any; t: number } = { glow: null, dot: null, t: 0 };

      /* The pin for a picked point: a white stem standing off the surface with
         a small head and a halo, so it reads against land and ocean alike. It
         hangs off `globe`, so it turns with the earth. */
      const pin: {
        stem: any;
        head: any;
        halo: any;
        t: number;
        lat: number | null;
        lng: number;
      } = { stem: null, head: null, halo: null, t: 0, lat: null, lng: 0 };

      function setPin(lat: number, lng: number) {
        const up = latLngToVector3(THREE, lat, lng, 1).normalize();
        if (!pin.stem) {
          const material = new THREE.MeshBasicMaterial({ color: PIN_COLOR });
          pin.stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.15, 8), material);
          pin.head = new THREE.Mesh(new THREE.SphereGeometry(0.021, 16, 16), material);
          pin.halo = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: makeGlowTexture(THREE, PIN_GLOW),
              transparent: true,
              opacity: 0.9,
              depthWrite: false,
            })
          );
          pin.halo.scale.set(0.26, 0.26, 1);
          globe.add(pin.stem);
          globe.add(pin.head);
          globe.add(pin.halo);
        }
        pin.stem.position.copy(up.clone().multiplyScalar(1.075));
        pin.stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
        pin.head.position.copy(up.clone().multiplyScalar(1.15));
        pin.halo.position.copy(pin.head.position);
        pin.stem.visible = true;
        pin.head.visible = true;
        pin.halo.visible = true;
        pin.lat = lat;
        pin.lng = lng;
      }

      /* Drop the pin on a point and hand it to the parent to name — shared by
         clicks, taps and the arrow-key traversal below. */
      function pinPlace(lat: number, lng: number) {
        setPin(lat, lng);
        pickRef.current(lat, lng);
      }

      function clearPin() {
        if (pin.stem) {
          pin.stem.visible = false;
          pin.head.visible = false;
          pin.halo.visible = false;
        }
        pin.lat = null;
      }
      clearPinRef.current = clearPin;

      addNetwork(THREE, globe);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      /* The blue-marble photo is repainted as flat blues once it arrives; the
         network mesh alone still reads as the globe if it never arrives. */
      loader.load(
        TEXTURE_URL,
        (texture: any) => {
          let map: any = texture;
          try {
            map = flatEarthTexture(THREE, texture.image, compact ? 1024 : 2048);
            texture.dispose?.();
          } catch {
            /* Canvas is tainted (CORS) — fall back to the photo. */
            texture.colorSpace = THREE.SRGBColorSpace;
          }
          sphereMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, compact ? 64 : 96, compact ? 64 : 96),
            new THREE.MeshLambertMaterial({ map })
          );
          globe.add(sphereMesh);
          runLoop(THREE, renderer, scene, camera, globe, marker, pin);
        },
        undefined,
        () => {
          sphereMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64),
            new THREE.MeshLambertMaterial({ color: (OCEAN[0] << 16) | (OCEAN[1] << 8) | OCEAN[2] })
          );
          globe.add(sphereMesh);
          runLoop(THREE, renderer, scene, camera, globe, marker, pin);
        }
      );
      /* Click or tap anywhere on the earth: the ray that hits the sphere gives
         the coordinates, the pin marks them and the geocoder names them. */
      const onClick = (event: MouseEvent) => {
        if (!sphereMesh) return;
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const intersects = raycaster.intersectObject(sphereMesh);
        if (intersects.length > 0) {
          const local = globe.worldToLocal(intersects[0].point.clone());
          const { lat, lng } = vector3ToLatLng(local);
          pinPlace(lat, lng);
          /* Keep the focus the visitor just established, so the arrow keys
             carry on from the point they picked. */
          container.focus({ preventScroll: true });
        }
      };

      /* The globe is focusable, so the arrow keys walk the same pin over the
         surface (Shift for 15° steps) and Escape clears it. */
      const onKeyDown = (event: KeyboardEvent) => {
        if (pin.lat === null) {
          pin.lat = self.lat;
          pin.lng = self.lng;
        }
        const step = event.shiftKey ? 15 : 5;
        switch (event.key) {
          case "ArrowUp":
            pin.lat = Math.min(85, pin.lat + step);
            break;
          case "ArrowDown":
            pin.lat = Math.max(-85, pin.lat - step);
            break;
          case "ArrowLeft":
            pin.lng = pin.lng - step < -180 ? 180 : pin.lng - step;
            break;
          case "ArrowRight":
            pin.lng = pin.lng + step > 180 ? -180 : pin.lng + step;
            break;
          case "Escape":
            clearPin();
            clearRef.current();
            return;
          default:
            return;
        }
        event.preventDefault();
        pinPlace(pin.lat, pin.lng);
      };

      // Pause rotation while hovering.
      const onEnter = () => {
        paused = true;
      };
      const onLeave = () => {
        paused = false;
      };

      renderer.domElement.addEventListener("click", onClick);
      container.addEventListener("keydown", onKeyDown);
      /* Hovering pauses the earth, but only where hovering exists: on a touch
         screen the compatibility mouse event that follows a tap would otherwise
         leave the globe stopped for good. */
      if (window.matchMedia("(hover: hover)").matches) {
        container.addEventListener("mouseenter", onEnter);
        container.addEventListener("mouseleave", onLeave);
        cleanupListeners.push(() => {
          container.removeEventListener("mouseenter", onEnter);
          container.removeEventListener("mouseleave", onLeave);
        });
      }
      cleanupListeners.push(() => {
        renderer.domElement.removeEventListener("click", onClick);
        container.removeEventListener("keydown", onKeyDown);
      });

      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);
      cleanupListeners.push(() => window.removeEventListener("resize", onResize));
    }

    function runLoop(
      THREE: any,
      renderer: any,
      scene: any,
      camera: any,
      globe: any,
      marker: any,
      pin: any
    ) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const speed = reduced ? 0 : 0.0035;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const group = new THREE.Group();
            const dot = new THREE.Mesh(
              new THREE.SphereGeometry(0.035, 16, 16),
              new THREE.MeshBasicMaterial({ color: YOU_COLOR })
            );
            group.add(dot);
            const glow = new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: makeGlowTexture(THREE),
                transparent: true,
                opacity: 0.95,
                depthWrite: false,
              })
            );
            glow.scale.set(0.28, 0.28, 1);
            group.add(glow);
            group.position.copy(
              latLngToVector3(THREE, pos.coords.latitude, pos.coords.longitude, 1.05)
            );
            globe.add(group);
            marker.glow = glow;
            marker.dot = dot;
            self.lat = pos.coords.latitude;
            self.lng = pos.coords.longitude;
            visitorRef.current(self.lat, self.lng);
          },
          () => {},
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
      }

      const animate = () => {
        raf = requestAnimationFrame(animate);
        /* The earth holds still while a place is pinned: a touch screen has no
           hover to pause it, and a spinning globe would carry the visitor's pin
           out of sight. Hovering still pauses it too. */
        if (!paused && pin.lat === null) globe.rotation.y += speed;
        if (marker.glow) {
          marker.t += 0.05;
          const s = 1 + 0.35 * Math.sin(marker.t);
          marker.glow.scale.set(0.28 * s, 0.28 * s, 1);
          marker.dot.scale.setScalar(1 + 0.4 * Math.sin(marker.t));
        }
        if (pin.halo?.visible) {
          pin.t += 0.045;
          const s = 1 + 0.3 * Math.sin(pin.t);
          pin.halo.scale.set(0.26 * s, 0.26 * s, 1);
          pin.head.scale.setScalar(1 + 0.22 * Math.sin(pin.t));
        }
        renderer.render(scene, camera);
      };
      animate();
    }

    function loadThree(cb: () => void) {
      const w = window as any;
      if (w.THREE) {
        cb();
        return;
      }
      const s = document.createElement("script");
      s.src = THREE_URL;
      s.async = true;
      s.onload = () => {
        if (w.THREE) cb();
      };
      document.head.appendChild(s);
    }

    loadThree(() => start((window as any).THREE));

    return () => {
      cancelAnimationFrame(raf);
      cleanupListeners.forEach((fn) => fn());
      if (renderer) {
        renderer.domElement.remove();
        renderer.dispose?.();
      }
    };
  }, []);

  return (
    <div
      className="hero__globe"
      ref={containerRef}
      role="img"
      tabIndex={0}
      aria-label={label}
    />
  );
}
