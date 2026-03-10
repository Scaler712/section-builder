export const referenceHtml: string = `<style>
@keyframes shimmer-slide {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.sb-hero {
  padding: var(--sb-section-pad, 140px 20px 120px);
  background: #050505;
  font-family: 'Inter', sans-serif;
  color: var(--sb-heading);
  overflow: hidden;
  position: relative;
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.sb-hero-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 80px;
}
.sb-hero-logo {
  font-family: var(--sb-font), serif;
  font-weight: 300;
  font-style: italic;
  font-size: 22px;
  color: var(--sb-heading);
}
.sb-hero-top-links {
  display: flex;
  gap: 28px;
  align-items: center;
}
.sb-hero-top-link {
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(235,235,235,0.35);
  text-decoration: none;
  transition: color 300ms ease;
}
.sb-hero-top-link:hover { color: var(--sb-heading); }
.sb-hero-center {
  text-align: center;
  margin-bottom: 72px;
}
.sb-hero-label {
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sb-accent);
  margin-bottom: 36px;
}
.sb-hero-headline {
  font-family: var(--sb-font), serif;
  font-weight: 200;
  font-style: italic;
  font-size: 68px;
  line-height: 1.08;
  color: var(--sb-heading);
  margin: 0 0 28px;
  letter-spacing: -0.01em;
}
.sb-hero-headline-underline {
  position: relative;
  display: inline-block;
}
.sb-hero-headline-underline::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--sb-accent);
  transition: width 600ms cubic-bezier(0.77, 0, 0.175, 1);
}
.sb-hero-headline-underline.visible::after {
  width: 100%;
}
.sb-hero-sub {
  font-size: 17px;
  font-weight: 300;
  color: rgba(235,235,235,0.42);
  line-height: 1.75;
  max-width: 540px;
  margin: 0 auto 52px;
}
.sb-hero-cta-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}
.sb-hero-cta-primary {
  display: inline-block;
  padding: 18px 48px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: var(--sb-heading);
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--sb-btn-radius, 100px);
  text-decoration: none;
  cursor: pointer;
  transition: all 400ms ease;
}
.sb-hero-cta-primary:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(16,185,129,0.3);
}
.sb-hero-cta-ghost {
  font-size: 14px;
  font-weight: 400;
  color: rgba(235,235,235,0.4);
  text-decoration: none;
  transition: color 300ms ease;
  position: relative;
}
.sb-hero-cta-ghost::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--sb-accent);
  transition: width 400ms ease;
}
.sb-hero-cta-ghost:hover { color: var(--sb-heading); }
.sb-hero-cta-ghost:hover::after { width: 100%; }
.sb-hero-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.sb-hero-card {
  position: relative;
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--sb-card-radius, 24px);
  padding: 36px 28px;
  overflow: hidden;
}
.sb-hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(16,185,129,0.3), rgba(255,255,255,0.06), rgba(16,185,129,0.15));
  background-size: 200% 200%;
  animation: shimmer-slide 4s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.sb-hero-card-number {
  font-family: var(--sb-font), serif;
  font-weight: 200;
  font-style: italic;
  font-size: 42px;
  color: var(--sb-heading);
  margin-bottom: 8px;
}
.sb-hero-card-number span {
  font-size: 20px;
  color: var(--sb-accent);
}
.sb-hero-card-title {
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(235,235,235,0.35);
  margin-bottom: 16px;
}
.sb-hero-card-desc {
  font-size: 14px;
  font-weight: 300;
  color: rgba(235,235,235,0.4);
  line-height: 1.65;
  margin: 0;
}
.sb-hero-footer-line {
  margin-top: 80px;
  padding-top: 32px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sb-hero-footer-text {
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', 'Segoe UI Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(235,235,235,0.2);
}
.sb-hero-footer-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--sb-accent);
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
  .sb-hero-headline { font-size: 44px; }
  .sb-hero-cards { grid-template-columns: 1fr; }
  .sb-hero-top-links { display: none; }
  .sb-hero-footer-line { flex-direction: column; gap: 12px; text-align: center; }
}
@media (max-width: 480px) {
  .sb-hero { padding: 80px 16px 60px; }
  .sb-hero-headline { font-size: 32px; }
  .sb-hero-sub { font-size: 15px; }
  .sb-hero-cta-primary { padding: 16px 36px; font-size: 13px; }
  .sb-hero-cta-row { flex-direction: column; }
  .sb-hero-card { padding: 28px 24px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-inner">
    <div class="sb-hero-top-bar fade-up">
      <span class="sb-hero-logo">Meridian</span>
      <div class="sb-hero-top-links">
        <a href="#" class="sb-hero-top-link">About</a>
        <a href="#" class="sb-hero-top-link">Services</a>
        <a href="#" class="sb-hero-top-link">Research</a>
        <a href="#" class="sb-hero-top-link">Contact</a>
      </div>
    </div>
    <div class="sb-hero-center">
      <div class="sb-hero-label fade-up">Strategic Advisory</div>
      <h1 class="sb-hero-headline fade-up">We find the <span class="sb-hero-headline-underline">quiet leverage</span> that compounds into<br>extraordinary outcomes.</h1>
      <p class="sb-hero-sub fade-up">Growth advisory for post-Series B technology companies. We operate at the intersection of product strategy, go-to-market, and organizational design.</p>
      <div class="sb-hero-cta-row fade-up">
        <a href="#" class="sb-hero-cta-primary">Schedule a conversation</a>
        <a href="#" class="sb-hero-cta-ghost">Read our thesis &rarr;</a>
      </div>
    </div>
    <div class="sb-hero-cards">
      <div class="sb-hero-card fade-up">
        <div class="sb-hero-card-number">$2.4B<span>+</span></div>
        <div class="sb-hero-card-title">Portfolio Revenue</div>
        <p class="sb-hero-card-desc">Aggregate annual revenue across our active advisory portfolio of 18 technology companies.</p>
      </div>
      <div class="sb-hero-card fade-up">
        <div class="sb-hero-card-number">3.1<span>x</span></div>
        <div class="sb-hero-card-title">Median Valuation Growth</div>
        <p class="sb-hero-card-desc">Average valuation multiple increase within the first 24 months of engagement.</p>
      </div>
      <div class="sb-hero-card fade-up">
        <div class="sb-hero-card-number">92<span>%</span></div>
        <div class="sb-hero-card-title">Retention Rate</div>
        <p class="sb-hero-card-desc">Clients who extend beyond the initial engagement. We earn the relationship quarterly.</p>
      </div>
    </div>
    <div class="sb-hero-footer-line fade-up">
      <span class="sb-hero-footer-text">New York &mdash; London &mdash; Singapore</span>
      <span class="sb-hero-footer-badge">Accepting 3 new engagements in Q2</span>
    </div>
  </div>
</div>

<script>
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        var underlines = entry.target.querySelectorAll('.sb-hero-headline-underline');
        for (var j = 0; j < underlines.length; j++) {
          underlines[j].classList.add('visible');
        }
      }
    });
  }, { threshold: 0.1 });
  var elements = document.querySelectorAll('.sb-hero .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`;
