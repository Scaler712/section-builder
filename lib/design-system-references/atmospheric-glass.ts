export const referenceHtml: string = `<style>
.sb-hero {
  padding: var(--sb-section-pad, 110px 20px 90px);
  background: #0f172a;
  font-family: 'Inter', sans-serif;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.sb-hero-glow-1 {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
  filter: blur(20px);
  top: -120px;
  right: -80px;
  pointer-events: none;
}
.sb-hero-glow-2 {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%);
  filter: blur(20px);
  bottom: -100px;
  left: -60px;
  pointer-events: none;
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.sb-hero-glass-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  color: #a5b4fc;
  letter-spacing: 0.02em;
  margin-bottom: 36px;
}
.sb-hero-glass-badge span {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--sb-accent);
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
  box-shadow: 0 0 8px rgba(99,102,241,0.6);
}
.sb-hero h1 {
  font-family: var(--sb-font), serif;
  font-size: 60px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 40%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sb-hero-sub {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto 44px;
  font-weight: 400;
}
.sb-hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 64px;
}
.sb-hero-cta-primary {
  display: inline-block;
  padding: 16px 44px;
  background: var(--sb-cta-bg);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  border-radius: var(--sb-btn-radius, 50px);
  cursor: pointer;
  transition: all 500ms ease;
  box-shadow: 0 0 24px rgba(99,102,241,0.3);
}
.sb-hero-cta-primary:hover {
  background: #818cf8;
  box-shadow: 0 0 36px rgba(99,102,241,0.5);
}
.sb-hero-cta-secondary {
  display: inline-block;
  padding: 16px 44px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  color: #e2e8f0;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  border-radius: var(--sb-btn-radius, 50px);
  cursor: pointer;
  transition: all 500ms ease;
}
.sb-hero-cta-secondary:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}
.sb-hero-integrations {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--sb-card-radius, 18px);
  padding: 28px 40px;
  display: inline-block;
}
.sb-hero-integrations-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--sb-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}
.sb-hero-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}
.sb-hero-logo-item {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  padding: 8px 0;
  letter-spacing: 0.03em;
  transition: color 500ms ease;
}
.sb-hero-logo-item:hover { color: #a5b4fc; }
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: 70px 16px 60px; }
  .sb-hero h1 { font-size: 40px; }
  .sb-hero-sub { font-size: 16px; }
  .sb-hero-actions { flex-direction: column; align-items: center; gap: 12px; }
  .sb-hero-logos { gap: 20px; flex-wrap: wrap; }
  .sb-hero-glow-1 { width: 300px; height: 300px; }
  .sb-hero-glow-2 { width: 250px; height: 250px; }
}
@media (max-width: 480px) {
  .sb-hero h1 { font-size: 30px; }
  .sb-hero-sub { font-size: 15px; }
  .sb-hero-cta-primary, .sb-hero-cta-secondary { padding: 14px 36px; font-size: 14px; }
  .sb-hero-integrations { padding: 20px 24px; }
  .sb-hero-logo-item { font-size: 12px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-glow-1"></div>
  <div class="sb-hero-glow-2"></div>
  <div class="sb-hero-inner">
    <div class="sb-hero-glass-badge fade-up"><span></span>Now available for teams</div>
    <h1 class="fade-up">The workspace your<br/>data has been waiting for</h1>
    <p class="sb-hero-sub fade-up">Connect every source, automate every workflow, and surface insights your team would have missed. Built for companies that outgrew spreadsheets.</p>
    <div class="sb-hero-actions fade-up">
      <a href="#" class="sb-hero-cta-primary">Get started free</a>
      <a href="#" class="sb-hero-cta-secondary">Watch demo</a>
    </div>
    <div class="sb-hero-integrations fade-up">
      <div class="sb-hero-integrations-label">Connects with your stack</div>
      <div class="sb-hero-logos">
        <span class="sb-hero-logo-item">Slack</span>
        <span class="sb-hero-logo-item">Notion</span>
        <span class="sb-hero-logo-item">Stripe</span>
        <span class="sb-hero-logo-item">Figma</span>
        <span class="sb-hero-logo-item">GitHub</span>
        <span class="sb-hero-logo-item">+40 more</span>
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
