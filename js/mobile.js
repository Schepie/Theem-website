/**
 * VZW 'T HEEM ZONHOVEN - MOBILE JAVASCRIPT
 * Bottom Tab Navigation, Prijscalculator, Mobile Lightbox & Quick Actions
 */

document.addEventListener('DOMContentLoaded', function() {
  initMobileBottomNav();
  initMobileCalculator();
  initMobileLightbox();
  initMobilePrivacyModal();
  initMobileAboutPhotoFrame();
});

// 1. Mobile Bottom Tab Navigation
function initMobileBottomNav() {
  const navItems = document.querySelectorAll('.nav-bottom-item');
  const sections = document.querySelectorAll('.mobile-tab-section');

  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      const targetId = this.getAttribute('data-target');
      if (!targetId) return;

      e.preventDefault();

      navItems.forEach(n => n.classList.remove('active'));
      this.classList.add('active');

      sections.forEach(sec => {
        if (sec.id === targetId) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// 2. Mobile Price Calculator
function initMobileCalculator() {
  const hallSelect = document.getElementById('mCalcHall');
  const kitchenCheck = document.getElementById('mCalcKitchen');
  const cleanSelect = document.getElementById('mCalcCleaning');
  const totalDisplay = document.getElementById('mCalcTotal');

  if (!hallSelect || !totalDisplay) return;

  function calculate() {
    const prices = window.theemPrices || { kitchen: 65, waarborg: 150 };
    const hallPrice = parseInt(hallSelect.value, 10) || 0;
    const kitchenPrice = (kitchenCheck && kitchenCheck.checked) ? (prices.keuken || 65) : 0;
    const cleanPrice = cleanSelect ? (parseInt(cleanSelect.value, 10) || 0) : 0;
    const deposit = prices.waarborg || 150;

    const grandTotal = hallPrice + kitchenPrice + cleanPrice + deposit;
    totalDisplay.textContent = `€ ${grandTotal}`;
  }

  window.recalcMobileCalculator = calculate;

  hallSelect.addEventListener('change', calculate);
  if (kitchenCheck) kitchenCheck.addEventListener('change', calculate);
  if (cleanSelect) cleanSelect.addEventListener('change', calculate);

  calculate();
}

// 3. Mobile Lightbox & Gallery Filtering
function initMobileLightbox() {
  const thumbs = document.querySelectorAll('.mobile-gallery-thumb');
  const filterBtns = document.querySelectorAll('.m-filter-btn');
  const lightbox = document.getElementById('mobileLightbox');
  const lightboxImg = document.getElementById('mobileLightboxImg');
  const closeBtn = document.getElementById('mobileLightboxClose');

  function applyMobileFilter(filter) {
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
        btn.style.background = 'var(--heem-primary)';
        btn.style.color = '#fff';
      } else {
        btn.classList.remove('active');
        btn.style.background = '#fff';
        btn.style.color = 'var(--heem-primary)';
      }
    });

    thumbs.forEach(thumb => {
      const cat = thumb.getAttribute('data-category') || '';
      if (filter === 'all' || cat.includes(filter)) {
        thumb.style.display = 'block';
      } else {
        thumb.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter') || 'all';
      applyMobileFilter(filter);
    });
  });

  // Switch tab and immediately apply filter
  window.switchMobileTabWithFilter = function(tabId, filterCategory) {
    const navItems = document.querySelectorAll('.nav-bottom-item');
    const sections = document.querySelectorAll('.mobile-tab-section');

    navItems.forEach(n => {
      if (n.getAttribute('data-target') === tabId) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });

    sections.forEach(sec => {
      if (sec.id === tabId) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    applyMobileFilter(filterCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!lightbox || !lightboxImg) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) close();
  });
}

// 4. Mobile Privacy & Cookie Policy Modal
function initMobilePrivacyModal() {
  const modal = document.getElementById('mobilePrivacyModal');
  const closeBtn = document.getElementById('mPrivacyModalClose');
  const okBtn = document.getElementById('mPrivacyModalOkBtn');

  if (!modal) return;

  window.openMobilePrivacyModal = function() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (okBtn) okBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
}

