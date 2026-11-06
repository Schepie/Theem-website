/**
 * VZW 'T HEEM ZONHOVEN - MAIN JAVASCRIPT
 * Interactiviteit: Prijscalculator, Filterbare Gallerij, Lightbox, Formulier & Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initCalculator();
  initGallery();
  initContactForm();
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

  // Filter items
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
      updateCurrentGalleryList();
    });
  });

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

