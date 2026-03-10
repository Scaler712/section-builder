import { SectionTemplate } from "./types";

export const faq: SectionTemplate = {
  id: "faq",
  name: "FAQ",
  description: "Vanilla JS accordion",
  icon: "HelpCircle",
  aiPromptHints: "Create 5-6 FAQ items with clear questions and concise answers (2-3 sentences each). Address common objections: pricing, timeline, quality, guarantees, and how it works. Use a vanilla JS accordion that opens/closes on click.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-faq {
  padding: var(--sb-section-pad);
  font-family: var(--sb-font);
  background: #FFFFFF;
}
.sb-faq-inner {
  max-width: 750px;
  margin: 0 auto;
}
.sb-faq h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  color: var(--sb-heading);
  margin-bottom: 48px;
}
.sb-faq-item {
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.sb-faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  cursor: pointer;
  font-size: 17px;
  font-weight: 600;
  color: var(--sb-heading);
  user-select: none;
}
.sb-faq-question .arrow {
  font-size: 20px;
  transition: transform 0.3s ease;
  color: var(--sb-muted);
}
.sb-faq-item.open .sb-faq-question .arrow {
  transform: rotate(180deg);
}
.sb-faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
}
.sb-faq-item.open .sb-faq-answer {
  max-height: 300px;
  padding-bottom: 20px;
}
.sb-faq-answer p {
  font-size: 16px;
  color: var(--sb-body);
  line-height: 1.7;
  font-weight: 400;
}
.sb-faq .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.sb-faq .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-faq { padding: var(--sb-section-pad); }
  .sb-faq h2 { font-size: 28px; }
  .sb-faq-question { font-size: 15px; }
}
</style>

<div class="sb-faq">
  <div class="sb-faq-inner">
    <h2 class="fade-up">Frequently Asked Questions</h2>
    <div class="sb-faq-item fade-up">
      <div class="sb-faq-question">How is this different from a regular video agency?<span class="arrow">&#9662;</span></div>
      <div class="sb-faq-answer"><p>We use AI to generate video ads 10x faster and at a fraction of the cost. Traditional agencies charge $5K-$15K per video and take weeks. We deliver in 48 hours starting at $997/month for multiple videos.</p></div>
    </div>
    <div class="sb-faq-item fade-up">
      <div class="sb-faq-question">Will AI ads look "fake" or low quality?<span class="arrow">&#9662;</span></div>
      <div class="sb-faq-answer"><p>Not at all. Our AI tools produce production-quality footage that's indistinguishable from traditionally shot content. We combine the latest models with professional editing and proven ad frameworks.</p></div>
    </div>
    <div class="sb-faq-item fade-up">
      <div class="sb-faq-question">How long until I see results?<span class="arrow">&#9662;</span></div>
      <div class="sb-faq-answer"><p>Most clients see improvements within the first 2 weeks of running AI-generated creatives. The speed of delivery means you can test more variations faster and find winners sooner.</p></div>
    </div>
    <div class="sb-faq-item fade-up">
      <div class="sb-faq-question">Can I cancel anytime?<span class="arrow">&#9662;</span></div>
      <div class="sb-faq-answer"><p>Yes, all plans are month-to-month with no long-term contracts. You can cancel, pause, or change your plan at any time. We keep clients because the results speak for themselves.</p></div>
    </div>
    <div class="sb-faq-item fade-up">
      <div class="sb-faq-question">What if I don't like the ads you create?<span class="arrow">&#9662;</span></div>
      <div class="sb-faq-answer"><p>We offer unlimited revisions on every plan. If an ad doesn't meet your standards, we'll rework it until you're satisfied. Plus, our 30-day money-back guarantee means there's zero risk.</p></div>
    </div>
  </div>
</div>

<script>
(function() {
  var items = document.querySelectorAll('.sb-faq-item');
  for (var i = 0; i < items.length; i++) {
    items[i].querySelector('.sb-faq-question').addEventListener('click', function() {
      var item = this.parentElement;
      var isOpen = item.classList.contains('open');
      for (var j = 0; j < items.length; j++) {
        items[j].classList.remove('open');
      }
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  var elements = document.querySelectorAll('.sb-faq .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
