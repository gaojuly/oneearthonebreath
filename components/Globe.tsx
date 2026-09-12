"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
const TEXTURE_URL = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";

export default function Globe() {
  const locale = useLocale();
  const geocodeLang = locale === "zh-Hant" ? "zh-TW" : "en";
  const containerRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current!;
    if (container.clientWidth < 10) return;

    let raf = 0;
    let renderer: any = null;
    let sphereMesh: any = null;
    let paused = false;
    const cleanupListeners: Array<() => void> = [];

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
      const theta = Math.atan2(v.z, -v.x);
      const lng = (theta * 180) / Math.PI - 180;
      return { lat, lng };
    }

    function makeGlowTexture(THREE: any) {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.3, "rgba(255,90,90,0.9)");
      g.addColorStop(1, "rgba(255,90,90,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    function reverseGeocode(lat: number, lng: number) {
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${geocodeLang}`
      )
        .then((r) => r.json())
        .then((d: any) => {
          const city = d.city || d.locality || "";
          const country = d.countryName || "";
          const text = [city, country].filter(Boolean).join(", ");
          setLabel(text || `${lat.toFixed(1)}°, ${lng.toFixed(1)}°`);
        })
        .catch(() => setLabel(`${lat.toFixed(1)}°, ${lng.toFixed(1)}°`));
    }

    function start(THREE: any) {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 2.8);

      const globe = new THREE.Group();
      scene.add(globe);
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const dir = new THREE.DirectionalLight(0xffffff, 1.4);
      dir.position.set(4, 2, 6);
      scene.add(dir);

      const marker: { glow: any; dot: any; t: number } = { glow: null, dot: null, t: 0 };

      new THREE.TextureLoader().load(
        TEXTURE_URL,
        (texture: any) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          sphereMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64),
            new THREE.MeshPhongMaterial({ map: texture, shininess: 8 })
          );
          globe.add(sphereMesh);

          // Soft atmosphere glow — fades the globe edge into the background.
          const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(1.15, 64, 64),
            new THREE.ShaderMaterial({
              vertexShader: `
                varying vec3 vNormal;
                varying vec3 vView;
                void main() {
                  vec4 mv = modelViewMatrix * vec4(position, 1.0);
                  vNormal = normalize(normalMatrix * normal);
                  vView = normalize(-mv.xyz);
                  gl_Position = projectionMatrix * mv;
                }
              `,
              fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vView;
                void main() {
                  float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
                  float intensity = pow(rim, 3.0);
                  gl_FragColor = vec4(0.28, 0.62, 1.0, 1.0) * intensity;
                }
              `,
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthWrite: false,
            })
          );
          globe.add(atmosphere);

          runLoop(THREE, renderer, scene, camera, globe, marker);
        },
        undefined,
        () => renderer && renderer.domElement.remove()
      );
      // Click any point on the globe to reveal its country / exact location.
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
          reverseGeocode(lat, lng);
        }
      };

      // Pause rotation while hovering.
      const onEnter = () => {
        paused = true;
      };
      const onLeave = () => {
        paused = false;
      };

      renderer.domElement.addEventListener("click", onClick);
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
      cleanupListeners.push(() => {
        renderer.domElement.removeEventListener("click", onClick);
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
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

    function runLoop(THREE: any, renderer: any, scene: any, camera: any, globe: any, marker: any) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const speed = reduced ? 0 : 0.0035;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const group = new THREE.Group();
            const dot = new THREE.Mesh(
              new THREE.SphereGeometry(0.035, 16, 16),
              new THREE.MeshBasicMaterial({ color: 0xff4d5e })
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
              latLngToVector3(THREE, pos.coords.latitude, pos.coords.longitude, 1.02)
            );
            globe.add(group);
            marker.glow = glow;
            marker.dot = dot;
            reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          },
          () => {},
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
      }

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!paused) globe.rotation.y += speed;
        if (marker.glow) {
          marker.t += 0.05;
          const s = 1 + 0.35 * Math.sin(marker.t);
          marker.glow.scale.set(0.28 * s, 0.28 * s, 1);
          marker.dot.scale.setScalar(1 + 0.4 * Math.sin(marker.t));
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
    <div className="hero__visual">
      <div className="hero__orbit">
        <div className="hero__globe" ref={containerRef} aria-hidden="true" />
      </div>
      <p className="hero__loc" hidden={!label}>
        {label ? `📍 ${label}` : ""}
      </p>
    </div>
  );
}
