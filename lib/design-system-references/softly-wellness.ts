export const referenceHtml: string = `<style>
.sb-hero {
  padding: var(--sb-section-pad, 100px 20px 80px);
  background: #FDFCF8;
  font-family: var(--sb-font), sans-serif;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.sb-hero-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.35;
}
.sb-hero-blob-1 {
  position: absolute;
  width: 340px;
  height: 340px;
  background: rgba(255,183,178,0.10);
  border-radius: 50%;
  filter: blur(60px);
  top: -60px;
  right: 10%;
  animation: sb-float 6s ease-in-out infinite;
}
.sb-hero-blob-2 {
  position: absolute;
  width: 280px;
  height: 280px;
  background: rgba(232,239,232,0.12);
  border-radius: 50%;
  filter: blur(60px);
  bottom: -40px;
  left: 5%;
  animation: sb-float 6s ease-in-out infinite 2s;
}
.sb-hero-blob-3 {
  position: absolute;
  width: 220px;
  height: 220px;
  background: rgba(239,237,244,0.12);
  border-radius: 50%;
  filter: blur(60px);
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  animation: sb-float 6s ease-in-out infinite 4s;
}
@keyframes sb-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.sb-hero-pill {
  display: inline-block;
  padding: 8px 20px;
  background: #E8EFE8;
  color: var(--sb-body);
  font-size: 13px;
  font-weight: 500;
  border-radius: 2rem;
  margin-bottom: 32px;
  letter-spacing: 0.01em;
}
.sb-hero h1 {
  font-size: 52px;
  font-weight: 600;
  color: var(--sb-heading);
  line-height: 1.12;
  letter-spacing: -0.025em;
  margin-bottom: 20px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}
.sb-hero h1 .soft-accent {
  color: #d4736e;
}
.sb-hero-sub {
  font-size: 18px;
  font-weight: 400;
  color: var(--sb-muted);
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto 40px;
}
.sb-hero-cta {
  display: inline-block;
  padding: 16px 48px;
  background: var(--sb-cta-bg);
  color: #FDFCF8;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--sb-font), sans-serif;
  text-decoration: none;
  border-radius: var(--sb-btn-radius, 50px);
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 4px 20px -2px rgba(0,0,0,0.08);
}
.sb-hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px -4px rgba(0,0,0,0.12);
}
.sb-hero-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 64px;
  text-align: left;
}
.sb-hero-card {
  background: #ffffff;
  border-radius: var(--sb-card-radius, 24px);
  padding: 32px 28px;
  box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
  transition: all 0.4s ease;
}
.sb-hero-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px -4px rgba(0,0,0,0.08);
}
.sb-hero-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 18px;
}
.sb-hero-card:nth-child(1) .sb-hero-card-icon { background: rgba(255,183,178,0.2); }
.sb-hero-card:nth-child(2) .sb-hero-card-icon { background: rgba(232,239,232,0.4); }
.sb-hero-card:nth-child(3) .sb-hero-card-icon { background: rgba(239,237,244,0.4); }
.sb-hero-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--sb-heading);
  margin-bottom: 8px;
}
.sb-hero-card p {
  font-size: 14px;
  color: var(--sb-muted);
  line-height: 1.6;
  font-weight: 400;
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: 60px 16px; }
  .sb-hero h1 { font-size: 36px; }
  .sb-hero-sub { font-size: 16px; }
  .sb-hero-cards { grid-template-columns: 1fr; gap: 16px; }
}
@media (max-width: 480px) {
  .sb-hero h1 { font-size: 28px; }
  .sb-hero-sub { font-size: 15px; }
  .sb-hero-cta { padding: 14px 36px; font-size: 15px; }
  .sb-hero-card { padding: 24px 22px; }
}
</style>

<div class="sb-hero">
  <svg class="sb-hero-noise" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><filter id="sbGrain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#sbGrain)"/></svg>
  <div class="sb-hero-blob-1"></div>
  <div class="sb-hero-blob-2"></div>
  <div class="sb-hero-blob-3"></div>
  <div class="sb-hero-inner">
    <span class="sb-hero-pill fade-up">Gentle by design</span>
    <h1 class="fade-up">Your daily check-in,<br/><span class="soft-accent">not another to-do list</span></h1>
    <p class="sb-hero-sub fade-up">A quiet space to track how you feel, notice what helps, and build habits that actually stick. Three minutes a day is enough.</p>
    <a href="#" class="sb-hero-cta fade-up">Try it free for 14 days</a>
    <div class="sb-hero-cards">
      <div class="sb-hero-card fade-up">
        <div class="sb-hero-card-icon">~</div>
        <h3>Mood journaling</h3>
        <p>Log how you feel with a simple tap. See patterns over time without overthinking it.</p>
      </div>
      <div class="sb-hero-card fade-up">
        <div class="sb-hero-card-icon">+</div>
        <h3>Gentle reminders</h3>
        <p>Soft nudges at the times you choose. No streaks, no guilt, no pressure.</p>
      </div>
      <div class="sb-hero-card fade-up">
        <div class="sb-hero-card-icon">&bull;</div>
        <h3>Weekly reflections</h3>
        <p>A quiet summary of your week. What drained you, what restored you, what shifted.</p>
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
