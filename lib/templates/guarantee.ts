import { SectionTemplate } from "./types";

export const guarantee: SectionTemplate = {
  id: "guarantee",
  name: "Guarantee",
  description: "Shield icon + guarantee text",
  icon: "ShieldCheck",
  aiPromptHints: "Write a guarantee section with a shield/badge icon, bold guarantee headline (e.g. '30-Day Money-Back Guarantee'), and 2-3 sentences explaining the guarantee terms. Make it feel risk-free and confident. Include what happens if they're not satisfied.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-guarantee {
  padding: 80px 20px;
  font-family: 'Raleway', sans-serif;
  background: #FAFAFA;
  text-align: center;
}
.sb-guarantee-inner {
  max-width: 650px;
  margin: 0 auto;
}
.sb-guarantee .shield {
  font-size: 64px;
  margin-bottom: 20px;
}
.sb-guarantee h2 {
  font-size: 32px;
  font-weight: 800;
  color: #2B2B2B;
  margin-bottom: 16px;
}
.sb-guarantee p {
  font-size: 17px;
  color: #3A3A3A;
  line-height: 1.7;
  margin-bottom: 12px;
  font-weight: 400;
}
.sb-guarantee .highlight {
  background: #FFF2C2;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.sb-guarantee .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-guarantee .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-guarantee { padding: 50px 16px; }
  .sb-guarantee h2 { font-size: 26px; }
  .sb-guarantee .shield { font-size: 48px; }
  .sb-guarantee p { font-size: 15px; }
}
</style>

<div class="sb-guarantee">
  <div class="sb-guarantee-inner">
    <div class="shield fade-up">🛡️</div>
    <h2 class="fade-up">30-Day Money-Back Guarantee</h2>
    <p class="fade-up">We're so confident you'll love the results that we offer a <span class="highlight">full refund within 30 days</span> if you're not completely satisfied.</p>
    <p class="fade-up">No questions asked. No hoops to jump through. If our AI ads don't outperform your current creatives, you don't pay. Simple as that.</p>
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
  var elements = document.querySelectorAll('.sb-guarantee .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
