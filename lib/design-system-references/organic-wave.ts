export const referenceHtml: string = `<style>
@keyframes sb-mesh-drift {
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.98); }
  75% { transform: translate(30px, 10px) scale(1.03); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes sb-btn-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(67, 56, 202, 0); }
  50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(67, 56, 202, 0.25); }
}

.sb-hero {
  padding: 0;
  background: #fcfbf9;
  font-family: 'Inter', sans-serif;
  color: var(--sb-heading);
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* Background mesh blobs */
.sb-hero-mesh-1 {
  position: absolute;
  top: -100px;
  right: -80px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(67, 56, 202, 0.08) 0%, transparent 70%);
  animation: sb-mesh-drift 30s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}
.sb-hero-mesh-2 {
  position: absolute;
  bottom: 60px;
  left: -150px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(67, 56, 202, 0.05) 0%, transparent 70%);
  animation: sb-mesh-drift 30s ease-in-out infinite reverse;
  pointer-events: none;
  z-index: 0;
}

/* Header with mix-blend-difference */
.sb-hero-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 48px;
  mix-blend-mode: difference;
}
.sb-hero-header-logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #ffffff;
  text-decoration: none;
}
.sb-hero-header-nav {
  display: flex;
  gap: 28px;
}
.sb-hero-header-nav a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.3s ease;
}
.sb-hero-header-nav a:hover {
  opacity: 0.6;
}

/* Inner */
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: var(--sb-section-pad, 200px 20px 0);
  text-align: center;
}
.sb-hero-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--sb-accent);
  margin-bottom: 40px;
  display: inline-block;
}
.sb-hero-headline {
  font-family: var(--sb-font), serif;
  font-weight: 900;
  font-size: 12vw;
  line-height: 0.9;
  color: var(--sb-heading);
  margin: 0 0 48px;
  letter-spacing: -0.03em;
}
.sb-hero-headline em {
  font-style: italic;
  color: var(--sb-accent);
}
.sb-hero-sub {
  font-size: 18px;
  font-weight: 300;
  color: var(--sb-muted);
  line-height: 1.75;
  max-width: 540px;
  margin: 0 auto 56px;
  letter-spacing: 0.01em;
}

/* Pulsing CTA button */
.sb-hero-cta {
  display: inline-block;
  padding: 20px 56px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
  background: var(--sb-accent);
  border: none;
  border-radius: var(--sb-btn-radius, 50px);
  text-decoration: none;
  cursor: pointer;
  animation: sb-btn-pulse 3s ease-in-out infinite;
  transition: background 0.3s ease;
}
.sb-hero-cta:hover {
  background: #3730a3;
  animation: none;
  box-shadow: 0 0 24px rgba(67, 56, 202, 0.3);
}

/* Stats row */
.sb-hero-stats {
  display: flex;
  justify-content: center;
  gap: 64px;
  margin-top: 80px;
  padding-bottom: 100px;
}
.sb-hero-stat {
  text-align: center;
}
.sb-hero-stat-num {
  font-family: var(--sb-font), serif;
  font-weight: 700;
  font-style: italic;
  font-size: 42px;
  color: var(--sb-heading);
  line-height: 1;
}
.sb-hero-stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #999;
  margin-top: 10px;
}
.sb-hero-stat-border {
  width: 1px;
  background: #e0ddd8;
  align-self: stretch;
}

/* Wave container at bottom */
.sb-hero-wave-section {
  position: relative;
  background: var(--sb-cta-bg);
  padding: 80px 20px 60px;
  margin-top: -1px;
  border-radius: 5rem 5rem 0 0;
}
.sb-hero-wave-section-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sb-hero-wave-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  max-width: 440px;
}
.sb-hero-wave-text strong {
  color: #ffffff;
  font-weight: 600;
}
.sb-hero-wave-cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sb-accent);
  text-decoration: none;
  border: 1px solid rgba(67, 56, 202, 0.4);
  padding: 14px 32px;
  border-radius: var(--sb-btn-radius, 50px);
  transition: all 0.3s ease;
}
.sb-hero-wave-cta:hover {
  background: var(--sb-accent);
  color: #ffffff;
  border-color: var(--sb-accent);
}

/* Fade-up */
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero-inner { padding: 160px 20px 0; }
  .sb-hero-headline { font-size: 14vw; }
  .sb-hero-header { padding: 20px 24px; }
  .sb-hero-header-nav { display: none; }
  .sb-hero-stats { flex-direction: column; gap: 28px; padding-bottom: 60px; }
  .sb-hero-stat-border { display: none; }
  .sb-hero-wave-section-inner { flex-direction: column; gap: 28px; text-align: center; }
  .sb-hero-wave-section { border-radius: 3rem 3rem 0 0; padding: 60px 20px 48px; }
}
@media (max-width: 480px) {
  .sb-hero-inner { padding: 130px 16px 0; }
  .sb-hero-headline { font-size: 16vw; }
  .sb-hero-sub { font-size: 15px; max-width: 90%; }
  .sb-hero-cta { padding: 16px 40px; font-size: 12px; }
  .sb-hero-stat-num { font-size: 32px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-mesh-1"></div>
  <div class="sb-hero-mesh-2"></div>

  <header class="sb-hero-header">
    <a href="#" class="sb-hero-header-logo">Meridian</a>
    <nav class="sb-hero-header-nav">
      <a href="#">Services</a>
      <a href="#">Work</a>
      <a href="#">Studio</a>
      <a href="#">Contact</a>
    </nav>
  </header>

  <div class="sb-hero-inner">
    <span class="sb-hero-label fade-up">Digital Product Studio</span>
    <h1 class="sb-hero-headline fade-up">Build <em>fluid</em> products.</h1>
    <p class="sb-hero-sub fade-up">We design and engineer digital products that feel alive. Thoughtful motion, editorial typography, and interfaces people remember.</p>
    <a href="#" class="sb-hero-cta fade-up">Explore our process</a>

    <div class="sb-hero-stats fade-up">
      <div class="sb-hero-stat">
        <div class="sb-hero-stat-num">87</div>
        <div class="sb-hero-stat-label">Products Shipped</div>
      </div>
      <div class="sb-hero-stat-border"></div>
      <div class="sb-hero-stat">
        <div class="sb-hero-stat-num">14</div>
        <div class="sb-hero-stat-label">Design Awards</div>
      </div>
      <div class="sb-hero-stat-border"></div>
      <div class="sb-hero-stat">
        <div class="sb-hero-stat-num">6yr</div>
        <div class="sb-hero-stat-label">Avg Partnership</div>
      </div>
    </div>
  </div>

  <div class="sb-hero-wave-section fade-up">
    <div class="sb-hero-wave-section-inner">
      <p class="sb-hero-wave-text"><strong>Currently accepting two new partners for Q2.</strong> We work in deep engagements with a maximum of five clients at a time. No agency bloat, no handoffs.</p>
      <a href="#" class="sb-hero-wave-cta">Get in Touch</a>
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
