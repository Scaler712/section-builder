export const referenceHtml: string = `<style>
.sb-hero {
  padding: 0;
  background: #0C0A09;
  font-family: 'Inter', sans-serif;
  color: var(--sb-heading);
  overflow: hidden;
  position: relative;
}
.sb-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 512px 512px;
  pointer-events: none;
  z-index: 1;
}
.sb-hero-nav {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 3;
}
.sb-hero-nav-brand {
  font-family: var(--sb-font), serif;
  font-weight: 400;
  font-style: italic;
  font-size: 20px;
  color: var(--sb-heading);
}
.sb-hero-nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}
.sb-hero-nav-link {
  font-size: 13px;
  font-weight: 400;
  color: rgba(231,229,228,0.45);
  text-decoration: none;
  transition: color 300ms ease;
}
.sb-hero-nav-link:hover { color: var(--sb-heading); }
.sb-hero-nav-cta {
  font-size: 12px;
  font-weight: 500;
  color: #0C0A09;
  background: var(--sb-cta-bg);
  padding: 10px 24px;
  border-radius: var(--sb-btn-radius, 100px);
  text-decoration: none;
  transition: background 300ms ease;
}
.sb-hero-nav-cta:hover { background: #dff580; }
.sb-hero-divider {
  max-width: 1100px;
  margin: 0 auto;
  height: 1px;
  background: rgba(231,229,228,0.08);
  position: relative;
  z-index: 2;
}
.sb-hero-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--sb-section-pad, 100px 20px 120px);
  display: flex;
  align-items: center;
  gap: 56px;
  position: relative;
  z-index: 2;
}
.sb-hero-left {
  flex: 5;
}
.sb-hero-right {
  flex: 7;
}
.sb-hero-mono-label {
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(231,229,228,0.35);
  margin-bottom: 32px;
}
.sb-hero-mono-label span {
  color: var(--sb-accent);
}
.sb-hero-headline {
  font-family: var(--sb-font), serif;
  font-weight: 300;
  font-size: 56px;
  line-height: 1.12;
  color: var(--sb-heading);
  margin: 0 0 32px;
  letter-spacing: -0.01em;
}
.sb-hero-headline em {
  font-style: italic;
  font-weight: 300;
  color: var(--sb-accent);
}
.sb-hero-sub {
  font-size: 16px;
  font-weight: 400;
  color: rgba(231,229,228,0.5);
  line-height: 1.75;
  margin: 0 0 44px;
  max-width: 400px;
}
.sb-hero-cta-group {
  display: flex;
  gap: 16px;
  align-items: center;
}
.sb-hero-cta-primary {
  display: inline-block;
  padding: 16px 40px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: #0C0A09;
  background: var(--sb-cta-bg);
  border: none;
  border-radius: var(--sb-btn-radius, 100px);
  text-decoration: none;
  cursor: pointer;
  transition: all 400ms ease;
}
.sb-hero-cta-primary:hover {
  background: #dff580;
  box-shadow: 0 0 32px rgba(212,242,104,0.2);
}
.sb-hero-cta-text {
  font-size: 14px;
  font-weight: 400;
  color: rgba(231,229,228,0.45);
  text-decoration: none;
  transition: color 300ms ease;
}
.sb-hero-cta-text:hover { color: var(--sb-heading); }
.sb-hero-card-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sb-hero-card {
  background: var(--sb-highlight);
  border: 1px solid rgba(231,229,228,0.06);
  border-radius: var(--sb-card-radius, 24px);
  padding: 28px 32px;
  transition: border-color 300ms ease;
}
.sb-hero-card:hover {
  border-color: rgba(231,229,228,0.12);
}
.sb-hero-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.sb-hero-card-title {
  font-family: var(--sb-font), serif;
  font-weight: 400;
  font-size: 18px;
  color: var(--sb-heading);
}
.sb-hero-card-tag {
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--sb-accent);
  background: rgba(212,242,104,0.1);
  padding: 4px 12px;
  border-radius: 100px;
}
.sb-hero-card-desc {
  font-size: 14px;
  font-weight: 400;
  color: rgba(231,229,228,0.4);
  line-height: 1.65;
  margin: 0;
}
.sb-hero-serrated {
  position: relative;
  z-index: 2;
  height: 16px;
  background: #0C0A09;
  -webkit-mask-image: radial-gradient(circle 8px at 8px 0, transparent 8px, #000 8.5px);
  mask-image: radial-gradient(circle 8px at 8px 0, transparent 8px, #000 8.5px);
  -webkit-mask-size: 16px 16px;
  mask-size: 16px 16px;
  -webkit-mask-repeat: repeat-x;
  mask-repeat: repeat-x;
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 800ms cubic-bezier(0.77, 0, 0.175, 1), transform 800ms cubic-bezier(0.77, 0, 0.175, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero-body { flex-direction: column; padding: 64px 20px 80px; }
  .sb-hero-headline { font-size: 40px; }
  .sb-hero-nav-links { display: none; }
}
@media (max-width: 480px) {
  .sb-hero-body { padding: 48px 16px 60px; }
  .sb-hero-headline { font-size: 32px; }
  .sb-hero-sub { font-size: 14px; }
  .sb-hero-cta-primary { padding: 14px 32px; font-size: 13px; }
  .sb-hero-cta-group { flex-direction: column; align-items: flex-start; }
  .sb-hero-card { padding: 24px; border-radius: 20px; }
}
</style>

<div class="sb-hero">
  <nav class="sb-hero-nav fade-up">
    <span class="sb-hero-nav-brand">Terrafirm</span>
    <div class="sb-hero-nav-links">
      <a href="#" class="sb-hero-nav-link">Services</a>
      <a href="#" class="sb-hero-nav-link">Work</a>
      <a href="#" class="sb-hero-nav-link">Journal</a>
      <a href="#" class="sb-hero-nav-cta">Get in touch</a>
    </div>
  </nav>
  <div class="sb-hero-divider"></div>
  <div class="sb-hero-body">
    <div class="sb-hero-left">
      <div class="sb-hero-mono-label fade-up"><span>//</span> Landscape Architecture Studio</div>
      <h1 class="sb-hero-headline fade-up">Spaces that breathe with the <em>land</em>, not against it.</h1>
      <p class="sb-hero-sub fade-up">We design landscapes that feel inevitable. Regenerative systems, native plantings, and built environments that age into beauty over decades.</p>
      <div class="sb-hero-cta-group fade-up">
        <a href="#" class="sb-hero-cta-primary">Explore our process</a>
        <a href="#" class="sb-hero-cta-text">View portfolio &rarr;</a>
      </div>
    </div>
    <div class="sb-hero-right">
      <div class="sb-hero-card-stack">
        <div class="sb-hero-card fade-up">
          <div class="sb-hero-card-top">
            <span class="sb-hero-card-title">Regenerative Design</span>
            <span class="sb-hero-card-tag">Core</span>
          </div>
          <p class="sb-hero-card-desc">Every project returns more to the site than it takes. Carbon-negative landscapes that improve soil health, biodiversity, and water cycles year over year.</p>
        </div>
        <div class="sb-hero-card fade-up">
          <div class="sb-hero-card-top">
            <span class="sb-hero-card-title">Native Systems</span>
            <span class="sb-hero-card-tag">Method</span>
          </div>
          <p class="sb-hero-card-desc">We work exclusively with region-specific species. Zero irrigation dependencies after the establishment period. Maintenance costs drop 60% by year three.</p>
        </div>
        <div class="sb-hero-card fade-up">
          <div class="sb-hero-card-top">
            <span class="sb-hero-card-title">Living Materials</span>
            <span class="sb-hero-card-tag">Innovation</span>
          </div>
          <p class="sb-hero-card-desc">Mycelium-based hardscaping, reclaimed timber structures, and living walls that filter stormwater. Built to weather, not to weather-proof.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="sb-hero-serrated"></div>
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
