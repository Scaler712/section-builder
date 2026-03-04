import { SectionTemplate } from "./types";

export const videoEmbed: SectionTemplate = {
  id: "video-embed",
  name: "Video Embed",
  description: "Responsive 16:9 YouTube/Vimeo container",
  icon: "PlayCircle",
  aiPromptHints: "Create a video embed section with a headline, optional subheadline, and a responsive 16:9 iframe container for YouTube or Vimeo. Include placeholder URL. Style the container with rounded corners and subtle shadow.",
  defaultHtml: `<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap');

.sb-video {
  padding: 80px 20px;
  font-family: 'Raleway', sans-serif;
  background: #FAFAFA;
}
.sb-video-inner {
  max-width: 800px;
  margin: 0 auto;
}
.sb-video h2 {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  color: #2B2B2B;
  margin-bottom: 12px;
}
.sb-video .subtitle {
  text-align: center;
  font-size: 17px;
  color: #6B6B6B;
  margin-bottom: 36px;
  font-weight: 400;
}
.sb-video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  background: #000;
}
.sb-video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
.sb-video .fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.sb-video .fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .sb-video { padding: 50px 16px; }
  .sb-video h2 { font-size: 28px; }
  .sb-video-wrapper { border-radius: 12px; }
}
</style>

<div class="sb-video">
  <div class="sb-video-inner">
    <h2 class="fade-up">Watch How It Works</h2>
    <p class="subtitle fade-up">See the AI ad creation process in under 3 minutes</p>
    <div class="sb-video-wrapper fade-up">
      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Demo Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
  var elements = document.querySelectorAll('.sb-video .fade-up');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
})();
</script>`,
};
