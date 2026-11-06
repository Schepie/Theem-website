/**
 * VZW 't Heem Zonhoven - Logo Intro Animatie
 * Toont animatie van oud naar nieuw logo bij het opstarten van de website.
 * Kan in/uitgeschakeld worden via het bewerkmenu.
 */
(function() {
  const OVERLAY_ID = 'theemIntroOverlay';
  const VIDEO_ID = 'theemIntroVideo';
  const SKIP_ID = 'theemIntroSkipBtn';

  async function checkIntroState() {
    try {
      const local = localStorage.getItem('theem_intro_enabled');
      if (local === '0' || local === 'false') return false;
      if (local === '1' || local === 'true') return true;

      const stored = localStorage.getItem('theem_website_github_edits_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.introAnimationEnabled === 'boolean') {
          return parsed.introAnimationEnabled;
        }
      }

      const res = await fetch('data/site-content.json?v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (typeof data.introAnimationEnabled === 'boolean') {
          localStorage.setItem('theem_intro_enabled', data.introAnimationEnabled ? '1' : '0');
          return data.introAnimationEnabled;
        }
      }
    } catch(e) {}
    return true; // Standaard aan
  }

  async function initIntro() {
    const isEnabled = await checkIntroState();
    const overlay = document.getElementById(OVERLAY_ID);
    const video = document.getElementById(VIDEO_ID);
    const skipBtn = document.getElementById(SKIP_ID);

    if (!overlay || !video) return;

    if (!isEnabled) {
      overlay.style.display = 'none';
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      return;
    }

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    let finished = false;
    function finishIntro() {
      if (finished) return;
      finished = true;
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      setTimeout(() => {
        try {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        } catch(e) {}
      }, 700);
    }

    video.addEventListener('ended', () => {
      setTimeout(finishIntro, 400);
    });

    video.addEventListener('error', () => {
      finishIntro();
    });

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        try { video.pause(); } catch(err) {}
        finishIntro();
      });
    }

    overlay.addEventListener('click', () => {
      try { video.pause(); } catch(err) {}
      finishIntro();
    });

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('[Intro Video] Autoplay niet direct toegestaan, klik op scherm om te starten:', err);
      });
    }

    // Veiligheidstimer: max 11 seconden (video duurt 10s)
    setTimeout(() => {
      if (!finished) finishIntro();
    }, 11500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro);
  } else {
    initIntro();
  }

  window.theemFinishIntro = function() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.classList.add('hidden');
      setTimeout(() => {
        try { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); } catch(e) {}
      }, 700);
    }
  };
})();

