import React, { useEffect, useRef, useState } from 'react';

export const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouseOffset({
        x: ((clientX - cx) / cx) * 12,
        y: ((clientY - cy) / cy) * 8
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animId;

    const resize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    if (reduceMotion) return;

    // Glowing Toxic Emerald Embers / Sparks
    const numParticles = 50;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.7 - 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.4 ? 'rgba(0, 255, 102, ' : (Math.random() > 0.3 ? 'rgba(0, 229, 255, ' : 'rgba(168, 85, 247, ')
    }));

    let scanLineY = 0;

    function frame() {
      ctx.clearRect(0, 0, w, h);

      // Sweeping Laser Radar Line
      scanLineY = (scanLineY + 1.2) % h;
      const grad = ctx.createLinearGradient(0, scanLineY - 20, 0, scanLineY + 2);
      grad.addColorStop(0, 'rgba(0, 255, 102, 0)');
      grad.addColorStop(1, 'rgba(0, 255, 102, 0.14)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanLineY - 20, w, 20);

      ctx.strokeStyle = 'rgba(0, 255, 102, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(w, scanLineY);
      ctx.stroke();

      // Floating Parallax Embers
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentOpacity = Math.max(0.1, Math.min(0.85, p.opacity));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 255, 102, 0.5)';
        ctx.fill();
      });

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="global-doom-backdrop" aria-hidden="true">
      {/* 1. Base Doctor Doom Villain Artwork */}
      <div
        className="global-doom-artwork"
        style={{
          backgroundImage: "url('/assets/images/doom-villain.png')",
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) scale(1.04)`
        }}
      />

      {/* 2. Toxic Emerald Color Grade Layer */}
      <div className="global-doom-layer global-doom-layer--grade" />

      {/* 3. Pulsing Radioactive Core Flare & Gauntlet Glow */}
      <div className="global-doom-layer global-doom-layer--reactor-flare" />

      {/* 4. Heavy Cinematic Vignette */}
      <div className="global-doom-layer global-doom-layer--vignette" />

      {/* 5. Latveria Cyber Grid */}
      <div className="global-doom-layer global-doom-layer--grid" />

      {/* 6. Dynamic Embers & Laser Radar Particle Canvas */}
      <canvas id="bg-canvas" ref={canvasRef} className="global-doom-canvas" />
    </div>
  );
};
