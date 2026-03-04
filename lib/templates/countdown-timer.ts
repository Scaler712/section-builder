import { SectionTemplate } from "./types";

export const countdownTimer: SectionTemplate = {
  id: "countdown-timer",
  name: "Countdown Timer",
  description: "JS countdown with day/hour/min/sec boxes",
  icon: "Timer",
  aiPromptHints: "Create a countdown timer section with a headline creating urgency, a visual timer with day/hour/minute/second boxes, supporting text, and a CTA button. The JavaScript should countdown to a configurable target date. Include a message for when the timer expires.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-countdown {
  padding: 80px 20px;
  font-family: 'Raleway', sans-serif;
  background: #2B2B2B;
  text-align: center;
}
.sb-countdown-inner {
  max-width: 700px;
  margin: 0 auto;
}
.sb-countdown h2 {
  font-size: 32px;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 12px;
}
.sb-countdown .subtitle {
  font-size: 17px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 36px;
  font-weight: 400;
}
.sb-countdown-boxes {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 36px;
}
.sb-countdown-box {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 20px 24px;
  min-width: 80px;
}
.sb-countdown-box .number {
  font-size: 36px;
  font-weight: 800;
  color: #E8B931;
  line-height: 1;
  margin-bottom: 6px;
}
.sb-countdown-box .label {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}
.sb-countdown .cta-btn {
  display: inline-block;
  background: #E8B931;
  color: #2B2B2B;
  padding: 16px 48px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.sb-countdown .cta-btn:hover {
  transform: translateY(-2px);
}
.sb-countdown .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-countdown .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-countdown { padding: 50px 16px; }
  .sb-countdown h2 { font-size: 26px; }
  .sb-countdown-boxes { gap: 10px; }
  .sb-countdown-box { min-width: 65px; padding: 16px 14px; }
  .sb-countdown-box .number { font-size: 28px; }
}
@media (max-width: 480px) {
  .sb-countdown-box { min-width: 55px; padding: 12px 10px; }
  .sb-countdown-box .number { font-size: 24px; }
  .sb-countdown .cta-btn { padding: 14px 32px; font-size: 16px; }
}
</style>

<div class="sb-countdown">
  <div class="sb-countdown-inner">
    <h2 class="fade-up">This Offer Expires Soon</h2>
    <p class="subtitle fade-up">Lock in the launch price before it's gone forever</p>
    <div class="sb-countdown-boxes fade-up">
      <div class="sb-countdown-box">
        <div class="number" id="sb-days">00</div>
        <div class="label">Days</div>
      </div>
      <div class="sb-countdown-box">
        <div class="number" id="sb-hours">00</div>
        <div class="label">Hours</div>
      </div>
      <div class="sb-countdown-box">
        <div class="number" id="sb-minutes">00</div>
        <div class="label">Minutes</div>
      </div>
      <div class="sb-countdown-box">
        <div class="number" id="sb-seconds">00</div>
        <div class="label">Seconds</div>
      </div>
    </div>
    <a href="#" class="cta-btn fade-up">Claim Your Spot Now</a>
  </div>
</div>

<script>
(function() {
  /* Set target date: 7 days from now — change as needed */
  var now = new Date();
  var target = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  function updateTimer() {
    var diff = target - new Date();
    if (diff <= 0) {
      document.getElementById('sb-days').textContent = '00';
      document.getElementById('sb-hours').textContent = '00';
      document.getElementById('sb-minutes').textContent = '00';
      document.getElementById('sb-seconds').textContent = '00';
      return;
    }
    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('sb-days').textContent = d < 10 ? '0' + d : d;
    document.getElementById('sb-hours').textContent = h < 10 ? '0' + h : h;
    document.getElementById('sb-minutes').textContent = m < 10 ? '0' + m : m;
    document.getElementById('sb-seconds').textContent = s < 10 ? '0' + s : s;
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  var elements = document.querySelectorAll('.sb-countdown .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
