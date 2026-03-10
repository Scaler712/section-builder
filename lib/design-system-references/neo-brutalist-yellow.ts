export const referenceHtml: string = `<style>
.sb-hero {
  padding: var(--sb-section-pad, 80px 20px);
  background: #ffffff;
  font-family: var(--sb-font), sans-serif;
  position: relative;
  overflow: hidden;
}
.sb-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#000000 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.07;
  pointer-events: none;
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.sb-hero-badge {
  display: inline-block;
  background: var(--sb-accent);
  color: var(--sb-heading);
  font-size: 13px;
  font-weight: 800;
  padding: 6px 16px;
  border: 2px solid var(--sb-heading);
  border-radius: 6px;
  box-shadow: 3px 3px 0px 0px #000;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 28px;
}
.sb-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
.sb-hero-content h1 {
  font-size: 52px;
  font-weight: 800;
  color: var(--sb-heading);
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin-bottom: 20px;
}
.sb-hero-content p {
  font-size: 18px;
  color: var(--sb-body);
  line-height: 1.6;
  margin-bottom: 32px;
  font-weight: 400;
  max-width: 480px;
}
.sb-hero-cta {
  display: inline-block;
  padding: 16px 40px;
  background: var(--sb-cta-bg);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  font-family: var(--sb-font), sans-serif;
  text-decoration: none;
  border: 2px solid var(--sb-cta-bg);
  border-radius: var(--sb-btn-radius, 8px);
  box-shadow: 4px 4px 0px 0px #000;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.sb-hero-cta:hover {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px 0px #000;
}
.sb-hero-mockup {
  background: #171e19;
  border: 2px solid #000000;
  border-radius: var(--sb-card-radius, 12px);
  box-shadow: 8px 8px 0px 0px #000;
  overflow: hidden;
}
.sb-hero-mockup-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: #222a24;
  border-bottom: 2px solid #000000;
}
.sb-hero-mockup-bar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid #555;
}
.sb-hero-mockup-body {
  padding: 32px 24px;
  color: #b7c6c2;
  font-size: 14px;
  line-height: 1.8;
  font-weight: 500;
  min-height: 200px;
}
.sb-hero-mockup-body .mock-line {
  height: 10px;
  background: #2a3530;
  border-radius: 4px;
  margin-bottom: 10px;
}
.sb-hero-mockup-body .mock-line.short { width: 60%; }
.sb-hero-mockup-body .mock-line.med { width: 80%; }
.sb-hero-mockup-body .mock-accent {
  height: 10px;
  width: 40%;
  background: var(--sb-accent);
  border-radius: 4px;
  margin-bottom: 10px;
  opacity: 0.6;
}
.sb-hero-stats {
  display: flex;
  gap: 0;
  margin-top: 48px;
  border: 2px solid var(--sb-heading);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 4px 4px 0px 0px #000;
}
.sb-hero-stat {
  flex: 1;
  text-align: center;
  padding: 20px 16px;
  background: #ffffff;
  border-right: 2px solid var(--sb-heading);
}
.sb-hero-stat:last-child { border-right: none; }
.sb-hero-stat strong {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: var(--sb-heading);
  line-height: 1;
}
.sb-hero-stat span {
  font-size: 12px;
  font-weight: 700;
  color: var(--sb-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: 50px 16px; }
  .sb-hero-grid { grid-template-columns: 1fr; gap: 32px; }
  .sb-hero-content h1 { font-size: 36px; }
  .sb-hero-content p { font-size: 16px; }
  .sb-hero-stats { flex-direction: column; }
  .sb-hero-stat { border-right: none; border-bottom: 2px solid #000; }
  .sb-hero-stat:last-child { border-bottom: none; }
}
@media (max-width: 480px) {
  .sb-hero-content h1 { font-size: 28px; }
  .sb-hero-cta { padding: 14px 32px; font-size: 15px; }
  .sb-hero-stat strong { font-size: 22px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-inner">
    <div class="sb-hero-grid">
      <div class="sb-hero-content">
        <span class="sb-hero-badge fade-up">Now in Beta</span>
        <h1 class="fade-up">Ship forms that actually get filled out.</h1>
        <p class="fade-up">Drag-and-drop form builder with built-in analytics, conditional logic, and a 94% completion rate. No code required.</p>
        <a href="#" class="sb-hero-cta fade-up">Start building free</a>
      </div>
      <div class="sb-hero-mockup fade-up">
        <div class="sb-hero-mockup-bar">
          <span></span><span></span><span></span>
        </div>
        <div class="sb-hero-mockup-body">
          <div class="mock-line"></div>
          <div class="mock-line med"></div>
          <div class="mock-accent"></div>
          <div class="mock-line short"></div>
          <div class="mock-line"></div>
          <div class="mock-line med"></div>
          <div class="mock-accent"></div>
        </div>
      </div>
    </div>
    <div class="sb-hero-stats fade-up">
      <div class="sb-hero-stat"><strong>12k+</strong><span>Forms created</span></div>
      <div class="sb-hero-stat"><strong>94%</strong><span>Completion rate</span></div>
      <div class="sb-hero-stat"><strong>3.2M</strong><span>Submissions</span></div>
      <div class="sb-hero-stat"><strong>4.9/5</strong><span>User rating</span></div>
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
