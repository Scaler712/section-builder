import { SectionTemplate } from "./types";

export const cta: SectionTemplate = {
  id: "cta",
  name: "CTA",
  description: "Bold background, headline, button",
  icon: "MousePointerClick",
  aiPromptHints: "Write a bold, dark-background CTA section with an urgent headline, 1-sentence supporting text, and a prominent button. Create FOMO or scarcity if appropriate. Keep it punchy — this is the close.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-cta {
  padding: 80px 20px;
  font-family: 'Raleway', sans-serif;
  background: #2B2B2B;
  text-align: center;
}
.sb-cta-inner {
  max-width: 750px;
  margin: 0 auto;
}
.sb-cta h2 {
  font-size: 36px;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 16px;
  line-height: 1.2;
}
.sb-cta p {
  font-size: 18px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 36px;
  line-height: 1.6;
  font-weight: 400;
}
.sb-cta .cta-btn {
  display: inline-block;
  background: #E8B931;
  color: #2B2B2B;
  padding: 16px 48px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sb-cta .cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(232,185,49,0.35);
}
.sb-cta .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-cta .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-cta { padding: 50px 16px; }
  .sb-cta h2 { font-size: 28px; }
  .sb-cta p { font-size: 16px; }
  .sb-cta .cta-btn { padding: 14px 36px; font-size: 16px; }
}
</style>

<div class="sb-cta">
  <div class="sb-cta-inner">
    <h2 class="fade-up">Ready to 10x Your Ad Creative Output?</h2>
    <p class="fade-up">Join 200+ brands already using AI to dominate their paid channels. Your first ads can be live in 48 hours.</p>
    <a href="#" class="cta-btn fade-up">Start Your Free Trial</a>
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
  var elements = document.querySelectorAll('.sb-cta .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
