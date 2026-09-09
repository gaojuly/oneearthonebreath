/* =========================================================
   ONE EARTH ONE BREATH — 3D Earth globe (home hero)
   Renders a rotating Earth map with a pulsing marker at the
   visitor's location (browser geolocation API). Falls back to
   the CSS planet if WebGL/Three.js or the texture can't load.
   ========================================================= */
(function () {
  "use strict";

  var container = document.getElementById("globe-container");
  if (!container || container.clientWidth < 10) return;

  var THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
  var TEXTURE_URL = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";

  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    var s = document.createElement("script");
    s.src = THREE_URL;
    s.async = true;
    s.onload = function () { if (window.THREE) cb(); };
    document.head.appendChild(s);
  }

  loadThree(init);

  function init() {
    var THREE = window.THREE;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 3);

    var globe = new THREE.Group();
    scene.add(globe);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    var dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(4, 2, 6);
    scene.add(dir);

    var marker = { glow: null, dot: null, t: 0 };

    new THREE.TextureLoader().load(
      TEXTURE_URL,
      function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        buildGlobe(THREE, globe, texture);
        start(THREE, renderer, scene, camera, globe, marker);
      },
      undefined,
      function () { renderer.domElement.remove(); } // keep CSS fallback
    );

    window.addEventListener("resize", function () {
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
  }

  function buildGlobe(THREE, globe, texture) {
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshPhongMaterial({ map: texture, shininess: 8 })
      )
    );

    // Soft atmosphere glow.
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1.08, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0x4cc9f0,
          transparent: true,
          opacity: 0.14,
          side: THREE.BackSide,
          depthWrite: false
        })
      )
    );
  }

  function latLngToVector3(THREE, lat, lng, radius) {
    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function makeGlowTexture(THREE) {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.3, "rgba(255,90,90,0.9)");
    g.addColorStop(1, "rgba(255,90,90,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  function addMarker(THREE, globe, marker, lat, lng) {
    var group = new THREE.Group();

    var dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4d5e })
    );
    group.add(dot);

    var glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeGlowTexture(THREE),
        transparent: true,
        opacity: 0.95,
        depthWrite: false
      })
    );
    glow.scale.set(0.28, 0.28, 1);
    group.add(glow);

    group.position.copy(latLngToVector3(THREE, lat, lng, 1.02));
    globe.add(group);

    marker.glow = glow;
    marker.dot = dot;
  }

  function showLocationLabel(label) {
    var el = document.getElementById("hero-location");
    if (!el) return;
    el.textContent = "📍 " + label;
    el.hidden = false;
  }

  function reverseGeocode(lat, lng) {
    var url =
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
      lat + "&longitude=" + lng + "&localityLanguage=en";
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var city = d.city || d.locality || "";
        var country = d.countryName || "";
        var label = [city, country].filter(Boolean).join(", ");
        showLocationLabel(label || lat.toFixed(1) + "°, " + lng.toFixed(1) + "°");
      })
      .catch(function () {
        showLocationLabel(lat.toFixed(1) + "°, " + lng.toFixed(1) + "°");
      });
  }

  function start(THREE, renderer, scene, camera, globe, marker) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var speed = reduced ? 0 : 0.0035;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          addMarker(THREE, globe, marker, pos.coords.latitude, pos.coords.longitude);
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        },
        function () { /* permission denied or unavailable — globe still shows */ },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    }

    (function animate() {
      requestAnimationFrame(animate);
      globe.rotation.y += speed;

      if (marker.glow) {
        marker.t += 0.05;
        var s = 1 + 0.35 * Math.sin(marker.t);
        marker.glow.scale.set(0.28 * s, 0.28 * s, 1);
        marker.dot.scale.setScalar(1 + 0.4 * Math.sin(marker.t));
      }

      renderer.render(scene, camera);
    })();
  }
})();