// 5. Mobile Rotating Photo Frame in 'Over Ons' Card
function initMobileAboutPhotoFrame() {
  const frame = document.getElementById('aboutPhotoFrameMobile');
  const slidesContainer = document.getElementById('aboutFrameSlidesMobile');
  const captionEl = document.getElementById('aboutFrameCaptionMobile');
  const dotsContainer = document.getElementById('aboutFrameDotsMobile');

  if (!frame || !slidesContainer) return;

  const slidesData = [
    {
      src: 'assets/images/gallery/gallerij_andere_50.jpg',
      title: "Vooraanzicht 't Heem",
      sub: "Veilige & groene omgeving aan de Dijkbeemdenweg"
    },
    {
      src: 'assets/images/gallery/gallerij_grote_zaal_31.jpg',
      title: "Grote Zaal",
      sub: "Feestopstelling tot 80 personen • Ruim & modern"
    },
    {
      src: 'assets/images/gallery/gallerij_kleine_zaal_35.jpg',
      title: "Kleine Zaal",
      sub: "Tot 40 personen • Gezellig voor familie & vrienden"
    },
    {
      src: 'assets/images/gallery/gallerij_keuken_37.jpg',
      title: "Volledig Uitgeruste Keuken",
      sub: "Fornuizen, industriële vaatwas & koeling"
    },
    {
      src: 'assets/images/gallery/overkapping_plein.jpg',
      title: "Overdekt Buitenplein",
      sub: "Weerbestendige luifels & afdak voor recepties"
    },
    {
      src: 'assets/images/gallery/gallerij_speeltuin_41.jpg',
      title: "Grote Speeltuin & Terrein",
      sub: "Veilig omheind en verkeersluw voor kinderen"
    },
    {
      src: 'assets/images/hero_heem.jpg',
      title: "Thuis voor Feest & Vereniging",
      sub: "Al jaren de vertrouwde ontmoetingsplaats in Zonhoven"
    }
  ];

  slidesContainer.innerHTML = '';
  if (dotsContainer) dotsContainer.innerHTML = '';

  const slideElements = [];
  const dotElements = [];

  slidesData.forEach((slide, idx) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'about-frame-slide' + (idx === 0 ? ' active' : '');
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.title;
    img.loading = idx === 0 ? 'eager' : 'lazy';
    slideDiv.appendChild(img);
    slidesContainer.appendChild(slideDiv);
    slideElements.push(slideDiv);

    if (dotsContainer) {
      const dot = document.createElement('span');
      dot.className = 'about-frame-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
      dotElements.push(dot);
    }
  });

  let currentIndex = 0;
  let timer = null;

  function goToSlide(newIndex) {
    if (newIndex === currentIndex) return;
    slideElements[currentIndex].classList.remove('active');
    if (dotElements[currentIndex]) dotElements[currentIndex].classList.remove('active');

    currentIndex = (newIndex + slidesData.length) % slidesData.length;

    slideElements[currentIndex].classList.add('active');
    if (dotElements[currentIndex]) dotElements[currentIndex].classList.add('active');

    if (captionEl) {
      const data = slidesData[currentIndex];
      captionEl.innerHTML = `
        <span class="about-frame-caption-title">${data.title}</span>
        <span class="about-frame-caption-sub">${data.sub}</span>
      `;
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(nextSlide, 3500);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function restartTimer() {
    startTimer();
  }

  // Touch swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  frame.addEventListener('touchstart', (e) => {
    stopTimer();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  frame.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Only swipe if horizontal movement is dominant and > 35px
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    restartTimer();
  }, { passive: true });

  // Initial caption
  if (captionEl && slidesData[0]) {
    captionEl.innerHTML = `
      <span class="about-frame-caption-title">${slidesData[0].title}</span>
      <span class="about-frame-caption-sub">${slidesData[0].sub}</span>
    `;
  }

  startTimer();
}


