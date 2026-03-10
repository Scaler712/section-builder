import { SectionTemplate } from "./types";

export const testimonials: SectionTemplate = {
  id: "testimonials",
  name: "Testimonials",
  description: "Quote cards with name/role",
  icon: "Quote",
  aiPromptHints: "Create 3 testimonial cards with realistic quotes, full names, and job titles/companies. Quotes should mention specific results (numbers, timeframes) and sound natural — not overly polished. Vary the length slightly between cards.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-testimonials {
  padding: var(--sb-section-pad);
  font-family: var(--sb-font);
  background: #FFFFFF;
}
.sb-testimonials-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.sb-testimonials h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  color: var(--sb-heading);
  margin-bottom: 48px;
}
.sb-testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.sb-testimonial-card {
  background: #FAFAFA;
  border-radius: var(--sb-card-radius);
  padding: 32px 28px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  position: relative;
}
.sb-testimonial-card .quote-mark {
  font-size: 48px;
  color: var(--sb-accent);
  line-height: 1;
  margin-bottom: 12px;
}
.sb-testimonial-card .quote-text {
  font-size: 16px;
  color: var(--sb-body);
  line-height: 1.7;
  margin-bottom: 20px;
  font-style: italic;
  font-weight: 400;
}
.sb-testimonial-card .author {
  font-size: 15px;
  font-weight: 700;
  color: var(--sb-heading);
}
.sb-testimonial-card .role {
  font-size: 13px;
  color: var(--sb-muted);
  font-weight: 400;
}
.sb-testimonials .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-testimonials .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-testimonials { padding: var(--sb-section-pad); }
  .sb-testimonials h2 { font-size: 28px; }
  .sb-testimonials-grid { grid-template-columns: 1fr; gap: 16px; }
}
@media (max-width: 480px) {
  .sb-testimonials h2 { font-size: 24px; }
}
</style>

<div class="sb-testimonials">
  <div class="sb-testimonials-inner">
    <h2 class="fade-up">What Our Clients Say</h2>
    <div class="sb-testimonials-grid">
      <div class="sb-testimonial-card fade-up">
        <div class="quote-mark">"</div>
        <p class="quote-text">We went from spending $12K/month with a traditional agency to getting better results at a third of the cost. Our ROAS jumped from 1.8x to 4.2x in the first month.</p>
        <div class="author">Sarah Mitchell</div>
        <div class="role">CEO, GlowUp Skincare</div>
      </div>
      <div class="sb-testimonial-card fade-up">
        <div class="quote-mark">"</div>
        <p class="quote-text">48-hour turnaround is not an exaggeration. We test 3x more creatives now and our winning ad rate has doubled.</p>
        <div class="author">Marcus Chen</div>
        <div class="role">Head of Growth, FitStack</div>
      </div>
      <div class="sb-testimonial-card fade-up">
        <div class="quote-mark">"</div>
        <p class="quote-text">I was skeptical about AI ads. Then they produced a video that outperformed every human-made creative we'd ever run. We've been a client for 6 months now.</p>
        <div class="author">Elena Rodriguez</div>
        <div class="role">Marketing Director, NovaPay</div>
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
  var elements = document.querySelectorAll('.sb-testimonials .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
