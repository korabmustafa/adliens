import { useEffect, useRef } from "react";

// Decorative particles stay outside React's render loop and sleep offscreen.
export function Starfield({ paused, pulse }) {
  const canvas = useRef(null);
  const burst = useRef(0);
  useEffect(() => {
    if (pulse) burst.current = performance.now();
  }, [pulse]);
  useEffect(() => {
    const element = canvas.current;
    const context = element.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1,
      height = 1,
      frame = 0,
      visible = true,
      last = 0,
      elapsed = 0;
    const particles = Array.from({ length: 135 }, (_, i) => ({
      x: ((i * 73.173) % 100) / 100,
      y: ((i * 37.713) % 100) / 100,
      z: 0.2 + (i % 8) / 10,
    }));
    function draw(time = 0) {
      const dt = last ? Math.min(time - last, 50) : 0;
      last = time;
      if (!paused && !reduced.matches) elapsed += dt;
      context.clearRect(0, 0, width, height);
      const energy =
        paused || reduced.matches || !burst.current
          ? 0
          : Math.max(0, 1 - (time - burst.current) / 1100);
      for (const star of particles) {
        const x = (star.x * width + elapsed * 0.002 * star.z) % width;
        const y =
          star.y * height + Math.sin(elapsed / 9000 + star.x * 8) * 5 * star.z;
        context.fillStyle = `rgba(210,240,180,${0.2 + star.z * 0.48})`;
        context.beginPath();
        context.arc(x, y, star.z * 1.25, 0, Math.PI * 2);
        context.fill();
        if (energy > 0) {
          context.strokeStyle = `rgba(197,255,56,${energy * star.z * 0.55})`;
          context.lineWidth = star.z;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(
            x + (x - width * 0.51) * energy * 0.12,
            y + (y - height * 0.53) * energy * 0.12,
          );
          context.stroke();
        }
      }
      // A single quiet meteor every 12 seconds, with no flashes.
      const meteor = (elapsed % 12000) / 1200;
      if (!paused && !reduced.matches && meteor < 1) {
        const x = width * (0.4 + meteor * 0.35),
          y = height * (0.08 + meteor * 0.23);
        const gradient = context.createLinearGradient(x - 80, y - 30, x, y);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, "#d9ffb5aa");
        context.strokeStyle = gradient;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x - 80, y - 30);
        context.lineTo(x, y);
        context.stroke();
      }
      frame = 0;
      if (!paused && !reduced.matches && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    }
    function restart() {
      cancelAnimationFrame(frame);
      last = 0;
      draw(performance.now());
    }
    function resize() {
      const rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.max(1, Math.round(width * ratio));
      element.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      restart();
    }
    const size = new ResizeObserver(resize);
    size.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", restart);
    reduced.addEventListener("change", restart);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      size.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", restart);
      reduced.removeEventListener("change", restart);
    };
  }, [paused]);
  return (
    <canvas ref={canvas} className="cosmic-particles" aria-hidden="true" />
  );
}
