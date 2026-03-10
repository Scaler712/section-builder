import { SectionTemplate } from "./types";

export const benefitsGrid: SectionTemplate = {
  id: "benefits-grid",
  name: "Benefits Grid",
  description: "4-card icon grid with scroll animations",
  icon: "LayoutGrid",
  aiPromptHints: "Create exactly 4 benefit cards with emoji icons, bold titles, and 1-2 sentence descriptions. Focus on outcomes, not features. Each card should answer 'what's in it for me?'",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-benefits {
  padding: var(--sb-section-pad);
  font-family: var(--sb-font);
  background: #FAFAFA;
}
.sb-benefits-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.sb-benefits h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  color: var(--sb-heading);
  margin-bottom: 16px;
}
.sb-benefits .subtitle {
  text-align: center;
  font-size: 18px;
  color: var(--sb-muted);
  margin-bottom: 48px;
  font-weight: 400;
}
.sb-benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.sb-benefits-card {
  background: #FFFFFF;
  border-radius: var(--sb-card-radius);
  padding: 36px 28px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.sb-benefits-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
}
.sb-benefits-card .icon {
  font-size: 36px;
  margin-bottom: 16px;
}
.sb-benefits-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--sb-heading);
  margin-bottom: 10px;
}
.sb-benefits-card p {
  font-size: 16px;
  color: var(--sb-body);
  line-height: 1.6;
  font-weight: 400;
}
.sb-benefits .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-benefits .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-benefits { padding: var(--sb-section-pad); }
  .sb-benefits h2 { font-size: 28px; }
  .sb-benefits-grid { grid-template-columns: 1fr; gap: 16px; }
}
@media (max-width: 480px) {
  .sb-benefits h2 { font-size: 24px; }
  .sb-benefits-card { padding: 28px 20px; }
}
</style>

<div class="sb-benefits">
  <div class="sb-benefits-inner">
    <h2 class="fade-up">What You Get</h2>
    <p class="subtitle fade-up">Everything you need to scale your ads profitably</p>
    <div class="sb-benefits-grid">
      <div class="sb-benefits-card fade-up">
        <div class="icon">🎬</div>
        <h3>AI Video Ads in 48h</h3>
        <p>Production-quality video ads created with cutting-edge AI — delivered in 2 days, not 4 weeks.</p>
      </div>
      <div class="sb-benefits-card fade-up">
        <div class="icon">📊</div>
        <h3>Data-Driven Creative</h3>
        <p>Every ad is built on winning hooks, proven frameworks, and competitor analysis — not guesswork.</p>
      </div>
      <div class="sb-benefits-card fade-up">
        <div class="icon">🔄</div>
        <h3>Unlimited Revisions</h3>
        <p>We iterate until you're thrilled. No revision caps, no extra charges, no headaches.</p>
      </div>
      <div class="sb-benefits-card fade-up">
        <div class="icon">📈</div>
        <h3>Performance Tracking</h3>
        <p>Monthly reports showing exactly how your AI ads perform — ROAS, CTR, and cost per acquisition.</p>
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
  var elements = document.querySelectorAll('.sb-benefits .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
