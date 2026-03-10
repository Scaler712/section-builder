import { SectionTemplate } from "./types";

export const solutionTransition: SectionTemplate = {
  id: "solution-transition",
  name: "Solution / Transition",
  description: "Bridge statement connecting pain to solution",
  icon: "ArrowRightLeft",
  aiPromptHints: "Write a transition section that bridges the pain points to the solution. Start with an empathetic acknowledgment, then pivot to 'there's a better way'. Use a bold statement or question as the headline. Keep it brief — 2-3 short paragraphs max.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-transition {
  padding: var(--sb-section-pad);
  font-family: var(--sb-font);
  background: #F5F5F5;
  text-align: center;
}
.sb-transition-inner {
  max-width: 750px;
  margin: 0 auto;
}
.sb-transition h2 {
  font-size: 36px;
  font-weight: 800;
  color: var(--sb-heading);
  margin-bottom: 24px;
  line-height: 1.2;
}
.sb-transition .highlight {
  background: var(--sb-highlight);
  padding: 2px 8px;
  border-radius: 4px;
}
.sb-transition p {
  font-size: 18px;
  color: var(--sb-body);
  line-height: 1.7;
  margin-bottom: 20px;
  font-weight: 400;
}
.sb-transition .divider {
  width: 60px;
  height: 3px;
  background: var(--sb-accent);
  margin: 0 auto 32px;
  border-radius: 2px;
}
.sb-transition .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-transition .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-transition { padding: var(--sb-section-pad); }
  .sb-transition h2 { font-size: 28px; }
  .sb-transition p { font-size: 16px; }
}
@media (max-width: 480px) {
  .sb-transition h2 { font-size: 24px; }
}
</style>

<div class="sb-transition">
  <div class="sb-transition-inner">
    <div class="divider fade-up"></div>
    <h2 class="fade-up">What If Your Ads Could <span class="highlight">Create Themselves?</span></h2>
    <p class="fade-up">You don't need another agency that takes weeks and charges thousands for a single creative concept.</p>
    <p class="fade-up">You need a system that uses AI to produce scroll-stopping video ads at a fraction of the cost — and delivers them in days, not months.</p>
    <p class="fade-up"><strong>That's exactly what we built.</strong></p>
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
  var elements = document.querySelectorAll('.sb-transition .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
