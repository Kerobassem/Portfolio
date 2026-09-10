/**
 * Ink Currents — background animation for graphics.html
 * Drop this file next to graphics.html, then add before </body>:
 *   <script src="bg-animation.js" defer></script>
 *
 * The script creates a <canvas> and injects it as the first child of <body>,
 * sitting behind all existing content (z-index: -1).
 * Responds to data-theme="light" / "dark" changes automatically.
 */
(function () {
  'use strict';

  /* ── Canvas setup ── */
  const cv = document.createElement('canvas');
  cv.id = 'inkCurrCanvas';
  cv.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;' +
    'z-index:-1;pointer-events:none;display:block;';
  document.body.insertBefore(cv, document.body.firstChild);

  const cx = cv.getContext('2d');

  function resize() {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Theme-aware palette ── */
  function palette() {
    const dark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    return {
      bg: dark ? [5, 10, 16] : [232, 242, 252],
      trailAlpha: dark ? 0.065 : 0.07,
      blue: dark ? [46, 143, 255] : [26, 107, 204],
      orange: dark ? [255, 136, 0] : [230, 120, 0],
      teal: dark ? [0, 200, 180] : [0, 150, 140],
      orbAlpha: dark ? 1 : 0.6,
    };
  }

  function rgba(rgb, a) {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
  }

  /* ── Flow field angle ── */
  function flowAngle(x, y, t) {
    const nx = x * 0.0016, ny = y * 0.0016;
    return (
      Math.sin(nx + t * 0.26) * Math.cos(ny - t * 0.19) * Math.PI * 2 +
      Math.cos(nx * 1.8 + t * 0.11) * 0.9 +
      Math.sin(ny * 2.1 - t * 0.08) * 0.5
    );
  }

  /* ── Flow particle ── */
  class Particle {
    constructor(spread) { this.reset(spread); }

    reset(spread) {
      this.x = Math.random() * cv.width;
      this.y = spread
        ? Math.random() * cv.height
        : Math.random() < 0.5 ? -10 : cv.height + 10;
      this.px = this.x;
      this.py = this.y;
      this.spd  = 0.7 + Math.random() * 1.6;
      this.life = 0;
      this.max  = 150 + Math.random() * 270;
      this.lw   = 0.35 + Math.random() * 1.4;
      const r = Math.random();
      this._tint = r < 0.55 ? 'blue' : r < 0.82 ? 'orange' : 'teal';
    }

    tick(t) {
      this.px = this.x;
      this.py = this.y;
      const a = flowAngle(this.x, this.y, t);
      this.x += Math.cos(a) * this.spd;
      this.y += Math.sin(a) * this.spd;
      this.life++;
      if (
        this.life >= this.max ||
        this.x < -20 || this.x > cv.width + 20 ||
        this.y < -20 || this.y > cv.height + 20
      ) this.reset(false);
    }

    draw(pal) {
      const fi = Math.min(this.life / 45, 1);
      const fo = Math.min((this.max - this.life) / 45, 1);
      cx.beginPath();
      cx.moveTo(this.px, this.py);
      cx.lineTo(this.x, this.y);
      cx.strokeStyle = rgba(pal[this._tint], fi * fo * 0.3);
      cx.lineWidth = this.lw;
      cx.stroke();
    }
  }

  /* ── Floating geometric shape ── */
  class GeoShape {
    constructor() { this.reset(true); }

    reset(spread) {
      this.x    = Math.random() * cv.width;
      this.y    = spread ? Math.random() * cv.height : cv.height + 70;
      this.s    = 5 + Math.random() * 22;
      this.vy   = -(0.1 + Math.random() * 0.28);
      this.vx   = (Math.random() - 0.5) * 0.22;
      this.rot  = Math.random() * Math.PI * 2;
      this.rv   = (Math.random() - 0.5) * 0.007;
      this.type = Math.floor(Math.random() * 3); // 0 circle, 1 rect, 2 tri
      this._tint = Math.random() > 0.5 ? 'blue' : 'orange';
      this.a    = 0.04 + Math.random() * 0.11;
    }

    tick() {
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.rv;
      if (this.y < -80) this.reset(false);
    }

    draw(pal) {
      cx.save();
      cx.translate(this.x, this.y);
      cx.rotate(this.rot);
      cx.globalAlpha = this.a;
      cx.strokeStyle = rgba(pal[this._tint], 1);
      cx.lineWidth   = 1;
      cx.beginPath();
      if (this.type === 0) {
        cx.arc(0, 0, this.s, 0, Math.PI * 2);
      } else if (this.type === 1) {
        cx.rect(-this.s, -this.s, this.s * 2, this.s * 2);
      } else {
        const h = this.s;
        cx.moveTo(0, -h);
        cx.lineTo(h * 0.866, h * 0.5);
        cx.lineTo(-h * 0.866, h * 0.5);
        cx.closePath();
      }
      cx.stroke();
      cx.restore();
      cx.globalAlpha = 1;
    }
  }

  /* ── Pulsing radial orb ── */
  class Orb {
    constructor(rx, ry, maxR, tint, phase) {
      this.rx = rx; this.ry = ry;
      this.maxR = maxR; this.tint = tint;
      this.phase = phase;
    }

    draw(t, pal) {
      const scale = 1 + Math.sin(t * 0.7 + this.phase) * 0.18;
      const r = this.maxR * scale;
      const x = this.rx * cv.width, y = this.ry * cv.height;
      const grd = cx.createRadialGradient(x, y, 0, x, y, r);
      const col = pal[this.tint];
      grd.addColorStop(0, rgba(col, 0.10 * pal.orbAlpha));
      grd.addColorStop(1, rgba(pal.bg, 0));
      cx.fillStyle = grd;
      cx.fillRect(0, 0, cv.width, cv.height);
    }
  }

  /* ── Init objects ── */
  const COUNT = Math.min(320, Math.floor(window.innerWidth * 0.45));
  const particles = Array.from({ length: COUNT }, () => new Particle(true));
  const shapes    = Array.from({ length: 22 },   () => new GeoShape());
  const orbs = [
    new Orb(0.15, 0.25, 220, 'blue',   0),
    new Orb(0.85, 0.72, 180, 'orange', Math.PI),
    new Orb(0.50, 0.05, 150, 'blue',   2.1),
    new Orb(0.70, 0.38, 130, 'teal',   1.3),
    new Orb(0.30, 0.85, 160, 'orange', 0.7),
  ];

  /* ── Animation loop ── */
  let t = 0;
  let pal = palette();

  /* Update palette when theme toggles */
  const themeObs = new MutationObserver(() => { pal = palette(); });
  themeObs.observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme']
  });

  function frame() {
    /* Trail fade */
    cx.fillStyle = rgba(pal.bg, pal.trailAlpha);
    cx.fillRect(0, 0, cv.width, cv.height);

    /* Orbs */
    orbs.forEach(o => o.draw(t, pal));

    /* Particles */
    particles.forEach(p => { p.tick(t); p.draw(pal); });

    /* Shapes */
    shapes.forEach(s => { s.tick(); s.draw(pal); });

    t += 0.0042;
    requestAnimationFrame(frame);
  }

  /* First frame: fill bg solid so no flash */
  cx.fillStyle = rgba(pal.bg, 1);
  cx.fillRect(0, 0, cv.width, cv.height);
  frame();
})();