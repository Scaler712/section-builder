export const referenceHtml: string = `<style>
@keyframes border-spin {
  0% { --angle: 0deg; }
  100% { --angle: 360deg; }
}
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.sb-hero {
  padding: 0;
  background: #000000;
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
  background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 1;
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--sb-section-pad, 120px 20px 0);
  text-align: center;
  position: relative;
  z-index: 2;
}
.sb-hero-red-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(239,35,60,0.08);
  box-shadow: 0 0 120px rgba(239,35,60,0.15);
  pointer-events: none;
  z-index: 0;
  filter: blur(60px);
}
.sb-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
  margin-bottom: 40px;
}
.sb-hero-tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sb-accent);
  box-shadow: 0 0 8px rgba(239,35,60,0.5);
}
.sb-hero-headline {
  font-family: var(--sb-font), sans-serif;
  font-size: 72px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.0;
  margin: 0 0 32px;
  background: linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sb-hero-sub {
  font-size: 17px;
  font-weight: 400;
  color: rgba(255,255,255,0.45);
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto 56px;
}
.sb-hero-cta-wrap {
  display: inline-block;
  position: relative;
  border-radius: 100px;
  padding: 2px;
  background: conic-gradient(from var(--angle, 0deg), #ef233c, #ff6b6b, #ef233c);
  animation: border-spin 2.5s linear infinite;
}
.sb-hero-cta {
  display: block;
  padding: 18px 56px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--sb-font), sans-serif;
  letter-spacing: -0.01em;
  color: #ffffff;
  background: #000000;
  border: none;
  border-radius: 100px;
  text-decoration: none;
  cursor: pointer;
  transition: background 300ms ease;
}
.sb-hero-cta:hover {
  background: #0a0a0a;
}
.sb-hero-secondary-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.35);
  text-decoration: none;
  transition: color 300ms ease;
}
.sb-hero-secondary-link:hover { color: rgba(255,255,255,0.6); }
.sb-hero-stats-row {
  display: flex;
  justify-content: center;
  gap: 64px;
  margin-top: 72px;
  padding-bottom: 80px;
}
.sb-hero-stat-value {
  font-family: var(--sb-font), sans-serif;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--sb-heading);
}
.sb-hero-stat-value span {
  color: var(--sb-accent);
}
.sb-hero-stat-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  margin-top: 4px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.sb-hero-ticker {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 18px 0;
  overflow: hidden;
  white-space: nowrap;
}
.sb-hero-ticker-track {
  display: inline-flex;
  animation: ticker-scroll 30s linear infinite;
}
.sb-hero-ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 32px;
  padding: 0 32px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.sb-hero-ticker-item::after {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(239,35,60,0.4);
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
  .sb-hero-inner { padding: 80px 20px 0; }
  .sb-hero-headline { font-size: 44px; }
  .sb-hero-stats-row { gap: 32px; flex-wrap: wrap; }
  .sb-hero-stat-value { font-size: 24px; }
}
@media (max-width: 480px) {
  .sb-hero-inner { padding: 60px 16px 0; }
  .sb-hero-headline { font-size: 32px; }
  .sb-hero-sub { font-size: 15px; max-width: 90%; }
  .sb-hero-cta { padding: 16px 40px; font-size: 14px; }
  .sb-hero-stats-row { gap: 24px; padding-bottom: 48px; }
  .sb-hero-stat-value { font-size: 22px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-red-glow"></div>
  <div class="sb-hero-inner">
    <div class="sb-hero-tag fade-up">
      <span class="sb-hero-tag-dot"></span>
      <span>Now accepting applications</span>
    </div>
    <h1 class="sb-hero-headline fade-up">Stop guessing.<br>Start converting.</h1>
    <p class="sb-hero-sub fade-up">Performance creative that turns ad spend into revenue. We build, test, and scale video ads that consistently beat your controls.</p>
    <div class="fade-up">
      <div class="sb-hero-cta-wrap">
        <a href="#" class="sb-hero-cta">Book a strategy call</a>
      </div>
      <br>
      <a href="#" class="sb-hero-secondary-link">See recent case studies &rarr;</a>
    </div>
    <div class="sb-hero-stats-row fade-up">
      <div>
        <div class="sb-hero-stat-value">3.2<span>x</span></div>
        <div class="sb-hero-stat-label">Avg. ROAS</div>
      </div>
      <div>
        <div class="sb-hero-stat-value"><span>$</span>18M</div>
        <div class="sb-hero-stat-label">Ad Spend Managed</div>
      </div>
      <div>
        <div class="sb-hero-stat-value">240<span>+</span></div>
        <div class="sb-hero-stat-label">Winning Creatives</div>
      </div>
    </div>
  </div>
  <div class="sb-hero-ticker">
    <div class="sb-hero-ticker-track">
      <span class="sb-hero-ticker-item">Meta Ads</span>
      <span class="sb-hero-ticker-item">TikTok Ads</span>
      <span class="sb-hero-ticker-item">YouTube Pre-Roll</span>
      <span class="sb-hero-ticker-item">UGC Production</span>
      <span class="sb-hero-ticker-item">Landing Pages</span>
      <span class="sb-hero-ticker-item">A/B Testing</span>
      <span class="sb-hero-ticker-item">Creative Strategy</span>
      <span class="sb-hero-ticker-item">Meta Ads</span>
      <span class="sb-hero-ticker-item">TikTok Ads</span>
      <span class="sb-hero-ticker-item">YouTube Pre-Roll</span>
      <span class="sb-hero-ticker-item">UGC Production</span>
      <span class="sb-hero-ticker-item">Landing Pages</span>
      <span class="sb-hero-ticker-item">A/B Testing</span>
      <span class="sb-hero-ticker-item">Creative Strategy</span>
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
