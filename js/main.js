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
    const hallPrice = parseInt(hallSelect.value, 10) || 0;
    const kitchenPrice = (kitchenCheck && kitchenCheck.checked) ? 65 : 0;
    const cleanPrice = cleanSelect ? (parseInt(cleanSelect.value, 10) || 0) : 0;
    const days = Math.max(1, parseInt(daysInput ? daysInput.value : 1, 10) || 1);
    const deposit = 150;

    const rentalPerDay = hallPrice + kitchenPrice;
    const totalRental = (rentalPerDay * days) + cleanPrice;
    const grandTotal = totalRental + deposit;

    if (subtotalDisplay) {
      subtotalDisplay.textContent = `Huur: €${totalRental} + Waarborg: €${deposit}`;
    }
    totalDisplay.textContent = `€ ${grandTotal}`;
  }

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
        target.scrollIntoView({ behavior: 'smooth' });
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
      gallerySection.scrollIntoView({ behavior: 'smooth' });
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

