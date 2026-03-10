export const referenceHtml: string = `<style>
@keyframes sb-blob-float {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -30px) rotate(2deg); }
  50% { transform: translate(-15px, 15px) rotate(-1deg); }
  75% { transform: translate(25px, 5px) rotate(2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.sb-hero {
  padding: var(--sb-section-pad, 120px 20px 100px);
  background: var(--sb-highlight);
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-heading);
  overflow: hidden;
  position: relative;
}

/* Background blobs */
.sb-hero-blob-1 {
  position: absolute;
  top: -80px;
  right: -60px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: #7C3AED;
  opacity: 0.10;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  animation: sb-blob-float 8s ease-in-out infinite;
}
.sb-hero-blob-2 {
  position: absolute;
  bottom: -100px;
  left: -80px;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: #DB2777;
  opacity: 0.10;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  animation: sb-blob-float 8s ease-in-out infinite reverse;
}
.sb-hero-blob-3 {
  position: absolute;
  top: 50%;
  left: 60%;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: #0EA5E9;
  opacity: 0.08;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  animation: sb-blob-float 10s ease-in-out infinite 2s;
}

/* Inner */
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}
.sb-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px -5px rgba(124, 58, 237, 0.15), inset 0 -4px 8px rgba(0, 0, 0, 0.05);
  font-size: 13px;
  font-weight: 600;
  color: var(--sb-accent);
  margin-bottom: 40px;
}
.sb-hero-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #A78BFA, #7C3AED);
}
.sb-hero-headline {
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 64px;
  line-height: 1.08;
  color: var(--sb-heading);
  margin: 0 0 24px;
  letter-spacing: -0.02em;
}
.sb-hero-headline em {
  font-style: normal;
  background: linear-gradient(135deg, #7C3AED, #DB2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sb-hero-sub {
  font-size: 18px;
  font-weight: 400;
  color: var(--sb-muted);
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto 48px;
}

/* Clay CTA buttons */
.sb-hero-cta-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 72px;
}
.sb-hero-cta-primary {
  display: inline-block;
  padding: 18px 48px;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--sb-font), sans-serif;
  color: #ffffff;
  background: linear-gradient(135deg, #A78BFA, #7C3AED);
  border: none;
  border-radius: var(--sb-btn-radius, 20px);
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(124, 58, 237, 0.4);
}
.sb-hero-cta-primary:active {
  transform: scale(0.92);
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.1);
}
.sb-hero-cta-secondary {
  display: inline-block;
  padding: 18px 40px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-heading);
  background: #ffffff;
  border: none;
  border-radius: var(--sb-btn-radius, 20px);
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 10px 30px -5px rgba(124, 58, 237, 0.15), inset 0 -4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-cta-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px -5px rgba(124, 58, 237, 0.2), inset 0 -4px 8px rgba(0, 0, 0, 0.05);
}
.sb-hero-cta-secondary:active {
  transform: scale(0.92);
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Clay cards */
.sb-hero-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.sb-hero-card {
  background: #ffffff;
  border-radius: var(--sb-card-radius, 28px);
  padding: 40px 28px;
  text-align: left;
  box-shadow: 0 10px 30px -5px rgba(124, 58, 237, 0.15), inset 0 -4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 60px -15px rgba(124, 58, 237, 0.25), inset 0 -4px 8px rgba(0, 0, 0, 0.05);
}
.sb-hero-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.sb-hero-card:nth-child(1) .sb-hero-card-icon {
  background: linear-gradient(135deg, #A78BFA, #7C3AED);
}
.sb-hero-card:nth-child(2) .sb-hero-card-icon {
  background: linear-gradient(135deg, #F472B6, #DB2777);
}
.sb-hero-card:nth-child(3) .sb-hero-card-icon {
  background: linear-gradient(135deg, #38BDF8, #0EA5E9);
}
.sb-hero-card-title {
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: var(--sb-heading);
  margin: 0 0 12px;
}
.sb-hero-card-desc {
  font-size: 14px;
  font-weight: 400;
  color: #8a8192;
  line-height: 1.65;
  margin: 0 0 20px;
}
.sb-hero-card-stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--sb-highlight);
  border-radius: 20px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: var(--sb-accent);
}

/* Trust bar */
.sb-hero-trust {
  margin-top: 64px;
  text-align: center;
}
.sb-hero-trust-label {
  font-size: 12px;
  font-weight: 600;
  color: #a89db3;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.sb-hero-trust-logos {
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: center;
  flex-wrap: wrap;
}
.sb-hero-trust-logo {
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #c4bdd0;
  letter-spacing: -0.02em;
}

/* Fade-up */
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: 80px 20px 70px; }
  .sb-hero-headline { font-size: 40px; }
  .sb-hero-cards { grid-template-columns: 1fr; }
  .sb-hero-cta-row { flex-direction: column; align-items: center; }
  .sb-hero-trust-logos { gap: 24px; }
}
@media (max-width: 480px) {
  .sb-hero { padding: 60px 16px 56px; }
  .sb-hero-headline { font-size: 30px; }
  .sb-hero-sub { font-size: 15px; max-width: 90%; }
  .sb-hero-cta-primary,
  .sb-hero-cta-secondary { padding: 16px 36px; font-size: 14px; }
  .sb-hero-card { border-radius: 20px; padding: 28px 22px; }
  .sb-hero-trust-logo { font-size: 15px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-blob-1"></div>
  <div class="sb-hero-blob-2"></div>
  <div class="sb-hero-blob-3"></div>

  <div class="sb-hero-inner">
    <div class="sb-hero-badge fade-up">
      <span class="sb-hero-badge-dot"></span>
      Now with AI-powered scheduling
    </div>
    <h1 class="sb-hero-headline fade-up">Organize your life with <em>delightful</em> simplicity</h1>
    <p class="sb-hero-sub fade-up">The task manager that feels like a toy but works like a machine. Drag, stack, and flow through your day with zero friction.</p>

    <div class="sb-hero-cta-row fade-up">
      <a href="#" class="sb-hero-cta-primary">Try it free for 14 days</a>
      <a href="#" class="sb-hero-cta-secondary">Watch the demo</a>
    </div>

    <div class="sb-hero-cards fade-up">
      <div class="sb-hero-card">
        <div class="sb-hero-card-icon">&check;</div>
        <h3 class="sb-hero-card-title">Smart Prioritization</h3>
        <p class="sb-hero-card-desc">AI reads your patterns and surfaces what actually matters. No more staring at a wall of tasks wondering where to start.</p>
        <span class="sb-hero-card-stat">3x faster focus</span>
      </div>
      <div class="sb-hero-card">
        <div class="sb-hero-card-icon">&#9733;</div>
        <h3 class="sb-hero-card-title">Flow State Timer</h3>
        <p class="sb-hero-card-desc">Blocks distractions, tracks deep work, and learns your peak hours. Your best work happens when the world goes quiet.</p>
        <span class="sb-hero-card-stat">+2.4 hrs/day</span>
      </div>
      <div class="sb-hero-card">
        <div class="sb-hero-card-icon">&#8644;</div>
        <h3 class="sb-hero-card-title">Team Sync</h3>
        <p class="sb-hero-card-desc">Shared boards, async updates, and zero-meeting check-ins. Keep everyone aligned without the calendar chaos.</p>
        <span class="sb-hero-card-stat">40% fewer meetings</span>
      </div>
    </div>

    <div class="sb-hero-trust fade-up">
      <div class="sb-hero-trust-label">Trusted by teams at</div>
      <div class="sb-hero-trust-logos">
        <span class="sb-hero-trust-logo">Stripe</span>
        <span class="sb-hero-trust-logo">Linear</span>
        <span class="sb-hero-trust-logo">Vercel</span>
        <span class="sb-hero-trust-logo">Notion</span>
        <span class="sb-hero-trust-logo">Arc</span>
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
