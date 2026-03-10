import { SectionTemplate } from "./types";

export const pricing: SectionTemplate = {
  id: "pricing",
  name: "Pricing",
  description: "1-3 tier cards with feature lists",
  icon: "CreditCard",
  aiPromptHints: "Create 2-3 pricing tiers with clear names, prices, feature lists (5-7 items each with checkmarks), and CTA buttons. Highlight the recommended tier. Use crossed-out original prices if applicable. Make the middle tier the 'best value'.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-pricing {
  padding: var(--sb-section-pad);
  font-family: var(--sb-font);
  background: #FAFAFA;
}
.sb-pricing-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.sb-pricing h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  color: var(--sb-heading);
  margin-bottom: 12px;
}
.sb-pricing .subtitle {
  text-align: center;
  font-size: 18px;
  color: var(--sb-muted);
  margin-bottom: 48px;
  font-weight: 400;
}
.sb-pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}
.sb-pricing-card {
  background: #FFFFFF;
  border-radius: var(--sb-card-radius);
  padding: 36px 28px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  text-align: center;
  transition: transform 0.3s ease;
}
.sb-pricing-card.featured {
  border: 2px solid var(--sb-accent);
  transform: scale(1.04);
  position: relative;
}
.sb-pricing-card.featured .badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--sb-accent);
  color: var(--sb-heading);
  padding: 4px 16px;
  border-radius: var(--sb-btn-radius);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
.sb-pricing-card .tier-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--sb-heading);
  margin-bottom: 8px;
}
.sb-pricing-card .price {
  font-size: 42px;
  font-weight: 800;
  color: var(--sb-heading);
  margin-bottom: 4px;
}
.sb-pricing-card .price-period {
  font-size: 14px;
  color: var(--sb-muted);
  margin-bottom: 28px;
  font-weight: 400;
}
.sb-pricing-card .features {
  list-style: none;
  text-align: left;
  margin-bottom: 28px;
}
.sb-pricing-card .features li {
  padding: 8px 0;
  font-size: 15px;
  color: var(--sb-body);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  font-weight: 400;
}
.sb-pricing-card .features li:last-child {
  border-bottom: none;
}
.sb-pricing-card .features li::before {
  content: "\\2713";
  color: var(--sb-accent);
  font-weight: 700;
  margin-right: 10px;
}
.sb-pricing-card .price-btn {
  display: inline-block;
  width: 100%;
  padding: 14px 0;
  border-radius: var(--sb-btn-radius);
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: var(--sb-cta-bg);
  color: #FFFFFF;
}
.sb-pricing-card .price-btn:hover {
  transform: translateY(-2px);
}
.sb-pricing .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-pricing .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-pricing { padding: var(--sb-section-pad); }
  .sb-pricing h2 { font-size: 28px; }
  .sb-pricing-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; }
  .sb-pricing-card.featured { transform: scale(1); }
}
</style>

<div class="sb-pricing">
  <div class="sb-pricing-inner">
    <h2 class="fade-up">Simple, Transparent Pricing</h2>
    <p class="subtitle fade-up">No hidden fees. No long-term contracts. Cancel anytime.</p>
    <div class="sb-pricing-grid">
      <div class="sb-pricing-card fade-up">
        <div class="tier-name">Starter</div>
        <div class="price">$997</div>
        <div class="price-period">per month</div>
        <ul class="features">
          <li>4 AI video ads / month</li>
          <li>48-hour delivery</li>
          <li>1 product / brand</li>
          <li>Basic performance reports</li>
          <li>Email support</li>
        </ul>
        <a href="#" class="price-btn">Get Started</a>
      </div>
      <div class="sb-pricing-card featured fade-up">
        <div class="badge">Most Popular</div>
        <div class="tier-name">Growth</div>
        <div class="price">$2,497</div>
        <div class="price-period">per month</div>
        <ul class="features">
          <li>12 AI video ads / month</li>
          <li>48-hour delivery</li>
          <li>Up to 3 products / brands</li>
          <li>Advanced analytics dashboard</li>
          <li>Dedicated account manager</li>
          <li>A/B testing recommendations</li>
        </ul>
        <a href="#" class="price-btn">Get Started</a>
      </div>
      <div class="sb-pricing-card fade-up">
        <div class="tier-name">Scale</div>
        <div class="price">$4,997</div>
        <div class="price-period">per month</div>
        <ul class="features">
          <li>Unlimited AI video ads</li>
          <li>24-hour priority delivery</li>
          <li>Unlimited products / brands</li>
          <li>Full analytics suite + ROI tracking</li>
          <li>Weekly strategy calls</li>
          <li>Custom AI model training</li>
          <li>White-label option</li>
        </ul>
        <a href="#" class="price-btn">Get Started</a>
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
  var elements = document.querySelectorAll('.sb-pricing .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
