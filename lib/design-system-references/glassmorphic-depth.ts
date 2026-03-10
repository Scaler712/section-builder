export const referenceHtml: string = `<style>
@keyframes sb-fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.sb-hero {
  padding: 0;
  background: #000000;
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-heading);
  overflow: hidden;
  position: relative;
  min-height: 92vh;
}

/* Grain overlay */
.sb-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.15;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}

/* Massive watermark text */
.sb-hero-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--sb-font), sans-serif;
  font-weight: 700;
  font-size: 22vw;
  color: rgba(255, 255, 255, 0.03);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  letter-spacing: -0.05em;
}

/* Floating glass navbar pill */
.sb-hero-navbar {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 12px 12px 12px 28px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
}
.sb-hero-navbar-brand {
  font-size: 14px;
  font-weight: 700;
  color: var(--sb-heading);
  text-decoration: none;
  letter-spacing: -0.03em;
}
.sb-hero-navbar-links {
  display: flex;
  gap: 20px;
  align-items: center;
}
.sb-hero-navbar-links a {
  font-size: 12px;
  font-weight: 400;
  color: rgba(244, 244, 245, 0.5);
  text-decoration: none;
  transition: color 0.3s ease;
}
.sb-hero-navbar-links a:hover {
  color: var(--sb-heading);
}
.sb-hero-navbar-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  background: var(--sb-accent);
  border: none;
  border-radius: var(--sb-btn-radius, 50px);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}
.sb-hero-navbar-cta:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(52, 211, 153, 0.3);
}
.sb-hero-navbar-cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  font-size: 11px;
}

/* Inner content */
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: var(--sb-section-pad, 200px 20px 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.sb-hero-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sb-accent);
  margin-bottom: 40px;
}
.sb-hero-headline {
  font-family: var(--sb-font), sans-serif;
  font-weight: 600;
  font-size: 72px;
  line-height: 1.05;
  color: var(--sb-heading);
  margin: 0 0 28px;
  letter-spacing: -0.05em;
  max-width: 800px;
}
.sb-hero-headline em {
  font-style: normal;
  color: var(--sb-accent);
}
.sb-hero-sub {
  font-size: 17px;
  font-weight: 300;
  color: rgba(244, 244, 245, 0.45);
  line-height: 1.75;
  max-width: 520px;
  margin: 0 auto 56px;
}

/* CTA pill with nested icon */
.sb-hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 6px 6px 32px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-heading);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--sb-btn-radius, 50px);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-cta:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.05);
  border-color: rgba(52, 211, 153, 0.3);
}
.sb-hero-cta-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--sb-accent);
  border-radius: 50%;
  color: #000000;
  font-size: 18px;
  font-weight: 700;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-cta:hover .sb-hero-cta-circle {
  transform: scale(1.1);
}

/* Glass cards row */
.sb-hero-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 80px;
  width: 100%;
}
.sb-hero-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--sb-card-radius, 2.5rem);
  padding: 40px 28px;
  text-align: left;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(52, 211, 153, 0.2);
  transform: translateY(-4px);
}
.sb-hero-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 1rem;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 24px;
}
.sb-hero-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--sb-heading);
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}
.sb-hero-card-desc {
  font-size: 13px;
  font-weight: 300;
  color: rgba(244, 244, 245, 0.4);
  line-height: 1.65;
  margin: 0;
}
.sb-hero-card-stat {
  margin-top: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--sb-accent);
  letter-spacing: -0.04em;
}

/* Fade-up */
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero-inner { padding: 160px 20px 60px; }
  .sb-hero-headline { font-size: 44px; }
  .sb-hero-cards { grid-template-columns: 1fr; gap: 16px; }
  .sb-hero-navbar-links { display: none; }
  .sb-hero-navbar { padding: 10px 10px 10px 20px; gap: 16px; }
  .sb-hero-watermark { font-size: 30vw; }
}
@media (max-width: 480px) {
  .sb-hero-inner { padding: 130px 16px 48px; }
  .sb-hero-headline { font-size: 32px; }
  .sb-hero-sub { font-size: 15px; max-width: 90%; }
  .sb-hero-cta { padding: 5px 5px 5px 24px; font-size: 13px; }
  .sb-hero-card { border-radius: 1.5rem; padding: 28px 20px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-watermark">VELOCITY</div>

  <nav class="sb-hero-navbar">
    <a href="#" class="sb-hero-navbar-brand">Velocity</a>
    <div class="sb-hero-navbar-links">
      <a href="#">Platform</a>
      <a href="#">Pricing</a>
      <a href="#">Docs</a>
      <a href="#">Changelog</a>
    </div>
    <a href="#" class="sb-hero-navbar-cta">Get Started <span class="sb-hero-navbar-cta-icon">&rarr;</span></a>
  </nav>

  <div class="sb-hero-inner">
    <span class="sb-hero-label fade-up">Infrastructure for Modern Teams</span>
    <h1 class="sb-hero-headline fade-up">Deploy at the speed of <em>thought</em></h1>
    <p class="sb-hero-sub fade-up">Zero-config deployments, edge-first architecture, and observability that actually helps you ship. Built for teams who refuse to wait.</p>
    <a href="#" class="sb-hero-cta fade-up">
      Start deploying free
      <span class="sb-hero-cta-circle">&rarr;</span>
    </a>

    <div class="sb-hero-cards fade-up">
      <div class="sb-hero-card">
        <div class="sb-hero-card-icon">&lt;/&gt;</div>
        <h3 class="sb-hero-card-title">Zero-Config Builds</h3>
        <p class="sb-hero-card-desc">Push your code and we handle the rest. Auto-detected frameworks, optimized bundling, instant rollbacks.</p>
        <div class="sb-hero-card-stat">340ms</div>
      </div>
      <div class="sb-hero-card">
        <div class="sb-hero-card-icon">&#9678;</div>
        <h3 class="sb-hero-card-title">Edge Network</h3>
        <p class="sb-hero-card-desc">42 global edge locations. Your users hit cached content in under 50ms, no matter where they are.</p>
        <div class="sb-hero-card-stat">42 PoPs</div>
      </div>
      <div class="sb-hero-card">
        <div class="sb-hero-card-icon">&#9670;</div>
        <h3 class="sb-hero-card-title">Live Observability</h3>
        <p class="sb-hero-card-desc">Real-time logs, error tracking, and performance metrics. See exactly what your app is doing, as it does it.</p>
        <div class="sb-hero-card-stat">99.99%</div>
      </div>
    </div>
  </div>
</div>

<script>
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  var elements = document.querySelectorAll('.sb-hero .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`;
