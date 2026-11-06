/**
 * VZW 'T HEEM ZONHOVEN - MOBILE JAVASCRIPT
 * Bottom Tab Navigation, Prijscalculator, Mobile Lightbox & Quick Actions
 */

document.addEventListener('DOMContentLoaded', function() {
  initMobileBottomNav();
  initMobileCalculator();
  initMobileLightbox();
  initMobilePrivacyModal();
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
    const hallPrice = parseInt(hallSelect.value, 10) || 0;
    const kitchenPrice = (kitchenCheck && kitchenCheck.checked) ? 65 : 0;
    const cleanPrice = cleanSelect ? (parseInt(cleanSelect.value, 10) || 0) : 0;
    const deposit = 150;

    const grandTotal = hallPrice + kitchenPrice + cleanPrice + deposit;
    totalDisplay.textContent = `€ ${grandTotal}`;
  }

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

