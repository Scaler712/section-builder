export const referenceHtml: string = `<style>
.sb-hero {
  padding: 0;
  background: var(--sb-highlight);
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-heading);
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* Ambient blur circles */
.sb-hero-blur-1 {
  position: absolute;
  top: -80px;
  right: -120px;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: #EF4623;
  opacity: 0.10;
  filter: blur(110px);
  pointer-events: none;
  z-index: 0;
}
.sb-hero-blur-2 {
  position: absolute;
  bottom: -60px;
  left: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: #EF4623;
  opacity: 0.08;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}
.sb-hero-blur-3 {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: #EF4623;
  opacity: 0.06;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}

/* Glassmorphism nav hint */
.sb-hero-nav {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 14px 32px;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50px;
}
.sb-hero-nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--sb-heading);
  text-decoration: none;
}
.sb-hero-nav-mark {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--sb-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 700;
  font-size: 18px;
  transform: rotate(3deg);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-nav-mark:hover {
  transform: rotate(12deg);
}
.sb-hero-nav-links {
  display: flex;
  gap: 24px;
}
.sb-hero-nav-links a {
  font-size: 13px;
  font-weight: 500;
  color: var(--sb-heading);
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color 0.3s ease;
}
.sb-hero-nav-links a:hover {
  color: var(--sb-accent);
}

/* Inner content */
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: var(--sb-section-pad, 180px 20px 120px);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 60px;
  align-items: center;
}
.sb-hero-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--sb-accent);
  margin-bottom: 28px;
  position: relative;
  padding-left: 20px;
}
.sb-hero-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--sb-accent);
}
.sb-hero-headline {
  font-family: 'Playfair Display', serif;
  font-weight: 400;
  font-size: 8.5rem;
  line-height: 0.95;
  color: var(--sb-heading);
  margin: 0 0 32px;
  letter-spacing: -0.03em;
}
.sb-hero-headline em {
  font-style: italic;
  color: var(--sb-accent);
}
.sb-hero-sub {
  font-size: 17px;
  font-weight: 300;
  color: #5a6b73;
  line-height: 1.75;
  max-width: 440px;
  margin: 0 0 48px;
}
.sb-hero-cta-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
}
.sb-hero-cta {
  display: inline-block;
  padding: 18px 48px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--sb-font), sans-serif;
  letter-spacing: 0.04em;
  color: #ffffff;
  background: var(--sb-cta-bg);
  border: none;
  border-radius: var(--sb-btn-radius, 30px);
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(239, 70, 35, 0.2);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-cta:hover {
  box-shadow: 0 16px 48px rgba(239, 70, 35, 0.35);
  transform: translateY(-2px);
}
.sb-hero-cta-ghost {
  display: inline-block;
  padding: 18px 32px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-heading);
  text-decoration: none;
  border-bottom: 1px solid var(--sb-heading);
  transition: color 0.3s ease, border-color 0.3s ease;
}
.sb-hero-cta-ghost:hover {
  color: var(--sb-accent);
  border-color: var(--sb-accent);
}

/* Right side — dot grid card */
.sb-hero-visual {
  position: relative;
}
.sb-hero-dot-grid {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 200px;
  height: 200px;
  background-image: radial-gradient(#EF4623 1.5px, transparent 1.5px);
  background-size: 16px 16px;
  opacity: 0.18;
  pointer-events: none;
  z-index: 0;
}
.sb-hero-card {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border-radius: var(--sb-card-radius, 24px);
  padding: 48px 36px;
  box-shadow: 0 24px 64px rgba(45, 59, 66, 0.08);
}
.sb-hero-card-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sb-accent);
  margin-bottom: 20px;
}
.sb-hero-card-title {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 28px;
  font-weight: 400;
  color: var(--sb-heading);
  margin: 0 0 16px;
  line-height: 1.25;
}
.sb-hero-card-desc {
  font-size: 14px;
  font-weight: 400;
  color: #5a6b73;
  line-height: 1.7;
  margin-bottom: 28px;
}
.sb-hero-card-row {
  display: flex;
  gap: 24px;
}
.sb-hero-card-stat {
  text-align: center;
}
.sb-hero-card-stat-num {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--sb-accent);
  line-height: 1;
}
.sb-hero-card-stat-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--sb-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 6px;
}
.sb-hero-divider {
  width: 48px;
  height: 2px;
  background: var(--sb-accent);
  opacity: 0.4;
  margin: 28px 0;
}

/* Fade-up with rotation */
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(30px) rotate(2deg);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}

@media (max-width: 768px) {
  .sb-hero-inner {
    grid-template-columns: 1fr;
    padding: 140px 20px 80px;
    gap: 40px;
  }
  .sb-hero-headline { font-size: 4.5rem; }
  .sb-hero-nav-links { display: none; }
  .sb-hero-dot-grid { width: 140px; height: 140px; }
  .sb-hero-cta-wrap { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .sb-hero-inner { padding: 120px 16px 60px; }
  .sb-hero-headline { font-size: 3rem; }
  .sb-hero-sub { font-size: 15px; }
  .sb-hero-cta { padding: 16px 36px; font-size: 13px; }
  .sb-hero-card { padding: 32px 24px; }
  .sb-hero-card-title { font-size: 22px; }
  .sb-hero-card-row { flex-direction: column; gap: 16px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-blur-1"></div>
  <div class="sb-hero-blur-2"></div>
  <div class="sb-hero-blur-3"></div>

  <nav class="sb-hero-nav">
    <a href="#" class="sb-hero-nav-logo">
      <span class="sb-hero-nav-mark">R</span>
      Redstone
    </a>
    <div class="sb-hero-nav-links">
      <a href="#">Work</a>
      <a href="#">Journal</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </div>
  </nav>

  <div class="sb-hero-inner">
    <div class="sb-hero-content">
      <span class="sb-hero-label fade-up">Editorial Design Studio</span>
      <h1 class="sb-hero-headline fade-up">Stories told <em>beautifully.</em></h1>
      <p class="sb-hero-sub fade-up">We design editorial experiences for publishers, cultural institutions, and brands who believe in the power of typography and narrative craft.</p>
      <div class="sb-hero-cta-wrap fade-up">
        <a href="#" class="sb-hero-cta">Start a Conversation</a>
        <a href="#" class="sb-hero-cta-ghost">View Selected Work</a>
      </div>
    </div>

    <div class="sb-hero-visual fade-up">
      <div class="sb-hero-dot-grid"></div>
      <div class="sb-hero-card">
        <div class="sb-hero-card-eyebrow">Featured Project</div>
        <h3 class="sb-hero-card-title">The Meridian Review &mdash; Annual Report</h3>
        <p class="sb-hero-card-desc">A 240-page editorial redesign for one of Europe's most respected literary journals. Type-driven, image-led, printed on Munken Pure.</p>
        <div class="sb-hero-divider"></div>
        <div class="sb-hero-card-row">
          <div class="sb-hero-card-stat">
            <div class="sb-hero-card-stat-num">240</div>
            <div class="sb-hero-card-stat-label">Pages</div>
          </div>
          <div class="sb-hero-card-stat">
            <div class="sb-hero-card-stat-num">12</div>
            <div class="sb-hero-card-stat-label">Typefaces</div>
          </div>
          <div class="sb-hero-card-stat">
            <div class="sb-hero-card-stat-num">3</div>
            <div class="sb-hero-card-stat-label">Awards</div>
          </div>
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
  var elements = document.querySelectorAll('.sb-hero .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`;
