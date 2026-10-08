(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.getElementById('space');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, stars = [], speed = 14, target = 1, last = 0, raf = 0, calm = 0;

  // --- Starfield: one canvas, drawn in a single pass per frame ---
  function resize() {
    if (innerWidth === w && Math.abs(innerHeight - h) < 140) return; // ignore mobile URL-bar resizes
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const lowEnd = (navigator.hardwareConcurrency || 4) <= 4;
    const count = Math.min(lowEnd ? 140 : 240, Math.round(w * h / 5000));
    stars = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, r: .5 + Math.random() * 1.3 }));
    if (reduce.matches) draw(0);
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(190,255,255,.75)';
    ctx.lineWidth = 1;
    const streak = speed > 2.5;
    ctx.beginPath();
    for (const s of stars) {
      s.y -= s.r * speed * .35 * dt;
      if (s.y < -40) { s.y = h + 10; s.x = Math.random() * w; }
      if (streak) { ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + s.r * speed * 2.2); }
      else ctx.fillRect(s.x, s.y, s.r, s.r);
    }
    if (streak) ctx.stroke();
  }

  function frame(t) {
    const dt = Math.min((t - last) / 16.7 || 1, 3);
    last = t;
    speed += (target - speed) * Math.min(.1 * dt, 1);
    draw(dt);
    raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!raf && !reduce.matches && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  addEventListener('resize', resize);
  reduce.addEventListener?.('change', () => { stop(); start(); resize(); });

  // --- Views: hash routing, so the phone's Back button works ---
  const views = [...document.querySelectorAll('.view')];
  let current = document.querySelector('.view.is-active');

  function go(id, first) {
    const next = views.find(v => v.id === id) || views[0];
    if (next === current && !first) return;
    if (current) { current.classList.remove('is-active'); current.inert = true; }
    next.inert = false;
    next.scrollTop = 0;
    next.classList.add('is-active');
    next.querySelector('h1,h2')?.focus({ preventScroll: true });
    current = next;
    if (!reduce.matches && !first) { target = 14; clearTimeout(calm); calm = setTimeout(() => (target = 1), 450); }
  }

  addEventListener('hashchange', () => go(location.hash.slice(1)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && current.id !== 'home') location.hash = '#home'; });

  resize();
  go(location.hash.slice(1) || 'home', true);
  if (reduce.matches) { speed = 1; draw(0); } else { target = 1; start(); }
})();
