export const referenceHtml: string = `<style>
.sb-hero {
  padding: var(--sb-section-pad, 140px 20px 120px);
  background: #0a0a0a;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
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
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 1;
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}
.sb-hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: rgba(167,139,113,0.06);
  box-shadow: 0 0 100px rgba(167,139,113,0.2), 0 0 300px rgba(167,139,113,0.08);
  pointer-events: none;
  z-index: 0;
}
.sb-hero-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sb-accent);
  margin-bottom: 48px;
}
.sb-hero-headline {
  font-family: var(--sb-font), serif;
  font-style: italic;
  font-weight: 400;
  font-size: 64px;
  line-height: 1.1;
  color: #ffffff;
  margin: 0 0 24px;
  letter-spacing: -0.01em;
}
.sb-hero-headline em {
  font-style: italic;
  color: var(--sb-body);
}
.sb-hero-gold-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--sb-accent), transparent);
  margin: 0 auto 40px;
}
.sb-hero-sub {
  font-size: 17px;
  font-weight: 300;
  color: rgba(255,255,255,0.55);
  line-height: 1.75;
  max-width: 520px;
  margin: 0 auto 56px;
  letter-spacing: 0.01em;
}
.sb-hero-glass-row {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 64px;
}
.sb-hero-glass-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--sb-card-radius, 16px);
  padding: 32px 28px;
  width: 200px;
  text-align: center;
}
.sb-hero-glass-card-number {
  font-family: var(--sb-font), serif;
  font-style: italic;
  font-size: 36px;
  font-weight: 700;
  color: var(--sb-body);
  margin-bottom: 8px;
}
.sb-hero-glass-card-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}
.sb-hero-cta {
  display: inline-block;
  padding: 18px 56px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #0a0a0a;
  background: linear-gradient(135deg, var(--sb-body), var(--sb-accent));
  border: none;
  border-radius: 0;
  text-decoration: none;
  cursor: pointer;
  transition: all 500ms cubic-bezier(0.77, 0, 0.175, 1);
}
.sb-hero-cta:hover {
  background: linear-gradient(135deg, var(--sb-heading), var(--sb-body));
  box-shadow: 0 0 40px rgba(167,139,113,0.3);
}
.sb-hero-footer-note {
  margin-top: 48px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.15em;
  text-transform: uppercase;
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
  .sb-hero { padding: 100px 20px 80px; }
  .sb-hero-headline { font-size: 42px; }
  .sb-hero-glass-row { flex-direction: column; align-items: center; gap: 16px; }
  .sb-hero-glass-card { width: 260px; }
}
@media (max-width: 480px) {
  .sb-hero { padding: 80px 16px 60px; }
  .sb-hero-headline { font-size: 32px; }
  .sb-hero-sub { font-size: 15px; max-width: 90%; }
  .sb-hero-cta { padding: 16px 40px; font-size: 11px; }
  .sb-hero-glass-card { width: 90%; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-glow"></div>
  <div class="sb-hero-inner">
    <span class="sb-hero-label fade-up">Private Wealth Advisory</span>
    <h1 class="sb-hero-headline fade-up">The Art of <em>Quiet</em> Wealth</h1>
    <div class="sb-hero-gold-line fade-up"></div>
    <p class="sb-hero-sub fade-up">We architect portfolios for families who measure success in generations, not quarters. Discreet counsel for those who have already arrived.</p>
    <div class="sb-hero-glass-row fade-up">
      <div class="sb-hero-glass-card">
        <div class="sb-hero-glass-card-number">$4.2B</div>
        <div class="sb-hero-glass-card-label">Assets Managed</div>
      </div>
      <div class="sb-hero-glass-card">
        <div class="sb-hero-glass-card-number">18yr</div>
        <div class="sb-hero-glass-card-label">Avg. Relationship</div>
      </div>
      <div class="sb-hero-glass-card">
        <div class="sb-hero-glass-card-number">140</div>
        <div class="sb-hero-glass-card-label">Family Offices</div>
      </div>
    </div>
    <a href="#" class="sb-hero-cta fade-up">Request an Introduction</a>
    <p class="sb-hero-footer-note fade-up">By referral &mdash; Geneva &mdash; London &mdash; Singapore</p>
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
