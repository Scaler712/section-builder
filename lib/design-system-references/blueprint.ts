export const referenceHtml: string = `<style>
@keyframes sb-line-draw {
  from { stroke-dashoffset: 800; }
  to { stroke-dashoffset: 0; }
}

.sb-hero {
  padding: 0;
  background: var(--sb-highlight);
  font-family: var(--sb-font), sans-serif;
  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* Blueprint grid background */
.sb-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 20px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 20px);
  pointer-events: none;
  z-index: 0;
}

/* Paper grain texture */
.sb-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: overlay;
}

/* Nav bar */
.sb-hero-nav {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.sb-hero-nav-brand {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}
.sb-hero-nav-coords {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #00FFFF;
  letter-spacing: 0.1em;
}
.sb-hero-nav-links {
  display: flex;
  gap: 24px;
}
.sb-hero-nav-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s ease;
}
.sb-hero-nav-links a:hover {
  color: #00FFFF;
}

/* Inner */
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: var(--sb-section-pad, 100px 20px 80px);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 60px;
  align-items: start;
}

/* Dimension arrow divider */
.sb-hero-dimension {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #00FFFF;
  text-align: center;
  padding: 12px 0;
  letter-spacing: 0.1em;
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
}
.sb-hero-dimension::before,
.sb-hero-dimension::after {
  content: '';
  position: absolute;
  top: 50%;
  height: 1px;
  background: rgba(0, 255, 255, 0.3);
}
.sb-hero-dimension::before {
  left: 20px;
  right: calc(50% + 60px);
}
.sb-hero-dimension::after {
  right: 20px;
  left: calc(50% + 60px);
}

.sb-hero-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #00FFFF;
  margin-bottom: 32px;
  display: inline-block;
}
.sb-hero-headline {
  font-family: var(--sb-font), sans-serif;
  font-weight: 800;
  font-size: 56px;
  line-height: 1.05;
  color: var(--sb-heading);
  margin: 0 0 24px;
  letter-spacing: -0.03em;
}
.sb-hero-headline em {
  font-style: normal;
  color: #00FFFF;
}
.sb-hero-redline {
  color: var(--sb-accent);
  font-style: normal;
  text-decoration: underline;
  text-decoration-color: var(--sb-accent);
  text-underline-offset: 4px;
}
.sb-hero-sub {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.75;
  max-width: 460px;
  margin: 0 0 40px;
}

/* APPROVED stamp button */
.sb-hero-cta {
  display: inline-block;
  padding: 16px 48px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sb-accent);
  background: transparent;
  border: 2px solid var(--sb-accent);
  box-shadow: inset 0 0 0 2px transparent, 0 0 0 4px transparent;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}
.sb-hero-cta::before {
  content: '';
  position: absolute;
  inset: -6px;
  border: 1px solid rgba(255, 51, 51, 0.3);
  pointer-events: none;
}
.sb-hero-cta:hover {
  background: rgba(255, 51, 51, 0.1);
  box-shadow: 0 0 24px rgba(255, 51, 51, 0.2);
}

/* Cards with crosshair corners */
.sb-hero-schematic {
  position: relative;
}
.sb-hero-card {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 36px 28px;
  margin-bottom: 20px;
  background: rgba(0, 51, 102, 0.5);
}
/* Crosshair corners */
.sb-hero-card::before {
  content: '+';
  position: absolute;
  top: -7px;
  left: -4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1;
}
.sb-hero-card::after {
  content: '+';
  position: absolute;
  top: -7px;
  right: -4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1;
}
.sb-hero-card-bottom-left,
.sb-hero-card-bottom-right {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1;
}
.sb-hero-card-bottom-left {
  bottom: -7px;
  left: -4px;
}
.sb-hero-card-bottom-right {
  bottom: -7px;
  right: -4px;
}
.sb-hero-card-coord {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #00FFFF;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
  display: block;
}
.sb-hero-card-title {
  font-family: var(--sb-font), sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--sb-heading);
  margin: 0 0 10px;
  letter-spacing: -0.01em;
}
.sb-hero-card-desc {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.65;
  margin: 0 0 16px;
}
.sb-hero-card-measure {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  color: var(--sb-accent);
  letter-spacing: -0.02em;
}

/* SVG line animation */
.sb-hero-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.sb-hero-lines line {
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
}
.sb-hero-lines.visible line {
  animation: sb-line-draw 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.sb-hero-lines.visible line:nth-child(2) { animation-delay: 0.3s; }
.sb-hero-lines.visible line:nth-child(3) { animation-delay: 0.6s; }

/* Fade-up */
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero-inner {
    grid-template-columns: 1fr;
    padding: 80px 20px 60px;
    gap: 40px;
  }
  .sb-hero-headline { font-size: 38px; }
  .sb-hero-nav { padding: 20px 24px; }
  .sb-hero-nav-links { display: none; }
  .sb-hero-dimension { display: none; }
}
@media (max-width: 480px) {
  .sb-hero-inner { padding: 60px 16px 48px; }
  .sb-hero-headline { font-size: 28px; }
  .sb-hero-sub { font-size: 14px; }
  .sb-hero-cta { padding: 14px 32px; font-size: 11px; }
  .sb-hero-card { padding: 28px 20px; }
}
</style>

<div class="sb-hero">
  <svg class="sb-hero-lines fade-up" viewBox="0 0 1200 800" preserveAspectRatio="none">
    <line x1="0" y1="200" x2="1200" y2="200" stroke="rgba(0,255,255,0.08)" stroke-width="1"/>
    <line x1="400" y1="0" x2="400" y2="800" stroke="rgba(0,255,255,0.06)" stroke-width="1"/>
    <line x1="800" y1="0" x2="800" y2="800" stroke="rgba(0,255,255,0.06)" stroke-width="1"/>
  </svg>

  <nav class="sb-hero-nav">
    <a href="#" class="sb-hero-nav-brand">Construct.io</a>
    <span class="sb-hero-nav-coords">X:0 Y:0 &mdash; REV 4.2.1</span>
    <div class="sb-hero-nav-links">
      <a href="#">Docs</a>
      <a href="#">API</a>
      <a href="#">Status</a>
      <a href="#">Login</a>
    </div>
  </nav>

  <div class="sb-hero-dimension fade-up">&larr;&mdash;&mdash;&mdash; 1100px &mdash;&mdash;&mdash;&rarr;</div>

  <div class="sb-hero-inner">
    <div class="sb-hero-content">
      <span class="sb-hero-label fade-up">REV 4.2 // Infrastructure Platform</span>
      <h1 class="sb-hero-headline fade-up">Build with <em>precision</em>, deploy with <span class="sb-hero-redline">confidence</span>.</h1>
      <p class="sb-hero-sub fade-up">Architectural-grade infrastructure for teams that measure twice and ship once. Full observability, automated compliance, zero drift.</p>
      <a href="#" class="sb-hero-cta fade-up">APPROVED &mdash; Begin Project</a>
    </div>

    <div class="sb-hero-schematic fade-up">
      <div class="sb-hero-card">
        <span class="sb-hero-card-bottom-left">+</span>
        <span class="sb-hero-card-bottom-right">+</span>
        <span class="sb-hero-card-coord">SECTION A1 // COMPUTE</span>
        <h3 class="sb-hero-card-title">Edge Compute Mesh</h3>
        <p class="sb-hero-card-desc">Auto-scaling compute nodes distributed across 38 regions. Sub-50ms cold starts with pre-warmed containers.</p>
        <span class="sb-hero-card-measure">38 regions</span>
      </div>
      <div class="sb-hero-card">
        <span class="sb-hero-card-bottom-left">+</span>
        <span class="sb-hero-card-bottom-right">+</span>
        <span class="sb-hero-card-coord">SECTION B2 // STORAGE</span>
        <h3 class="sb-hero-card-title">Immutable Data Layer</h3>
        <p class="sb-hero-card-desc">Append-only storage with built-in versioning, point-in-time recovery, and automatic cross-region replication.</p>
        <span class="sb-hero-card-measure">99.999%</span>
      </div>
      <div class="sb-hero-card">
        <span class="sb-hero-card-bottom-left">+</span>
        <span class="sb-hero-card-bottom-right">+</span>
        <span class="sb-hero-card-coord">SECTION C3 // OBSERVE</span>
        <h3 class="sb-hero-card-title">Full-Stack Telemetry</h3>
        <p class="sb-hero-card-desc">Traces, metrics, and logs unified in a single pane. Anomaly detection catches issues before your users do.</p>
        <span class="sb-hero-card-measure">&lt;2s alert</span>
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
