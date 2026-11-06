/**
 * 't Heem Zonhoven - Centrale Prijzen & Tarieven Beheer
 * Beheert de officiële prijzen en synchroniseert deze dynamisch
 * over alle zalenkaarten, tarieven, prijscalculator en formulieren.
 */
(function() {
  window.DEFAULT_THEEM_PRICES = {
    groteZaal: 115,
    kleineZaal: 70,
    keuken: 65,
    schoonmaak: 60,
    waarborg: 150
  };

  window.theemPrices = Object.assign({}, window.DEFAULT_THEEM_PRICES);

  /**
   * Past de prijzen toe op de gehele DOM (zowel desktop als mobiel)
   */
  window.applyTheemPrices = function(newPrices) {
    if (!newPrices || typeof newPrices !== 'object') return;
    window.theemPrices = Object.assign({}, window.DEFAULT_THEEM_PRICES, newPrices);
    const p = window.theemPrices;

    // Converteer naar veilige integers
    p.groteZaal = parseInt(p.groteZaal, 10) || 115;
    p.kleineZaal = parseInt(p.kleineZaal, 10) || 70;
    p.keuken = parseInt(p.keuken, 10) || 65;
    p.schoonmaak = parseInt(p.schoonmaak, 10) || 60;
    p.waarborg = parseInt(p.waarborg, 10) || 150;
    const beideZalen = p.groteZaal + p.kleineZaal;

    // 1. Desktop Zalen overzicht (#zalen)
    document.querySelectorAll('[data-price-hall="grote"]').forEach(el => {
      el.innerHTML = `€ ${p.groteZaal} <span>/ dag</span>`;
    });
    document.querySelectorAll('[data-price-hall="kleine"]').forEach(el => {
      el.innerHTML = `€ ${p.kleineZaal} <span>/ dag</span>`;
    });
    document.querySelectorAll('[data-price-hall="keuken"]').forEach(el => {
      el.innerHTML = `€ ${p.keuken} <span>/ dag</span>`;
    });

    // 2. Desktop Tarievenkaarten (#tarieven)
    const cardGrote = document.querySelector('[data-price-card="grote"]');
    if (cardGrote) {
      const costEl = cardGrote.querySelector('.price-card-cost');
      if (costEl) costEl.textContent = `€ ${p.groteZaal}`;
    }
    const cardKleine = document.querySelector('[data-price-card="kleine"]');
    if (cardKleine) {
      const costEl = cardKleine.querySelector('.price-card-cost');
      if (costEl) costEl.textContent = `€ ${p.kleineZaal}`;
    }
    const cardKeuken = document.querySelector('[data-price-card="keuken"]');
    if (cardKeuken) {
      const costEl = cardKeuken.querySelector('.price-card-cost');
      if (costEl) costEl.textContent = `€ ${p.keuken}`;
    }
    const cardClean = document.querySelector('[data-price-card="schoonmaak"]');
    if (cardClean) {
      const costEl = cardClean.querySelector('.price-card-cost');
      if (costEl) costEl.textContent = `€ 0 / € ${p.schoonmaak}`;
      const subEl = cardClean.querySelector('.price-card-sub');
      if (subEl) subEl.innerHTML = `Zelf poetsen: € 0<br>Door VZW 't Heem: € ${p.schoonmaak}`;
    }

    // 3. Desktop Prijscalculator (#prijscalculator)
    const calcHall = document.getElementById('calcHall');
    if (calcHall) {
      Array.from(calcHall.options).forEach(opt => {
        if (opt.text.includes('Grote Zaal') || opt.dataset.hall === 'grote') {
          opt.value = p.groteZaal;
          opt.textContent = `Grote Zaal (€ ${p.groteZaal} / dag)`;
          opt.dataset.hall = 'grote';
        } else if (opt.text.includes('Kleine Zaal') || opt.dataset.hall === 'kleine') {
          opt.value = p.kleineZaal;
          opt.textContent = `Kleine Zaal (€ ${p.kleineZaal} / dag)`;
          opt.dataset.hall = 'kleine';
        }
      });
    }
    const calcKitchenLabel = document.getElementById('lblCalcKitchen') || document.querySelector('label[for="calcKitchen"] span');
    if (calcKitchenLabel) {
      calcKitchenLabel.textContent = `Inclusief Keuken (+ € ${p.keuken} / dag)`;
    }
    const calcCleanSelect = document.getElementById('calcCleaning');
    if (calcCleanSelect) {
      Array.from(calcCleanSelect.options).forEach(opt => {
        if (opt.text.includes('Laten poetsen') || opt.dataset.clean === 'heem' || opt.value !== '0') {
          opt.value = p.schoonmaak;
          opt.textContent = `Laten poetsen door VZW 't Heem (€ ${p.schoonmaak})`;
          opt.dataset.clean = 'heem';
        }
      });
    }

    // 4. Desktop Reserveringsformulier (#reserveren)
    const resHall = document.getElementById('resHall');
    if (resHall) {
      Array.from(resHall.options).forEach(opt => {
        if (opt.text.includes('Grote Zaal') || opt.dataset.hall === 'grote') {
          opt.textContent = `Grote Zaal (€ ${p.groteZaal})`;
          opt.dataset.hall = 'grote';
        } else if (opt.text.includes('Kleine Zaal') || opt.dataset.hall === 'kleine') {
          opt.textContent = `Kleine Zaal (€ ${p.kleineZaal})`;
          opt.dataset.hall = 'kleine';
        }
      });
    }

    // 5. Mobiele Zalenkaarten (Home tab & Zalen tab)
    document.querySelectorAll('[data-mprice-hall="grote"]').forEach(el => {
      el.innerHTML = `€ ${p.groteZaal} <span style="font-size:0.75rem; color:var(--text-muted);">/dag</span>`;
    });
    document.querySelectorAll('[data-mprice-hall="kleine"]').forEach(el => {
      el.innerHTML = `€ ${p.kleineZaal} <span style="font-size:0.75rem; color:var(--text-muted);">/dag</span>`;
    });
    document.querySelectorAll('[data-mprice-hall="keuken"]').forEach(el => {
      el.innerHTML = `€ ${p.keuken} <span style="font-size:0.75rem; color:var(--text-muted);">/dag</span>`;
    });

    document.querySelectorAll('[data-mprice-zalen="grote"]').forEach(el => {
      el.textContent = `€ ${p.groteZaal}`;
    });
    document.querySelectorAll('[data-mprice-zalen="kleine"]').forEach(el => {
      el.textContent = `€ ${p.kleineZaal}`;
    });
    document.querySelectorAll('[data-mprice-zalen="keuken"]').forEach(el => {
      el.textContent = `€ ${p.keuken}`;
    });

    // 6. Mobiele Tarieven Grid (#tab-tarieven)
    const mTariefGrote = document.querySelector('[data-mtarief="grote"]');
    if (mTariefGrote) mTariefGrote.textContent = `€ ${p.groteZaal}`;
    const mTariefKleine = document.querySelector('[data-mtarief="kleine"]');
    if (mTariefKleine) mTariefKleine.textContent = `€ ${p.kleineZaal}`;
    const mTariefKeuken = document.querySelector('[data-mtarief="keuken"]');
    if (mTariefKeuken) mTariefKeuken.textContent = `€ ${p.keuken}`;
    const mTariefClean = document.querySelector('[data-mtarief="schoonmaak"]');
    if (mTariefClean) mTariefClean.textContent = `€ 0 / € ${p.schoonmaak}`;

    // 7. Mobiele Calculator
    const mCalcHall = document.getElementById('mCalcHall');
    if (mCalcHall) {
      Array.from(mCalcHall.options).forEach((opt, idx) => {
        if (idx === 0 || opt.dataset.hall === 'grote') {
          opt.value = p.groteZaal;
          opt.textContent = `Grote Zaal (€ ${p.groteZaal})`;
          opt.dataset.hall = 'grote';
        } else if (idx === 1 || opt.dataset.hall === 'kleine') {
          opt.value = p.kleineZaal;
          opt.textContent = `Kleine Zaal (€ ${p.kleineZaal})`;
          opt.dataset.hall = 'kleine';
        } else if (idx === 2 || opt.dataset.hall === 'beide') {
          opt.value = beideZalen;
          opt.textContent = `Beide Zalen (€ ${beideZalen})`;
          opt.dataset.hall = 'beide';
        }
      });
    }
    const mKitchenLabel = document.querySelector('.mobile-calc-check span');
    if (mKitchenLabel) {
      mKitchenLabel.textContent = `Inclusief Keuken (+ € ${p.keuken})`;
    }
    const mCalcClean = document.getElementById('mCalcCleaning');
    if (mCalcClean) {
      Array.from(mCalcClean.options).forEach((opt, idx) => {
        if (idx === 1 || opt.dataset.clean === 'heem' || opt.value !== '0') {
          opt.value = p.schoonmaak;
          opt.textContent = `Laten poetsen door 't Heem (€ ${p.schoonmaak})`;
          opt.dataset.clean = 'heem';
        }
      });
    }

    // 8. Waarborg & Schoonmaak in tekstblokken
    document.querySelectorAll('.price-val-deposit').forEach(el => {
      el.textContent = `€ ${p.waarborg}`;
    });
    document.querySelectorAll('.price-val-clean').forEach(el => {
      el.textContent = `€ ${p.schoonmaak}`;
    });

    // 9. Herbereken actieve calculators
    if (typeof window.recalcMainCalculator === 'function') {
      window.recalcMainCalculator();
    }
    if (typeof window.recalcMobileCalculator === 'function') {
      window.recalcMobileCalculator();
    }
  };

  /**
   * Laadt initiële prijzen uit localStorage of data/site-content.json
   */
  async function loadInitialPrices() {
    let pricesToApply = Object.assign({}, window.DEFAULT_THEEM_PRICES);

    // 1. Probeer data/site-content.json
    try {
      const res = await fetch('data/site-content.json?v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && data.prices) {
          pricesToApply = Object.assign(pricesToApply, data.prices);
        }
      }
    } catch(e) {}

    // 2. Check localStorage voor eventuele nieuwere lokale edits
    try {
      const stored = localStorage.getItem('theem_website_github_edits_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.prices) {
          pricesToApply = Object.assign(pricesToApply, parsed.prices);
        }
      }
    } catch(e) {}

    window.applyTheemPrices(pricesToApply);
  }

  // Voer direct uit bij laden van DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInitialPrices);
  } else {
    loadInitialPrices();
  }
})();
