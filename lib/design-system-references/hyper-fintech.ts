export const referenceHtml: string = `<style>
.sb-hero {
  padding: 0;
  background: #0A0A0A;
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-heading);
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* Yellow shout section — 60% of viewport */
.sb-hero-shout {
  background: var(--sb-accent);
  border-radius: 0 0 100px 100px;
  padding: var(--sb-section-pad, 160px 20px 100px);
  position: relative;
  z-index: 2;
}
.sb-hero-shout-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.sb-hero-nav {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1100px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}
.sb-hero-nav-brand {
  font-size: 20px;
  font-weight: 800;
  color: #0A0A0A;
  text-decoration: none;
  letter-spacing: -0.03em;
}
.sb-hero-nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}
.sb-hero-nav-links a {
  font-size: 14px;
  font-weight: 500;
  color: #0A0A0A;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}
.sb-hero-nav-links a:hover {
  opacity: 1;
}
.sb-hero-nav-cta {
  padding: 10px 28px;
  font-size: 13px;
  font-weight: 700;
  color: var(--sb-accent);
  background: #0A0A0A;
  border: none;
  border-radius: 9999px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.sb-hero-nav-cta:active {
  transform: scale(0.95);
}
.sb-hero-headline {
  font-size: 68px;
  font-weight: 800;
  color: #0A0A0A;
  line-height: 1.0;
  letter-spacing: -0.04em;
  margin: 0 0 24px;
  max-width: 700px;
}
.sb-hero-sub-shout {
  font-size: 18px;
  font-weight: 500;
  color: rgba(10, 10, 10, 0.65);
  line-height: 1.65;
  max-width: 480px;
  margin: 0 0 40px;
}
.sb-hero-cta-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
.sb-hero-cta-primary {
  display: inline-block;
  padding: 18px 48px;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-accent);
  background: var(--sb-cta-bg);
  border: none;
  border-radius: var(--sb-btn-radius, 9999px);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
}
.sb-hero-cta-primary:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}
.sb-hero-cta-primary:active {
  transform: scale(0.95);
}
.sb-hero-cta-secondary {
  display: inline-block;
  padding: 18px 36px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--sb-font), sans-serif;
  color: #0A0A0A;
  text-decoration: none;
  border-bottom: 2px solid rgba(10, 10, 10, 0.3);
  transition: border-color 0.3s ease;
}
.sb-hero-cta-secondary:hover {
  border-color: #0A0A0A;
}

/* Dark section below the yellow curve */
.sb-hero-dark {
  padding: 80px 20px 100px;
  position: relative;
  z-index: 1;
}
.sb-hero-dark-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.sb-hero-dark-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 32px;
}

/* Glassmorphic data cards — credit card style */
.sb-hero-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.sb-hero-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--sb-card-radius, 28px);
  padding: 36px 28px;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  overflow: hidden;
}
.sb-hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}
.sb-hero-card:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(253, 224, 71, 0.2);
  transform: translateY(-4px);
}
.sb-hero-card-chip {
  width: 40px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #FDE047 0%, #d4b832 100%);
  margin-bottom: 28px;
  opacity: 0.6;
}
.sb-hero-card-value {
  font-size: 36px;
  font-weight: 800;
  color: var(--sb-heading);
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 8px;
}
.sb-hero-card-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 20px;
}
.sb-hero-card-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
}
.sb-hero-card-bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: var(--sb-accent);
}

/* Pill badge */
.sb-hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(253, 224, 71, 0.1);
  border: 1px solid rgba(253, 224, 71, 0.2);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--sb-accent);
  margin-bottom: 28px;
}
.sb-hero-pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sb-accent);
}

/* Fade-up */
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero-shout { padding: 140px 20px 80px; border-radius: 0 0 60px 60px; }
  .sb-hero-headline { font-size: 42px; }
  .sb-hero-cards { grid-template-columns: 1fr; }
  .sb-hero-nav-links a { display: none; }
  .sb-hero-cta-row { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .sb-hero-shout { padding: 120px 16px 60px; border-radius: 0 0 40px 40px; }
  .sb-hero-headline { font-size: 32px; }
  .sb-hero-sub-shout { font-size: 16px; }
  .sb-hero-cta-primary { padding: 16px 36px; font-size: 14px; }
  .sb-hero-dark { padding: 48px 16px 60px; }
  .sb-hero-card { border-radius: 20px; padding: 28px 22px; }
  .sb-hero-card-value { font-size: 28px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-shout">
    <nav class="sb-hero-nav">
      <a href="#" class="sb-hero-nav-brand">Kinetic</a>
      <div class="sb-hero-nav-links">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">Developers</a>
        <a href="#" class="sb-hero-nav-cta">Open Account</a>
      </div>
    </nav>

    <div class="sb-hero-shout-inner">
      <div class="sb-hero-pill fade-up"><span class="sb-hero-pill-dot"></span> Now serving 22 markets</div>
      <h1 class="sb-hero-headline fade-up">Money should move at the speed of your business.</h1>
      <p class="sb-hero-sub-shout fade-up">Instant payouts, multi-currency accounts, and financial APIs that actually work. Built for founders who outgrew their bank.</p>
      <div class="sb-hero-cta-row fade-up">
        <a href="#" class="sb-hero-cta-primary">Open a Free Account</a>
        <a href="#" class="sb-hero-cta-secondary">Talk to Sales</a>
      </div>
    </div>
  </div>

  <div class="sb-hero-dark">
    <div class="sb-hero-dark-inner">
      <div class="sb-hero-dark-label fade-up">Your dashboard at a glance</div>
      <div class="sb-hero-cards fade-up">
        <div class="sb-hero-card">
          <div class="sb-hero-card-chip"></div>
          <div class="sb-hero-card-value">$2.4M</div>
          <div class="sb-hero-card-title">Total Volume (30d)</div>
          <div class="sb-hero-card-bar">
            <div class="sb-hero-card-bar-fill" style="width: 78%;"></div>
          </div>
        </div>
        <div class="sb-hero-card">
          <div class="sb-hero-card-chip"></div>
          <div class="sb-hero-card-value">340ms</div>
          <div class="sb-hero-card-title">Avg. Settlement Time</div>
          <div class="sb-hero-card-bar">
            <div class="sb-hero-card-bar-fill" style="width: 92%;"></div>
          </div>
        </div>
        <div class="sb-hero-card">
          <div class="sb-hero-card-chip"></div>
          <div class="sb-hero-card-value">99.98%</div>
          <div class="sb-hero-card-title">Uptime (12mo)</div>
          <div class="sb-hero-card-bar">
            <div class="sb-hero-card-bar-fill" style="width: 99%;"></div>
          </div>
        </div>
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
