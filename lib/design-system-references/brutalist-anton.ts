export const referenceHtml: string = `<style>
.sb-hero {
  padding: var(--sb-section-pad, 100px 20px 80px);
  background: #ffffff;
  font-family: var(--sb-font), sans-serif;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.sb-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.sb-hero-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sb-heading);
  margin-bottom: 32px;
  padding: 8px 20px;
  border: 2px solid var(--sb-heading);
  border-radius: 6px;
}
.sb-hero h1 {
  font-size: 72px;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--sb-heading);
  line-height: 0.9;
  letter-spacing: -0.03em;
  margin-bottom: 32px;
  position: relative;
  display: inline-block;
}
.sb-hero h1 .highlight-word {
  position: relative;
  display: inline-block;
}
.sb-hero h1 .highlight-word::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 5%;
  width: calc(100% + 12px);
  height: 90%;
  background: var(--sb-accent);
  transform: rotate(-2deg);
  z-index: -1;
  border-radius: 4px;
}
.sb-hero-sub {
  font-size: 19px;
  font-weight: 400;
  color: var(--sb-body);
  line-height: 1.6;
  max-width: 580px;
  margin: 0 auto 44px;
}
.sb-hero-cta {
  display: inline-block;
  padding: 18px 48px;
  background: var(--sb-cta-bg);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  font-family: var(--sb-font), sans-serif;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: var(--sb-btn-radius, 8px);
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.sb-hero-cta:hover {
  background: var(--sb-accent);
  color: var(--sb-heading);
}
.sb-hero-contrast {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  margin-top: 72px;
  border-radius: var(--sb-card-radius, 8px);
  overflow: hidden;
}
.sb-hero-problem {
  background: var(--sb-cta-bg);
  padding: 48px 40px;
  text-align: left;
}
.sb-hero-problem h3 {
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--sb-accent);
  margin-bottom: 16px;
}
.sb-hero-problem p {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  font-weight: 400;
}
.sb-hero-solution {
  background: var(--sb-accent);
  padding: 48px 40px;
  text-align: left;
}
.sb-hero-solution h3 {
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--sb-heading);
  margin-bottom: 16px;
}
.sb-hero-solution p {
  font-size: 16px;
  color: var(--sb-body);
  line-height: 1.7;
  font-weight: 500;
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: 60px 16px; }
  .sb-hero h1 { font-size: 44px; }
  .sb-hero-sub { font-size: 17px; }
  .sb-hero-contrast { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .sb-hero h1 { font-size: 32px; }
  .sb-hero-sub { font-size: 16px; }
  .sb-hero-cta { padding: 16px 36px; font-size: 14px; }
  .sb-hero-problem, .sb-hero-solution { padding: 32px 24px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-inner">
    <span class="sb-hero-label fade-up">Performance Marketing</span>
    <h1 class="fade-up">Your ads are<br/><span class="highlight-word">burning</span> money</h1>
    <p class="sb-hero-sub fade-up">Most brands spend 40% of their ad budget on creatives that never convert. We fix that with AI-generated video ads tested against 2,300+ winning patterns.</p>
    <a href="#" class="sb-hero-cta fade-up">See the proof</a>
    <div class="sb-hero-contrast fade-up">
      <div class="sb-hero-problem">
        <h3>The old way</h3>
        <p>Hire an agency. Wait 3 weeks. Get 2 concepts. Spend $5k to learn neither works. Repeat until budget runs out or patience does.</p>
      </div>
      <div class="sb-hero-solution">
        <h3>With us</h3>
        <p>AI generates 30 ad variants in 48 hours. We test the top 8 against real audiences. You scale the winners. Average ROAS: 4.2x.</p>
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
