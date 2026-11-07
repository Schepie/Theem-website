/**
 * VZW 't Heem Zonhoven - Roterende Fotolijst Splash Intro
 * Toont een roterende fotolijst met sfeerbeelden van 't Heem (zalen, keuken, buitenterrein)
 * bij het openen van de website.
 * Kan in/uitgeschakeld worden via het bewerkmenu (Edit Mode).
 */
(function() {
  const OVERLAY_ID = 'theemIntroOverlay';
  const SLIDES_ID = 'theemFrameSlides';
  const DOTS_ID = 'theemFrameDots';
  const CAPTION_ID = 'theemFrameCaption';
  const SKIP_ID = 'theemIntroSkipBtn';

  const THEEM_PHOTOS = [
    {
      src: 'assets/images/gallery/gallerij_andere_50.jpg',
      title: "Welkom bij 't Heem Zonhoven",
      sub: "De ideale ontmoetings- en feestlocatie aan de Dijkbeemdenweg"
    },
    {
      src: 'assets/images/gallery/gallerij_grote_zaal_31.jpg',
      title: "Grote Zaal",
      sub: "Capaciteit tot 80 personen • Ruim, modern & multifunctioneel"
    },
    {
      src: 'assets/images/gallery/gallerij_kleine_zaal_35.jpg',
      title: "Kleine Zaal",
      sub: "Capaciteit tot 40 personen • Voor intieme feesten & vergaderingen"
    },
    {
      src: 'assets/images/gallery/gallerij_keuken_37.jpg',
      title: "Volledig Uitgeruste Keuken",
      sub: "Fornuizen, koelingen, servies en alle kookvoorzieningen"
    },
    {
      src: 'assets/images/gallery/overkapping_plein.jpg',
      title: "Overdekt Buitenplein",
      sub: "Weerbestendige luifels & afdak voor recepties en buitenplezier"
    },
    {
      src: 'assets/images/gallery/gallerij_speeltuin_41.jpg',
      title: "Grote Speeltuin & Groen Terrein",
      sub: "Veilig omheind en verkeersluw voor kinderen"
    },
    {
      src: 'assets/images/hero_heem.jpg',
      title: "Thuis voor Feest & Vereniging",
      sub: "Betaalbare tarieven & direct online te reserveren"
    }
  ];

  async function checkIntroState() {
    try {
      // 1. Directe lokale voorkeur (als de beheerder in Edit Mode heeft geklikt):
      const local = localStorage.getItem('theem_intro_enabled');
      if (local === '0' || local === 'false') return false;
      if (local === '1' || local === 'true') return true;

      // 2. Opgeslagen bewerkingsstatus in localStorage:
      const stored = localStorage.getItem('theem_website_github_edits_v1');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (typeof parsed.introAnimationEnabled === 'boolean') {
            return parsed.introAnimationEnabled;
          }
        } catch(e) {}
      }

      // 3. Voor gewone bezoekers: haal van de server
      const res = await fetch('data/site-content.json?v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (typeof data.introAnimationEnabled === 'boolean') {
          return data.introAnimationEnabled;
        }
      }
    } catch(e) {}
    return true; // Standaard actief
  }

  async function initIntro() {
    const isEnabled = await checkIntroState();
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    if (!isEnabled) {
      overlay.style.display = 'none';
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      return;
    }

    const slidesWrap = document.getElementById(SLIDES_ID);
    const dotsWrap = document.getElementById(DOTS_ID);
    const captionWrap = document.getElementById(CAPTION_ID);
    const skipBtn = document.getElementById(SKIP_ID);

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Populate slides and dots if container exists
    let currentIndex = 0;
    const totalSlides = THEEM_PHOTOS.length;
    let slideElements = [];
    let dotElements = [];

    if (slidesWrap) {
      slidesWrap.innerHTML = '';
      if (dotsWrap) dotsWrap.innerHTML = '';

      THEEM_PHOTOS.forEach((photo, idx) => {
        const slide = document.createElement('div');
        slide.className = 'theem-frame-slide' + (idx === 0 ? ' active' : '');
        slide.innerHTML = `<img src="${photo.src}" alt="${photo.title}" loading="${idx === 0 ? 'eager' : 'lazy'}">`;
        slidesWrap.appendChild(slide);
        slideElements.push(slide);

        if (dotsWrap) {
          const dot = document.createElement('div');
          dot.className = 'theem-frame-dot' + (idx === 0 ? ' active' : '');
          dotsWrap.appendChild(dot);
          dotElements.push(dot);
        }
      });
    }

    function updateCaption(index) {
      if (!captionWrap) return;
      const cur = THEEM_PHOTOS[index];
      if (!cur) return;
      captionWrap.innerHTML = `
        <span class="theem-frame-caption-title">${cur.title}</span>
        <span class="theem-frame-caption-sub">${cur.sub}</span>
      `;
    }

    function goToSlide(nextIndex) {
      if (slideElements.length === 0) return;
      slideElements[currentIndex].classList.remove('active');
      if (dotElements[currentIndex]) dotElements[currentIndex].classList.remove('active');

      currentIndex = nextIndex % totalSlides;

      slideElements[currentIndex].classList.add('active');
      if (dotElements[currentIndex]) dotElements[currentIndex].classList.add('active');
      updateCaption(currentIndex);
    }

    // Auto-advance slideshow
    let timer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 2800);

    let finished = false;
    function finishIntro() {
      if (finished) return;
      finished = true;
      if (timer) clearInterval(timer);
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      setTimeout(() => {
        try {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        } catch(e) {}
      }, 700);
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        finishIntro();
      });
    }

    overlay.addEventListener('click', (e) => {
      // Sluit bij klik op overlay
      finishIntro();
    });

    // Veiligheidstimer: sluit na 2 volledige rotaties (~20 seconden)
    setTimeout(() => {
      if (!finished) finishIntro();
    }, 20000);
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
