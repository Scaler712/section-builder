import { SectionTemplate } from "./types";

export const aboutBio: SectionTemplate = {
  id: "about-bio",
  name: "About / Bio",
  description: "Image + bio text",
  icon: "User",
  aiPromptHints: "Create an about/bio section with space for a photo on one side and bio text on the other. Include name, role/title, a personal story (2-3 paragraphs), credentials or achievements, and a personal touch. Two-column layout on desktop, stacked on mobile.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-about {
  padding: 80px 20px;
  font-family: 'Raleway', sans-serif;
  background: #FFFFFF;
}
.sb-about-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
  align-items: start;
}
.sb-about-img {
  width: 280px;
  height: 340px;
  background: #F0F0F0;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
.sb-about-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sb-about-text h2 {
  font-size: 32px;
  font-weight: 800;
  color: #2B2B2B;
  margin-bottom: 4px;
}
.sb-about-text .role {
  font-size: 16px;
  color: #E8B931;
  font-weight: 600;
  margin-bottom: 24px;
}
.sb-about-text p {
  font-size: 16px;
  color: #3A3A3A;
  line-height: 1.7;
  margin-bottom: 16px;
  font-weight: 400;
}
.sb-about-text .stats {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}
.sb-about-text .stat {
  text-align: center;
}
.sb-about-text .stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #2B2B2B;
}
.sb-about-text .stat-label {
  font-size: 13px;
  color: #6B6B6B;
  font-weight: 400;
}
.sb-about .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-about .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-about { padding: 50px 16px; }
  .sb-about-inner { grid-template-columns: 1fr; gap: 28px; justify-items: center; }
  .sb-about-img { width: 200px; height: 240px; }
  .sb-about-text { text-align: center; }
  .sb-about-text .stats { justify-content: center; }
}
</style>

<div class="sb-about">
  <div class="sb-about-inner">
    <div class="sb-about-img fade-up">[Your Photo]</div>
    <div class="sb-about-text">
      <h2 class="fade-up">Hi, I'm Alex</h2>
      <div class="role fade-up">Founder & Creative Director</div>
      <p class="fade-up">Three years ago, I was spending $15K/month on traditional video agencies and getting mediocre results. The turnaround was slow, the creative was generic, and my ROAS was stuck at 1.5x.</p>
      <p class="fade-up">Then I discovered AI-powered video generation and everything changed. I built a system that creates production-quality ads in hours, not weeks — and the results blew past anything I'd ever achieved with human-only teams.</p>
      <p class="fade-up">Now I help brands like yours access the same AI-first creative system. No bloated retainers. No 3-week timelines. Just high-converting video ads, delivered fast.</p>
      <div class="stats fade-up">
        <div class="stat">
          <div class="stat-number">200+</div>
          <div class="stat-label">Clients served</div>
        </div>
        <div class="stat">
          <div class="stat-number">4.2x</div>
          <div class="stat-label">Avg. ROAS</div>
        </div>
        <div class="stat">
          <div class="stat-number">$12M+</div>
          <div class="stat-label">Ad spend managed</div>
        </div>
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
  var elements = document.querySelectorAll('.sb-about .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
