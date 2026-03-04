import { SectionTemplate } from "./types";

export const painPoints: SectionTemplate = {
  id: "pain-points",
  name: "Pain Points",
  description: "Yellow-pill highlighted text list",
  icon: "AlertTriangle",
  aiPromptHints: "Write 4-6 pain points that the target audience deeply relates to. Each pain point should be a short, punchy sentence wrapped in a yellow highlight pill. Lead with a question or empathetic statement before the list.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-pain {
  padding: 80px 20px;
  font-family: 'Raleway', sans-serif;
  background: #FFFFFF;
}
.sb-pain-inner {
  max-width: 750px;
  margin: 0 auto;
}
.sb-pain h2 {
  font-size: 36px;
  font-weight: 800;
  color: #2B2B2B;
  margin-bottom: 12px;
  text-align: center;
}
.sb-pain .lead {
  font-size: 18px;
  color: #3A3A3A;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.6;
  font-weight: 400;
}
.sb-pain-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sb-pain-item {
  background: #FFF2C2;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 600;
  color: #2B2B2B;
  line-height: 1.5;
}
.sb-pain .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.sb-pain .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-pain { padding: 50px 16px; }
  .sb-pain h2 { font-size: 28px; }
  .sb-pain-item { font-size: 15px; padding: 14px 18px; }
}
@media (max-width: 480px) {
  .sb-pain h2 { font-size: 24px; }
  .sb-pain-item { font-size: 14px; }
}
</style>

<div class="sb-pain">
  <div class="sb-pain-inner">
    <h2 class="fade-up">Sound Familiar?</h2>
    <p class="lead fade-up">If any of these hit home, you're in the right place.</p>
    <ul class="sb-pain-list">
      <li class="sb-pain-item fade-up">You're spending $5K+/month on ads that barely break even</li>
      <li class="sb-pain-item fade-up">Your video creatives look the same as everyone else's</li>
      <li class="sb-pain-item fade-up">Freelancers take 3 weeks to deliver a single ad concept</li>
      <li class="sb-pain-item fade-up">You know AI ads are the future but don't have time to figure it out</li>
      <li class="sb-pain-item fade-up">Your CPAs keep climbing and creative fatigue is killing your campaigns</li>
    </ul>
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
  var elements = document.querySelectorAll('.sb-pain .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
