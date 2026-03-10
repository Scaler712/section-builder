export const referenceHtml: string = `<style>
.sb-hero {
  padding: var(--sb-section-pad, 80px 20px);
  background: #ffffff;
  font-family: var(--sb-font), sans-serif;
  position: relative;
  overflow: hidden;
}
.sb-hero-vert-strip {
  position: absolute;
  writing-mode: vertical-rl;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.08);
  pointer-events: none;
  z-index: 0;
}
.sb-hero-vert-strip.left { top: 0; left: 24px; }
.sb-hero-vert-strip.right { top: 0; right: 24px; }
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.sb-hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48px;
}
.sb-hero-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sb-heading);
}
.sb-hero-sticker {
  display: inline-block;
  background: var(--sb-accent);
  color: var(--sb-heading);
  font-size: 12px;
  font-weight: 800;
  font-family: 'DM Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 10px 20px;
  border: 4px solid var(--sb-heading);
  transform: rotate(3deg);
  box-shadow: 6px 6px 0px 0px #000;
}
.sb-hero-headline {
  margin-bottom: 40px;
}
.sb-hero-headline h1 {
  font-family: 'DM Sans', sans-serif;
  font-size: 76px;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--sb-heading);
  line-height: 0.85;
  letter-spacing: -0.03em;
}
.sb-hero-headline h1 .volt {
  color: var(--sb-accent);
  background: var(--sb-cta-bg);
  padding: 0 12px;
  display: inline-block;
}
.sb-hero-body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
  margin-bottom: 48px;
}
.sb-hero-desc p {
  font-size: 17px;
  color: var(--sb-body);
  line-height: 1.65;
  font-weight: 400;
}
.sb-hero-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sb-hero-step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border: 4px solid var(--sb-heading);
  box-shadow: 6px 6px 0px 0px #000;
  background: #ffffff;
}
.sb-hero-step-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--sb-heading);
  background: var(--sb-accent);
  padding: 4px 10px;
  border: 2px solid #000;
  white-space: nowrap;
}
.sb-hero-step-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--sb-heading);
  line-height: 1.4;
}
.sb-hero-cta-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.sb-hero-cta {
  display: inline-block;
  padding: 18px 44px;
  background: var(--sb-cta-bg);
  color: var(--sb-accent);
  font-size: 15px;
  font-weight: 800;
  font-family: 'DM Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  border: 4px solid var(--sb-cta-bg);
  box-shadow: 8px 8px 0px 0px #000;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.sb-hero-cta:hover {
  transform: translate(8px, 8px);
  box-shadow: 0px 0px 0px 0px #000;
}
.sb-hero-cta-note {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: var(--sb-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: 50px 16px; }
  .sb-hero-headline h1 { font-size: 48px; }
  .sb-hero-body-grid { grid-template-columns: 1fr; gap: 32px; }
  .sb-hero-vert-strip { display: none; }
  .sb-hero-top { flex-direction: column; align-items: flex-start; gap: 16px; }
}
@media (max-width: 480px) {
  .sb-hero-headline h1 { font-size: 34px; }
  .sb-hero-desc p { font-size: 15px; }
  .sb-hero-cta { padding: 16px 32px; font-size: 13px; box-shadow: 6px 6px 0px 0px #000; }
  .sb-hero-cta:hover { transform: translate(6px, 6px); }
  .sb-hero-sticker { font-size: 11px; padding: 8px 16px; }
  .sb-hero-cta-row { flex-direction: column; align-items: flex-start; gap: 14px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-vert-strip left">Launch Protocol // Active</div>
  <div class="sb-hero-vert-strip right">System v2.4 // Operational</div>
  <div class="sb-hero-inner">
    <div class="sb-hero-top fade-up">
      <span class="sb-hero-number">01 // Product</span>
      <span class="sb-hero-sticker">Early Access</span>
    </div>
    <div class="sb-hero-headline fade-up">
      <h1>Stop guessing.<br/>Start <span class="volt">shipping.</span></h1>
    </div>
    <div class="sb-hero-body-grid">
      <div class="sb-hero-desc fade-up">
        <p>Deploy production-ready landing pages in minutes, not weeks. Our AI handles copy, layout, and conversion optimization so you can focus on the product that matters.</p>
      </div>
      <div class="sb-hero-steps fade-up">
        <div class="sb-hero-step">
          <span class="sb-hero-step-num">01.</span>
          <span class="sb-hero-step-text">Describe your product in one sentence</span>
        </div>
        <div class="sb-hero-step">
          <span class="sb-hero-step-num">02.</span>
          <span class="sb-hero-step-text">Pick a conversion goal and audience</span>
        </div>
        <div class="sb-hero-step">
          <span class="sb-hero-step-num">03.</span>
          <span class="sb-hero-step-text">Deploy a page that actually converts</span>
        </div>
      </div>
    </div>
    <div class="sb-hero-cta-row fade-up">
      <a href="#" class="sb-hero-cta">Request access</a>
      <span class="sb-hero-cta-note">No credit card // 14-day trial</span>
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
