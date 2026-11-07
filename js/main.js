/**
 * VZW 'T HEEM ZONHOVEN - MAIN JAVASCRIPT
 * Interactiviteit: Prijscalculator, Filterbare Gallerij, Lightbox, Formulier & Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initCalculator();
  initGallery();
  initContactForm();
  initPrivacyModal();
  initSmoothScrolling();
  initAboutPhotoFrame();
});

// 1. Sticky Header Effect
function initStickyHeader() {
  const header = document.getElementById('heemHeader');
  if (!header) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Interactive Price Calculator
function initCalculator() {
  const hallSelect = document.getElementById('calcHall');
  const kitchenCheck = document.getElementById('calcKitchen');
  const cleanSelect = document.getElementById('calcCleaning');
  const daysInput = document.getElementById('calcDays');
  const totalDisplay = document.getElementById('calcTotalDisplay');
  const subtotalDisplay = document.getElementById('calcSubtotalDisplay');
  const bookCalcBtn = document.getElementById('bookCalculatedBtn');

  if (!hallSelect || !totalDisplay) return;

  function calculate() {
    const prices = window.theemPrices || { kitchen: 65, waarborg: 150 };
    const hallPrice = parseInt(hallSelect.value, 10) || 0;
    const kitchenPrice = (kitchenCheck && kitchenCheck.checked) ? (prices.keuken || 65) : 0;
    const cleanPrice = cleanSelect ? (parseInt(cleanSelect.value, 10) || 0) : 0;
    const days = Math.max(1, parseInt(daysInput ? daysInput.value : 1, 10) || 1);
    const deposit = prices.waarborg || 150;

    const rentalPerDay = hallPrice + kitchenPrice;
    const totalRental = (rentalPerDay * days) + cleanPrice;
    const grandTotal = totalRental + deposit;

    if (subtotalDisplay) {
      subtotalDisplay.textContent = `Huur: €${totalRental} + Waarborg: €${deposit}`;
    }
    totalDisplay.textContent = `€ ${grandTotal}`;
  }

  window.recalcMainCalculator = calculate;

  hallSelect.addEventListener('change', calculate);
  if (kitchenCheck) kitchenCheck.addEventListener('change', calculate);
  if (cleanSelect) cleanSelect.addEventListener('change', calculate);
  if (daysInput) daysInput.addEventListener('input', calculate);

  if (bookCalcBtn) {
    bookCalcBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const formHall = document.getElementById('resHall');
      if (formHall) {
        formHall.value = hallSelect.value;
      }
      const target = document.getElementById('reserveren');
      if (target) {
        scrollToTarget(target, '#reserveren');
      }
    });
  }

  // Initial run
  calculate();
}

// 3. Gallery Filtering and Lightbox
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryUrls = [];
  let currentIndex = 0;

  // Apply filter to gallery items and update active button
  function applyFilter(filter) {
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    galleryItems.forEach(item => {
      const cat = item.getAttribute('data-category') || '';
      if (filter === 'all' || cat.includes(filter)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    updateCurrentGalleryList();
  }

  // Filter items button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter') || 'all';
      applyFilter(filter);
    });
  });

  // Global helper to filter and scroll to gallery
  window.setGalleryFilter = function(filterCategory) {
    applyFilter(filterCategory);
    const gallerySection = document.getElementById('gallerij');
    if (gallerySection) {
      scrollToTarget(gallerySection, '#gallerij');
    }
  };

  // Links with data-gallery-filter attribute (e.g. from zaal cards)
  document.querySelectorAll('[data-gallery-filter]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const filter = this.getAttribute('data-gallery-filter');
      window.setGalleryFilter(filter);
    });
  });

  // Check URL hash on page load
  const currentHash = window.location.hash.toLowerCase();
  if (currentHash.includes('kleine-zaal')) {
    applyFilter('kleine-zaal');
  } else if (currentHash.includes('grote-zaal')) {
    applyFilter('grote-zaal');
  } else if (currentHash.includes('keuken')) {
    applyFilter('keuken');
  } else if (currentHash.includes('speeltuin')) {
    applyFilter('speeltuin');
  } else if (currentHash.includes('buiten')) {
    applyFilter('buiten');
  }

  function updateCurrentGalleryList() {
    currentGalleryUrls = [];
    galleryItems.forEach(item => {
      if (item.style.display !== 'none') {
        const img = item.querySelector('img');
        if (img) currentGalleryUrls.push(img.src);
      }
    });
  }

  updateCurrentGalleryList();

  // Click on gallery item to open lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (!img || !lightbox || !lightboxImg) return;

      updateCurrentGalleryList();
      currentIndex = currentGalleryUrls.indexOf(img.src);
      if (currentIndex === -1) currentIndex = 0;

      lightboxImg.src = currentGalleryUrls[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function showNextImage() {
    if (!currentGalleryUrls.length) return;
    currentIndex = (currentIndex + 1) % currentGalleryUrls.length;
    lightboxImg.src = currentGalleryUrls[currentIndex];
  }

  function showPrevImage() {
    if (!currentGalleryUrls.length) return;
    currentIndex = (currentIndex - 1 + currentGalleryUrls.length) % currentGalleryUrls.length;
    lightboxImg.src = currentGalleryUrls[currentIndex];
  }

  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNextImage();
    else if (e.key === 'ArrowLeft') showPrevImage();
  });
}

// 4. Contact & Reservation Form Handling
function initContactForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('resName').value.trim();
    const email = document.getElementById('resEmail').value.trim();
    const phone = document.getElementById('resPhone').value.trim();
    const date = document.getElementById('resDate').value;
    const hall = document.getElementById('resHall').selectedOptions[0].text;
    const message = document.getElementById('resMessage').value.trim();

    const subject = encodeURIComponent(`Aanvraag Zaalverhuur 't Heem: ${date} - ${name}`);
    const bodyText = `Beste beheerder van 't Heem,\n\nGraag wil ik een reservatie of optie aanvragen voor:\n\n- Naam: ${name}\n- E-mail: ${email}\n- Telefoon: ${phone}\n- Gewenste datum: ${date}\n- Gekozen zaal/faciliteit: ${hall}\n- Vraag / Boodschap: ${message}\n\nMet vriendelijke groeten,\n${name}`;

    const mailtoUrl = `mailto:ksazonhoven.vzw@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

    // Feedback to user
    const successBox = document.getElementById('formSuccessMsg');
    if (successBox) {
      successBox.style.display = 'block';
    }

    // Open email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
  });
}

// 5. Privacy & Cookie Policy Modal
function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  const openLink = document.getElementById('privacyOpenLink');
  const closeBtn = document.getElementById('privacyModalClose');
  const okBtn = document.getElementById('privacyModalOkBtn');

  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openLink) openLink.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (okBtn) okBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  window.openPrivacyModal = openModal;
}

// 6. Smooth Scrolling with dynamic sticky header offset
function scrollToTarget(targetEl, targetHash) {
  if (!targetEl) return;
  const header = document.getElementById('heemHeader') || document.querySelector('.heem-header');
  const offset = header ? header.offsetHeight + 24 : 120;
  const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth'
  });

  if (targetHash) {
    if (history.pushState) {
      history.pushState(null, null, targetHash);
    } else {
      window.location.hash = targetHash;
    }
  }
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetHash = this.getAttribute('href');
      if (!targetHash || targetHash === '#' || targetHash.startsWith('#tab-')) return;
      const targetEl = document.querySelector(targetHash);
      if (targetEl) {
        e.preventDefault();
        scrollToTarget(targetEl, targetHash);
      }
    });
  });

  // Handle URL hash on initial page load with a slight delay
  if (window.location.hash && window.location.hash.length > 1) {
    const initialHash = window.location.hash;
    setTimeout(() => {
      const targetEl = document.querySelector(initialHash);
      if (targetEl) {
        scrollToTarget(targetEl, initialHash);
      }
    }, 200);
  }

  // Active Menu Pill Scrollspy
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = Array.from(navLinks).map(link => {
    const hash = link.getAttribute('href');
    return (hash && hash.startsWith('#') && hash.length > 1) ? document.querySelector(hash) : null;
  }).filter(Boolean);

  if (sections.length > 0) {
    const updateActiveNav = () => {
      const scrollPos = window.pageYOffset + 160;
      let currentSection = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollPos) {
          currentSection = sections[i];
          break;
        }
      }
      navLinks.forEach(link => {
        if (currentSection && link.getAttribute('href') === '#' + currentSection.id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }
}

// 6. Rotating Photo Frame in 'Over Ons' section
function initAboutPhotoFrame() {
  const frame = document.getElementById('aboutPhotoFrame');
  const slidesContainer = document.getElementById('aboutFrameSlides');
  const captionEl = document.getElementById('aboutFrameCaption');
  const dotsContainer = document.getElementById('aboutFrameDots');
  const prevBtn = document.getElementById('aboutFramePrev');
  const nextBtn = document.getElementById('aboutFrameNext');

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
      sub: "Feestopstelling tot 80 personen • Ruim & modern uitgerust"
    },
    {
      src: 'assets/images/gallery/gallerij_kleine_zaal_35.jpg',
      title: "Kleine Zaal",
      sub: "Tot 40 personen • Gezellig voor familiefeesten & vergaderingen"
    },
    {
      src: 'assets/images/gallery/gallerij_keuken_37.jpg',
      title: "Volledig Uitgeruste Keuken",
      sub: "Fornuizen, industriële vaatwas, koelingen & servies"
    },
    {
      src: 'assets/images/gallery/overkapping_plein.jpg',
      title: "Overdekt Buitenplein",
      sub: "Weerbestendige luifels & afdak voor recepties en buitenplezier"
    },
    {
      src: 'assets/images/gallery/gallerij_speeltuin_41.jpg',
      title: "Grote Speeltuin & Terrein",
      sub: "Veilig omheind en verkeersluw voor kinderen"
    },
    {
      src: 'assets/images/hero_heem.jpg',
      title: "Thuis voor Feest & Vereniging",
      sub: "Al jaren de vertrouwde ontmoetingsplaats van Zonhoven"
    }
  ];

  // Render slides and dots
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
      dot.setAttribute('aria-label', `Ga naar foto ${idx + 1}: ${slide.title}`);
      dot.addEventListener('click', () => {
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

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      restartTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      restartTimer();
    });
  }

  frame.addEventListener('mouseenter', stopTimer);
  frame.addEventListener('mouseleave', startTimer);

  // Set initial caption
  if (captionEl && slidesData[0]) {
    captionEl.innerHTML = `
      <span class="about-frame-caption-title">${slidesData[0].title}</span>
      <span class="about-frame-caption-sub">${slidesData[0].sub}</span>
    `;
  }

  startTimer();
}


