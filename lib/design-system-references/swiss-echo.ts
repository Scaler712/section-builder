export const referenceHtml: string = `<style>
.sb-hero {
  padding: var(--sb-section-pad, 120px 20px 100px);
  background: var(--sb-highlight);
  font-family: var(--sb-font), sans-serif;
  text-align: center;
  overflow: hidden;
  position: relative;
}
.sb-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
}
.sb-hero-echo-stack {
  position: relative;
  display: inline-block;
  margin-bottom: 40px;
}
.sb-hero-echo-stack .echo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 11vw;
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.05em;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
}
.sb-hero-echo-stack .echo-1 { color: #d9d9d9; transform: translateY(-0.16em); }
.sb-hero-echo-stack .echo-2 { color: #d1d1d1; transform: translateY(-0.12em); }
.sb-hero-echo-stack .echo-3 { color: #c9c9c9; transform: translateY(-0.08em); }
.sb-hero-echo-stack .echo-4 { color: #bfbfbf; transform: translateY(-0.04em); }
.sb-hero-echo-stack .primary-text {
  position: relative;
  z-index: 2;
  font-size: 11vw;
  font-weight: 700;
  color: var(--sb-heading);
  line-height: 0.9;
  letter-spacing: -0.05em;
}
.sb-hero-sub {
  font-size: 18px;
  font-weight: 500;
  color: var(--sb-body);
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto 48px;
  letter-spacing: -0.01em;
}
.sb-hero-cta {
  display: inline-block;
  padding: 16px 52px;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--sb-font), sans-serif;
  color: var(--sb-cta-bg);
  background: transparent;
  border: 1px solid var(--sb-cta-bg);
  border-radius: var(--sb-btn-radius, 50px);
  text-decoration: none;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 700ms cubic-bezier(0.77, 0, 0.175, 1);
}
.sb-hero-cta:hover {
  background: var(--sb-cta-bg);
  color: var(--sb-highlight);
}
.sb-hero-tagline {
  margin-top: 56px;
  font-size: 12px;
  font-weight: 500;
  color: var(--sb-muted);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.sb-hero .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 700ms cubic-bezier(0.77, 0, 0.175, 1), transform 700ms cubic-bezier(0.77, 0, 0.175, 1);
}
.sb-hero .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-hero { padding: 80px 16px 70px; }
  .sb-hero-echo-stack .primary-text,
  .sb-hero-echo-stack .echo { font-size: 14vw; }
  .sb-hero-sub { font-size: 16px; }
}
@media (max-width: 480px) {
  .sb-hero { padding: 60px 16px 50px; }
  .sb-hero-echo-stack .primary-text,
  .sb-hero-echo-stack .echo { font-size: 16vw; }
  .sb-hero-sub { font-size: 15px; max-width: 90%; }
  .sb-hero-cta { padding: 14px 40px; font-size: 13px; }
}
</style>

<div class="sb-hero">
  <div class="sb-hero-inner">
    <div class="sb-hero-echo-stack fade-up">
      <span class="echo echo-1" aria-hidden="true">Less noise.</span>
      <span class="echo echo-2" aria-hidden="true">Less noise.</span>
      <span class="echo echo-3" aria-hidden="true">Less noise.</span>
      <span class="echo echo-4" aria-hidden="true">Less noise.</span>
      <span class="primary-text">Less noise.</span>
    </div>
    <p class="sb-hero-sub fade-up">We strip brands down to what actually matters. No fluff, no filler — just design that earns attention and holds it.</p>
    <a href="#" class="sb-hero-cta fade-up">Start a project</a>
    <p class="sb-hero-tagline fade-up">Strategy &mdash; Identity &mdash; Digital</p>
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
