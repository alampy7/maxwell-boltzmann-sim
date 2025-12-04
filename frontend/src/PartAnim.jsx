import { useEffect, useRef } from "react";

const WIDTH = 700;
const HEIGHT = 200;

export default function ParticleAnimation({ velocities }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !velocities || velocities.length === 0) return;

    const ctx = canvas.getContext("2d");

    const maxV = Math.max(...velocities);
    const maxPixelSpeed = 150; // px/seg máx aprox

    // Creamos partículas a partir de las velocidades
    particlesRef.current = velocities.map((v, i) => {
      const speedNorm = maxV > 0 ? v / maxV : 0;
      const vx = (0.2 + 0.8 * speedNorm) * maxPixelSpeed;
      // Se evita vx=0

      return {
        x: Math.random() * WIDTH,
        y: (i / velocities.length) * HEIGHT,
        vx: Math.random() < 0.5 ? vx : -vx, // derecha o izquierda
        radius: 3,
      };
    });

    let lastTime = performance.now();

    const loop = (time) => {
      const dt = (time - lastTime) / 1000; // en segundos
      lastTime = time;

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Se crea el fondo
      ctx.fillStyle = "rgba(10, 10, 10, 1)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Se delimitan las paredes
      ctx.strokeStyle = "rgba(80, 80, 80, 1)";
      ctx.strokeRect(1, 1, WIDTH - 2, HEIGHT - 2);

      // Se crean las partículas
      ctx.fillStyle = "rgba(0, 200, 255, 0.9)";
      particlesRef.current.forEach((p) => {
        p.x += p.vx * dt;

        // Rebotes en las paredes
        if (p.x < p.radius) {
          p.x = p.radius;
          p.vx *= -1;
        } else if (p.x > WIDTH - p.radius) {
          p.x = WIDTH - p.radius;
          p.vx *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    // Limpieza cuando cambian las velocidades
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [velocities]);

  if (!velocities || velocities.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Simulación cualitativa de partículas</h3>
      <p style={{ fontSize: "0.9rem", color: "#bbb" }}>
        Cada punto representa una partícula en 1D rebotando. La rapidez (de la
        distribución de Maxwell–Boltzmann) se traduce en qué tan rápido se mueve
        horizontalmente.
      </p>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          width: "100%",
          maxWidth: '${WIDTH}px',
          borderRadius: "8px",
          margin: "0 auto",
          display: "block",
        }}
      />
    </div>
  );
}