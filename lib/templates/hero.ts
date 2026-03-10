import { SectionTemplate } from "./types";

export const hero: SectionTemplate = {
  id: "hero",
  name: "Hero",
  description: "Headline with yellow highlight, subhead, CTA button",
  icon: "Sparkles",
  aiPromptHints: "Write a compelling headline with one key phrase wrapped in a yellow highlight span. Add a supporting subheadline (1-2 sentences) and a strong CTA button. The headline should create urgency or promise a transformation.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-hero {
  padding: var(--sb-section-pad);
  text-align: center;
  font-family: var(--sb-font);
  background: #FFFFFF;
}
.sb-hero-inner {
  max-width: 800px;
  margin: 0 auto;
}
.sb-hero h1 {
  font-size: 48px;
  font-weight: 800;
  color: var(--sb-heading);
  line-height: 1.15;
  margin-bottom: 24px;
}
.sb-hero .highlight {
  background: var(--sb-highlight);
  padding: 2px 8px;
  border-radius: 4px;
}
.sb-hero p {
  font-size: 20px;
  color: var(--sb-body);
  line-height: 1.6;
  margin-bottom: 40px;
  font-weight: 400;
}
.sb-hero .cta-btn {
  display: inline-block;
  background: var(--sb-cta-bg);
  color: #FFFFFF;
  padding: 16px 48px;
  border-radius: var(--sb-btn-radius);
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.sb-hero .cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: var(--sb-section-pad); }
  .sb-hero h1 { font-size: 32px; }
  .sb-hero p { font-size: 17px; }
}
@media (max-width: 480px) {
  .sb-hero h1 { font-size: 26px; }
  .sb-hero p { font-size: 16px; }
  .sb-hero .cta-btn { padding: 14px 36px; font-size: 16px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-inner">
    <h1 class="fade-up">Stop Wasting Money on Ads That <span class="highlight">Don't Convert</span></h1>
    <p class="fade-up">We create AI-powered video ads that turn scrollers into buyers — in 48 hours, not 4 weeks.</p>
    <a href="#" class="cta-btn fade-up">Get Your Free Ad Audit</a>
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
</script>`,
};
