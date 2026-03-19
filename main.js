/* ═══════════════════════════════════════════════════
   KARA TOONE FOR UTAH — SHARED JAVASCRIPT
   ═══════════════════════════════════════════════════ */

// ─── NAV SCROLL ───
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
  // Trigger on load too
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

// ─── HAMBURGER ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose = document.getElementById('menuClose');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (menuClose) menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ─── SCROLL REVEAL ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  if (!isNaN(target)) {
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  }
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ─── PRIORITIES ACCORDION ───
document.querySelectorAll('.priority-item').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.priority-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
// Open first by default
document.querySelector('.priority-item')?.classList.add('open');

// ─── DONATE AMOUNTS ───
let selectedAmount = 50;
document.querySelectorAll('.amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const amount = btn.dataset.amount;
    const donateBtn = document.getElementById('donateBtn');
    if (donateBtn) {
      if (amount === 'custom') {
        donateBtn.textContent = 'Donate a Custom Amount';
      } else {
        selectedAmount = amount;
        donateBtn.textContent = `Donate Online \u2014 $${amount}`;
      }
    }
  });
});

// ─── VOLUNTEER FORM ───
const volunteerForm = document.getElementById('volunteerForm');
if (volunteerForm) {
  volunteerForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input, select');
    const data = {};
    inputs.forEach(input => {
      const label = input.closest('.form-group')?.querySelector('label')?.textContent || input.name || input.type;
      data[label] = input.value;
    });
    const subject = encodeURIComponent('Volunteer Form - ' + (data['First Name'] || '') + ' ' + (data['Last Name'] || ''));
    const body = encodeURIComponent(Object.entries(data).map(([k, v]) => k + ': ' + v).join('\n'));
    window.open('mailto:votekaratoone@gmail.com?subject=' + subject + '&body=' + body, '_self');
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  });
}

// ─── SMOOTH SCROLL FOR HASH LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── BACK TO TOP ───
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── TICKER DUPLICATE (for seamless loop) ───
const ticker = document.getElementById('ticker');
if (ticker && ticker.children.length < 16) {
  const items = Array.from(ticker.children);
  items.forEach(item => {
    ticker.appendChild(item.cloneNode(true));
  });
}

// ─── DONATE MODAL ───
const donateOverlay = document.getElementById('donateModalOverlay');
const donateModalClose = document.getElementById('donateModalClose');
const donateModalIframe = document.getElementById('donateModalIframe');
const ANEDOT_URL = 'https://secure.anedot.com/117e8124-433e-4d99-acbd-249fa76c6e0c/donate';

function openDonateModal(e) {
  if (e) e.preventDefault();
  if (donateOverlay) {
    if (donateModalIframe && !donateModalIframe.src) {
      donateModalIframe.src = ANEDOT_URL;
    }
    donateOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeDonateModal() {
  if (donateOverlay) {
    donateOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (donateOverlay) {
  donateOverlay.addEventListener('click', e => {
    if (e.target === donateOverlay) closeDonateModal();
  });
}
if (donateModalClose) {
  donateModalClose.addEventListener('click', closeDonateModal);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDonateModal();
});

// Floating donate button
const floatingDonate = document.getElementById('floatingDonate');
if (floatingDonate) {
  floatingDonate.addEventListener('click', openDonateModal);
}

// Intercept Anedot links to open in modal instead
document.querySelectorAll('a[href*="anedot.com"]').forEach(link => {
  // Skip nav-donate links on mobile (let them open normally as fallback)
  link.addEventListener('click', e => {
    if (donateOverlay) {
      openDonateModal(e);
    }
  });
});
