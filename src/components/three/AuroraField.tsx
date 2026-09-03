"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AuroraField — decorative interactive particle cloud rendered on a
 * full-bleed WebGL canvas. Pointer-reactive drift, wrapped via torus
 * seeding, tone-mapped to a cinematic palette.
 */
export default function AuroraField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    // --- point cloud ---------------------------------------------------
    const COUNT = 2600;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const R = 9;

    for (let i = 0; i < COUNT; i++) {
      // uniform distribution in a soft sphere
      const r = Math.pow(Math.random(), 0.55) * R;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      speeds[i] = 0.02 + Math.random() * 0.05;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Circular soft particle sprite
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.3, "rgba(255,255,255,0.7)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    const spriteTex = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.07,
      map: spriteTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color("#c9f24a"),
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- orbiting accents ---------------------------------------------
    const accents: THREE.Mesh[] = [];
    const ringMats: THREE.MeshBasicMaterial[] = [];
    const ringGeo = new THREE.TorusGeometry(3.4, 0.006, 8, 160);
    for (let i = 0; i < 2; i++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? "#c9f24a" : "#ff6b4a",
        transparent: true,
        opacity: i === 0 ? 0.35 : 0.18,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.1 + i * 0.5;
      ring.rotation.z = i * 0.6;
      ring.position.z = -1.2;
      scene.add(ring);
      accents.push(ring);
      ringMats.push(ringMat);
    }

    // --- interaction ---------------------------------------------------
    const target = new THREE.Vector2(0, 0);
    const current = new THREE.Vector2(0, 0);

    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (isFine) window.addEventListener("pointermove", onPointerMove, { passive: true });

    // --- resize --------------------------------------------------------
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // --- animation loop ------------------------------------------------
    const clock = new THREE.Clock();
    let rafId = 0;
    let running = false;

    const tick = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05) + 0.0001;

      current.lerp(target, 0.05);

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        // slow vertical drift + horizontal sheared orbit around X-axis
        arr[i3 + 1] += speeds[i] * dt * (reduced ? 0 : 1);
        if (arr[i3 + 1] > R / 1.4) arr[i3 + 1] = -R / 1.4;
      }
      posAttr.needsUpdate = true;

      points.rotation.x += (reduced ? 0 : 0.00045) + current.y * 0.0004;
      points.rotation.y += (reduced ? 0 : 0.0003) - current.x * 0.0004;

      accents.forEach((ring, i) => {
        ring.rotation.z = t * (i === 0 ? 0.12 : -0.09);
        ring.rotation.x = Math.PI / 2.1 + i * 0.5 + Math.sin(t * 0.2 + i) * 0.12;
      });

      camera.position.x += (current.x * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (current.y * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      material.opacity = 0.7 + Math.sin(t * 0.6) * 0.15;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    // Pause the GPU/CPU render loop while the hero is out of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
      },
      { rootMargin: "120px 0px" }
    );
    observer.observe(container);
    start();

    return () => {
      observer.disconnect();
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      spriteTex.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" aria-hidden />;
}
