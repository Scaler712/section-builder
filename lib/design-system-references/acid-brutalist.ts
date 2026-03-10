export const referenceHtml: string = `<style>
@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes float-bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.sb-hero {
  padding: 0;
  background: var(--sb-highlight);
  font-family: var(--sb-font), sans-serif;
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
  opacity: 0.03;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  pointer-events: none;
  z-index: 1;
}
.sb-hero-marquee {
  border-top: 2px solid var(--sb-heading);
  border-bottom: 2px solid var(--sb-heading);
  padding: 14px 0;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  z-index: 2;
}
.sb-hero-marquee-track {
  display: inline-flex;
  animation: marquee-scroll 20s linear infinite;
}
.sb-hero-marquee-item {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  padding: 0 24px;
  color: var(--sb-heading);
}
.sb-hero-marquee-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--sb-accent);
  border-radius: 50%;
  margin: 0 24px;
  vertical-align: middle;
}
.sb-hero-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--sb-section-pad, 80px 20px 100px);
  position: relative;
  z-index: 2;
}
.sb-hero-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 64px;
}
.sb-hero-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--sb-heading);
  background: var(--sb-accent);
  padding: 8px 20px;
  border: 2px solid var(--sb-heading);
  border-radius: 32px;
  box-shadow: 3px 3px 0px 0px #09090B;
}
.sb-hero-float-shape {
  width: 48px;
  height: 48px;
  border: 2px solid var(--sb-heading);
  border-radius: 50%;
  animation: float-bounce 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.sb-hero-headline {
  font-size: 72px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.05em;
  line-height: 0.95;
  margin: 0 0 40px;
  color: var(--sb-heading);
}
.sb-hero-headline-accent {
  display: inline-block;
  background: var(--sb-accent);
  padding: 0 12px;
  border: 2px solid var(--sb-heading);
  box-shadow: 4px 4px 0px 0px #09090B;
}
.sb-hero-content-row {
  display: flex;
  align-items: flex-end;
  gap: 48px;
}
.sb-hero-content-left {
  flex: 1;
}
.sb-hero-sub {
  font-size: 17px;
  font-weight: 400;
  color: var(--sb-heading);
  line-height: 1.7;
  max-width: 420px;
  margin: 0 0 40px;
  opacity: 0.7;
}
.sb-hero-cta-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
.sb-hero-cta-primary {
  display: inline-block;
  padding: 18px 44px;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--sb-font), sans-serif;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--sb-highlight);
  background: var(--sb-cta-bg);
  border: 2px solid var(--sb-cta-bg);
  border-radius: var(--sb-btn-radius, 32px);
  text-decoration: none;
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px #09090B;
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.sb-hero-cta-primary:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #09090B;
}
.sb-hero-cta-secondary {
  display: inline-block;
  padding: 18px 44px;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--sb-font), sans-serif;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--sb-heading);
  background: transparent;
  border: 2px solid var(--sb-heading);
  border-radius: var(--sb-btn-radius, 32px);
  text-decoration: none;
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px #09090B;
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.sb-hero-cta-secondary:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px #09090B;
}
.sb-hero-content-right {
  flex-shrink: 0;
}
.sb-hero-feature-card {
  background: #ffffff;
  border: 2px solid var(--sb-heading);
  border-radius: var(--sb-card-radius, 24px);
  padding: 32px;
  width: 320px;
  box-shadow: 4px 4px 0px 0px #09090B;
}
.sb-hero-feature-card-icon {
  width: 48px;
  height: 48px;
  background: var(--sb-accent);
  border: 2px solid var(--sb-heading);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 20px;
  box-shadow: 3px 3px 0px 0px #09090B;
}
.sb-hero-feature-card-title {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}
.sb-hero-feature-card-desc {
  font-size: 14px;
  font-weight: 400;
  color: var(--sb-heading);
  opacity: 0.6;
  line-height: 1.6;
  margin: 0;
}
.sb-hero-bottom-strip {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 72px;
  padding-top: 32px;
  border-top: 2px solid var(--sb-heading);
}
.sb-hero-bottom-stat-value {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.sb-hero-bottom-stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.5;
  margin-top: 2px;
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 700ms cubic-bezier(0.77, 0, 0.175, 1), transform 700ms cubic-bezier(0.77, 0, 0.175, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero-main { padding: 56px 20px 72px; }
  .sb-hero-headline { font-size: 44px; }
  .sb-hero-content-row { flex-direction: column; align-items: flex-start; }
  .sb-hero-feature-card { width: 100%; }
  .sb-hero-bottom-strip { gap: 28px; flex-wrap: wrap; justify-content: flex-start; }
  .sb-hero-cta-row { flex-direction: column; }
}
@media (max-width: 480px) {
  .sb-hero-main { padding: 40px 16px 56px; }
  .sb-hero-headline { font-size: 32px; }
  .sb-hero-sub { font-size: 15px; }
  .sb-hero-cta-primary, .sb-hero-cta-secondary { padding: 16px 32px; font-size: 13px; width: 100%; text-align: center; }
  .sb-hero-bottom-stat-value { font-size: 22px; }
  .sb-hero-float-shape { display: none; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-marquee">
    <div class="sb-hero-marquee-track">
      <span class="sb-hero-marquee-item">Design Systems</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Brand Strategy</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Product Design</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Web Development</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Motion Graphics</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Design Systems</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Brand Strategy</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Product Design</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Web Development</span><span class="sb-hero-marquee-dot"></span>
      <span class="sb-hero-marquee-item">Motion Graphics</span><span class="sb-hero-marquee-dot"></span>
    </div>
  </div>
  <div class="sb-hero-main">
    <div class="sb-hero-top-row fade-up">
      <span class="sb-hero-badge">Open for Q2 projects</span>
      <div class="sb-hero-float-shape">&nearr;</div>
    </div>
    <h1 class="sb-hero-headline fade-up">We build brands<br>that <span class="sb-hero-headline-accent">refuse</span><br>to blend in.</h1>
    <div class="sb-hero-content-row">
      <div class="sb-hero-content-left">
        <p class="sb-hero-sub fade-up">Strategy-led creative studio for startups and challengers who need more than a logo. We design systems that scale from seed to series C.</p>
        <div class="sb-hero-cta-row fade-up">
          <a href="#" class="sb-hero-cta-primary">Start a project</a>
          <a href="#" class="sb-hero-cta-secondary">View work</a>
        </div>
      </div>
      <div class="sb-hero-content-right fade-up">
        <div class="sb-hero-feature-card">
          <div class="sb-hero-feature-card-icon">&diams;</div>
          <h3 class="sb-hero-feature-card-title">Full-stack brand</h3>
          <p class="sb-hero-feature-card-desc">From positioning strategy through visual identity to production-ready component libraries. One studio, zero handoffs.</p>
        </div>
      </div>
    </div>
    <div class="sb-hero-bottom-strip fade-up">
      <div>
        <div class="sb-hero-bottom-stat-value">86</div>
        <div class="sb-hero-bottom-stat-label">Projects shipped</div>
      </div>
      <div>
        <div class="sb-hero-bottom-stat-value">4.9/5</div>
        <div class="sb-hero-bottom-stat-label">Client rating</div>
      </div>
      <div>
        <div class="sb-hero-bottom-stat-value">2018</div>
        <div class="sb-hero-bottom-stat-label">Est. Brooklyn</div>
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
