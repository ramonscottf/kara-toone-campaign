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
  volunteerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('formSuccess');

    // Gather form data using name attributes
    const formData = new FormData(form);
    const payload = { form_type: 'volunteer' };
    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }

    // Disable button while submitting
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        form.style.display = 'none';
        if (successEl) {
          successEl.style.display = 'block';
          successEl.querySelector('p').textContent = result.message || "We'll be in touch within 24 hours. Welcome to the team.";
        }
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit \u2192';
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit \u2192';
      alert('Network error. Please check your connection and try again.');
    }
  });
}

// ─── SMOOTH SCROLL FOR HASH LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── READ MORE TOGGLE ───
document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.previousElementSibling;
    if (target && target.classList.contains('expandable-content')) {
      const isExpanded = target.classList.toggle('expanded');
      btn.classList.toggle('expanded', isExpanded);
      btn.textContent = isExpanded ? 'Read Less' : (btn.dataset.label || 'Read More');
    }
  });
});

// ─── TICKER DUPLICATE (for seamless loop) ───
const ticker = document.getElementById('ticker');
if (ticker && ticker.children.length < 16) {
  const items = Array.from(ticker.children);
  items.forEach(item => {
    ticker.appendChild(item.cloneNode(true));
  });
}
