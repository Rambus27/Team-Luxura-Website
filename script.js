/* ==================== GLOBAL UI INIT ==================== */
const DISCORD_LOGO_URL = 'https://image2url.com/r2/default/images/1773885394176-e56b1cf8-f06a-4df9-98d5-9ccb0a36dea9.png';
const APPLICATIONS_API_BASE = 'https://script.google.com/macros/s/AKfycbwM9lUfdBnuvG3oaFQ-rNDEfbAwC7V2VDnEY3ysQMA91EOBKJbBui896f7I0Or-n_rKbg/exec';
const THEME_STORAGE_KEY = 'luxura-theme';
const EFFECTS_STORAGE_KEY = 'luxura-ambient-effects';
const APPLY_DRAFT_KEY = 'luxura-apply-draft';

const THEME_OPTIONS = [
  { value: 'default', label: 'Midnight Luxura' },
  { value: 'ember', label: 'Ember Rush' },
  { value: 'frost', label: 'Frost Pulse' },
  { value: 'aurora', label: 'Aurora Current' },
  { value: 'solar', label: 'Solar Flare' },
  { value: 'forest', label: 'Verdant Echo' }
];

const isApplicationsApiConfigured = () => (
  APPLICATIONS_API_BASE && !APPLICATIONS_API_BASE.includes('REPLACE_WITH_YOUR_DEPLOYMENT_ID')
);

const initBranding = () => {
  document.querySelectorAll('.nav-logo').forEach((logo) => {
    logo.innerHTML = `<img src="${DISCORD_LOGO_URL}" alt="Team Luxura logo"><span>Luxura</span>`;
  });

  document.querySelectorAll('.nav-logo img').forEach((img) => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  const heroLogo = document.querySelector('.hero-main-logo');
  if (heroLogo) {
    heroLogo.src = DISCORD_LOGO_URL;
    heroLogo.decoding = 'async';
    heroLogo.fetchPriority = 'high';
  }
};

const initGlobalA11y = () => {
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }

  if (!document.querySelector('.skip-link') && main) {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to content';
    document.body.prepend(skip);
  }
};

const initBackToTop = () => {
  if (document.querySelector('.back-to-top')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.textContent = 'Top';

  const toggleVisibility = () => {
    button.classList.toggle('visible', window.scrollY > 340);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
  document.body.appendChild(button);
};

const initFooterYear = () => {
  document.querySelectorAll('footer p').forEach((line) => {
    if (/©\s*Team Luxura/i.test(line.textContent || '')) {
      line.textContent = `© Team Luxura ${new Date().getFullYear()} — All rights reserved`;
    }
  });
};

const initAmbientParticles = () => {
  const ambient = document.querySelector('.bg-ambient');
  if (!ambient) return;

  if (ambient.dataset.enhanced === 'true') return;
  ambient.dataset.enhanced = 'true';

  const grid = document.createElement('div');
  grid.className = 'ambient-grid';
  ambient.appendChild(grid);

  const beams = document.createElement('div');
  beams.className = 'ambient-beams';
  const beamConfigs = [
    { x: '8%', y: '18%', r: '-19deg', w: '52vw', d: '19s', delay: '-6s' },
    { x: '40%', y: '58%', r: '-28deg', w: '40vw', d: '23s', delay: '-11s' },
    { x: '-6%', y: '72%', r: '-34deg', w: '58vw', d: '21s', delay: '-2s' }
  ];

  beamConfigs.forEach((cfg) => {
    const beam = document.createElement('span');
    beam.className = 'ambient-beam';
    beam.style.setProperty('--beam-x', cfg.x);
    beam.style.setProperty('--beam-y', cfg.y);
    beam.style.setProperty('--beam-r', cfg.r);
    beam.style.setProperty('--beam-w', cfg.w);
    beam.style.setProperty('--beam-dur', cfg.d);
    beam.style.setProperty('--beam-delay', cfg.delay);
    beams.appendChild(beam);
  });
  ambient.appendChild(beams);

  const ring = document.createElement('div');
  ring.className = 'ambient-ring';
  ambient.appendChild(ring);

  const blobConfigs = [
    { x: '14%', y: '24%', size: '280px', dur: '26s', delay: '-7s' },
    { x: '78%', y: '20%', size: '250px', dur: '33s', delay: '-13s' },
    { x: '76%', y: '78%', size: '320px', dur: '30s', delay: '-4s' },
    { x: '20%', y: '76%', size: '260px', dur: '36s', delay: '-16s' }
  ];

  blobConfigs.forEach((cfg) => {
    const blob = document.createElement('div');
    blob.className = 'ambient-blob';
    blob.style.setProperty('--blob-x', cfg.x);
    blob.style.setProperty('--blob-y', cfg.y);
    blob.style.setProperty('--blob-size', cfg.size);
    blob.style.setProperty('--blob-dur', cfg.dur);
    blob.style.setProperty('--blob-delay', cfg.delay);
    ambient.appendChild(blob);
  });

  const particleCount = 18;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'ambient-particle';
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--y', `${Math.random() * 100}%`);
    particle.style.setProperty('--size', `${Math.random() * 8 + 3}px`);
    particle.style.setProperty('--alpha', `${Math.random() * 0.28 + 0.15}`);
    particle.style.setProperty('--dur', `${Math.random() * 12 + 10}s`);
    particle.style.setProperty('--delay', `${Math.random() * -10}s`);
    ambient.appendChild(particle);
  }
};

const clearAmbientParticles = () => {
  const ambient = document.querySelector('.bg-ambient');
  if (!ambient) return;

  ambient.querySelectorAll('.ambient-grid, .ambient-beams, .ambient-ring, .ambient-blob, .ambient-particle')
    .forEach((node) => node.remove());

  delete ambient.dataset.enhanced;
};

const initThemeSettings = () => {
  const body = document.body;
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'default';
  const storedEffects = localStorage.getItem(EFFECTS_STORAGE_KEY);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
  const savedEffects = storedEffects || ((prefersReducedMotion || isSmallScreen) ? 'off' : 'on');

  const applyTheme = (theme, persist = true) => {
    if (theme === 'default') {
      body.removeAttribute('data-theme');
    } else {
      body.setAttribute('data-theme', theme);
    }
    if (persist) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  };

  const applyAmbientEffects = (enabled, persist = true) => {
    if (enabled) {
      body.removeAttribute('data-ambient-effects');
      initAmbientParticles();
    } else {
      body.setAttribute('data-ambient-effects', 'off');
      clearAmbientParticles();
    }

    if (persist) {
      localStorage.setItem(EFFECTS_STORAGE_KEY, enabled ? 'on' : 'off');
    }
  };

  applyTheme(savedTheme, false);
  applyAmbientEffects(savedEffects !== 'off', false);

  const fab = document.createElement('button');
  fab.className = 'settings-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Open appearance settings');
  fab.setAttribute('aria-expanded', 'false');
  fab.textContent = '\u2699';

  const panel = document.createElement('div');
  panel.className = 'settings-panel';
  const themeOptionsMarkup = THEME_OPTIONS
    .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
    .join('');

  panel.innerHTML = `
    <div class="settings-title">Appearance</div>
    <select class="theme-selector" aria-label="Choose color theme">
      ${themeOptionsMarkup}
    </select>
    <div class="settings-row">
      <span class="settings-row-label">Animated Background</span>
      <label class="toggle-switch" aria-label="Toggle animated background effects">
        <input type="checkbox" class="effects-toggle">
        <span class="toggle-slider"></span>
      </label>
    </div>
  `;

  const selector = panel.querySelector('.theme-selector');
  const effectsToggle = panel.querySelector('.effects-toggle');
  selector.value = savedTheme;
  selector.addEventListener('change', (e) => applyTheme(e.target.value));

  effectsToggle.checked = savedEffects !== 'off';
  effectsToggle.addEventListener('change', (e) => {
    applyAmbientEffects(Boolean(e.target.checked));
  });

  fab.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    fab.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== fab) {
      panel.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      panel.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
    }
  });

  body.appendChild(fab);
  body.appendChild(panel);
};

initBranding();
initGlobalA11y();
initBackToTop();
initFooterYear();
initThemeSettings();

/* ==================== NAVBAR SCROLL ==================== */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ==================== ACTIVE NAV LINK ==================== */
const currentPage = window.location.pathname.split('/').pop() || 'Home.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'Home.html')) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

/* ==================== HAMBURGER MENU ==================== */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  if (!mobileMenu.id) {
    mobileMenu.id = 'mobile-menu';
  }

  hamburger.setAttribute('aria-controls', mobileMenu.id);
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');

  const toggleMenu = () => {
    hamburger.classList.toggle('open');
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  };

  hamburger.addEventListener('click', toggleMenu);

  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  });
}

/* ==================== FADE-IN ON SCROLL ==================== */
const observerOptions = {
  threshold: 0.07,
  rootMargin: '0px 0px -35px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ==================== HERO ELEMENTS (immediate) ==================== */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .fade-in').forEach(el => {
    el.classList.add('visible');
  });
  document.querySelectorAll('.page-hero .fade-in').forEach(el => {
    el.classList.add('visible');
  });
});

/* ==================== APPLY FORM ==================== */
const applyForm = document.getElementById('apply-form');
const applyFieldIds = ['f-name', 'f-discord', 'f-role', 'f-age', 'f-country', 'f-message'];

const getFieldValue = (field) => {
  if (!field) return '';
  return field.value ? String(field.value).trim() : '';
};

const validateApplyField = (field) => {
  if (!field) return true;

  const value = getFieldValue(field);
  let valid = Boolean(value);

  if (valid && field.id === 'f-age') {
    const age = Number(value);
    valid = Number.isFinite(age) && age >= 1 && age <= 99;
  }

  field.classList.toggle('field-invalid', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  return valid;
};

const updateApplyProgress = () => {
  const fill = document.getElementById('apply-progress-fill');
  const text = document.getElementById('apply-progress-text');
  const track = document.querySelector('.apply-progress-track');
  if (!fill || !text || !track) return;

  const fields = applyFieldIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!fields.length) return;

  const completed = fields.filter((field) => getFieldValue(field).length > 0).length;
  const percentage = Math.round((completed / fields.length) * 100);

  fill.style.width = `${percentage}%`;
  text.textContent = `${percentage}% complete`;
  track.setAttribute('aria-valuenow', String(percentage));
};

const initApplyFormUx = () => {
  if (!applyForm) return;

  const fields = applyFieldIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const messageField = document.getElementById('f-message');
  let messageCounter = document.getElementById('f-message-counter');

  if (messageField && !messageCounter) {
    messageCounter = document.createElement('p');
    messageCounter.id = 'f-message-counter';
    messageCounter.className = 'form-info form-char-count';
    messageCounter.setAttribute('aria-live', 'polite');
    messageField.insertAdjacentElement('afterend', messageCounter);
  }

  const updateMessageCounter = () => {
    if (!messageField || !messageCounter) return;
    const max = Number(messageField.getAttribute('maxlength') || 1500);
    const current = messageField.value.length;
    messageCounter.textContent = `${current}/${max} characters`;
  };

  try {
    const raw = localStorage.getItem(APPLY_DRAFT_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (saved && typeof saved === 'object') {
      fields.forEach((field) => {
        const savedValue = saved[field.id];
        if (typeof savedValue === 'string') {
          field.value = savedValue;
        }
      });
    }
  } catch {
    // Ignore malformed local storage drafts.
  }

  const persistDraft = () => {
    const draft = fields.reduce((acc, field) => {
      acc[field.id] = field.value || '';
      return acc;
    }, {});
    localStorage.setItem(APPLY_DRAFT_KEY, JSON.stringify(draft));
  };

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      validateApplyField(field);
      updateApplyProgress();
      updateMessageCounter();
      persistDraft();
    });

    field.addEventListener('blur', () => {
      validateApplyField(field);
    });
  });

  updateApplyProgress();
  updateMessageCounter();
};

const initFaqAccordion = () => {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
    });
  });
};

initApplyFormUx();
initFaqAccordion();

const setStatus = (el, type, message) => {
  if (!el) return;
  el.className = `form-status ${type}`;
  el.textContent = message;
};

if (applyForm) {
  applyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = applyForm.querySelector('.form-submit');
    const statusEl = document.getElementById('form-status');
    const original = btn.textContent;

    if (!isApplicationsApiConfigured()) {
      setStatus(statusEl, 'error', 'Application storage is not configured yet. Add your Apps Script URL in script.js.');
      return;
    }

    const payload = {
      name: document.getElementById('f-name')?.value.trim() || '',
      discord: document.getElementById('f-discord')?.value.trim() || '',
      role: document.getElementById('f-role')?.value || '',
      age: Number(document.getElementById('f-age')?.value || 0),
      country: document.getElementById('f-country')?.value.trim() || '',
      message: document.getElementById('f-message')?.value.trim() || ''
    };

    if (!payload.name || !payload.discord || !payload.role || !payload.age || !payload.country || !payload.message) {
      setStatus(statusEl, 'error', 'Please complete all fields before submitting.');
      applyFieldIds.forEach((id) => validateApplyField(document.getElementById(id)));
      return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;
    setStatus(statusEl, 'loading', 'Submitting your application...');

    try {
      const formData = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, String(value)));

      const response = await fetch(APPLICATIONS_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const raw = await response.text();
      let result;
      try {
        result = JSON.parse(raw);
      } catch {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit right now.');
      }

      btn.textContent = 'Application Sent';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      btn.style.boxShadow = '0 0 35px rgba(16, 185, 129, 0.45)';
      setStatus(statusEl, 'success', 'Application received. Staff can now review it in the dashboard.');
      applyForm.reset();
      localStorage.removeItem(APPLY_DRAFT_KEY);
      applyFieldIds.forEach((id) => validateApplyField(document.getElementById(id)));
      updateApplyProgress();
      const messageCounter = document.getElementById('f-message-counter');
      if (messageCounter) {
        messageCounter.textContent = '0/1500 characters';
      }
    } catch (error) {
      setStatus(statusEl, 'error', error.message || 'Submission failed. Please try again.');
    } finally {
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
      }, 2200);
    }
  });
}

/* ==================== STAFF APPLICATION DASHBOARD ==================== */
const staffLoginForm = document.getElementById('staff-login-form');
const STATUS_STORAGE_KEY = 'luxura-application-statuses';
let currentApplications = [];
let currentModalApplicationKey = '';
let pendingDeleteKey = '';

const getStoredStatuses = () => {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const saveStoredStatuses = (value) => {
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(value));
};

const getApplicationKey = (item) => (
  [item.createdAt || item.submittedAt || '', item.name || '', item.discord || '']
    .map((part) => String(part).trim())
    .join('|')
);

const isDeclinedStatus = (status) => String(status).trim().toLowerCase() === 'declined';

const getApplicationStatus = (item) => {
  const key = getApplicationKey(item);
  const statuses = getStoredStatuses();
  return statuses[key] || 'Pending/Waiting';
};

const setApplicationStatus = (item, status) => {
  const key = getApplicationKey(item);
  const statuses = getStoredStatuses();
  statuses[key] = status;
  saveStoredStatuses(statuses);
};

const getApplicationStatusByKey = (key) => {
  const statuses = getStoredStatuses();
  return statuses[String(key || '')] || 'Pending/Waiting';
};

const setApplicationStatusByKey = (key, status) => {
  const normalizedKey = String(key || '');
  if (!normalizedKey) return;
  const statuses = getStoredStatuses();
  statuses[normalizedKey] = status;
  saveStoredStatuses(statuses);
};

const closeDeleteConfirm = () => {
  const modal = document.getElementById('delete-confirm-modal');
  if (!modal) return;
  modal.hidden = true;
  pendingDeleteKey = '';
  const yesBtn = document.getElementById('delete-confirm-yes');
  const noBtn = document.getElementById('delete-confirm-no');
  if (yesBtn) yesBtn.disabled = false;
  if (noBtn) noBtn.disabled = false;
};

const openDeleteConfirm = (key) => {
  const modal = document.getElementById('delete-confirm-modal');
  if (!modal) return;
  pendingDeleteKey = key;
  const statusEl = document.getElementById('delete-confirm-status');
  if (statusEl) {
    statusEl.textContent = '';
    statusEl.className = 'form-status';
  }
  modal.hidden = false;
};

const deleteApplicationByKey = async (key) => {
  const yesBtn = document.getElementById('delete-confirm-yes');
  const noBtn = document.getElementById('delete-confirm-no');
  const statusEl = document.getElementById('delete-confirm-status');

  const item = currentApplications.find((a) => getApplicationKey(a) === key);
  if (!item) {
    closeDeleteConfirm();
    return;
  }

  const username = sessionStorage.getItem('luxura-staff-username') || '';
  const password = sessionStorage.getItem('luxura-staff-password') || '';

  if (yesBtn) yesBtn.disabled = true;
  if (noBtn) noBtn.disabled = true;
  setStatus(statusEl, 'loading', 'Deleting...');

  try {
    const targetUrl = `${APPLICATIONS_API_BASE}?action=delete&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(item.name || '')}&discord=${encodeURIComponent(item.discord || '')}`;
    const response = await fetch(targetUrl);
    const raw = await response.text();
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error('Server returned an invalid response.');
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Delete failed.');
    }

    currentApplications = currentApplications.filter((a) => getApplicationKey(a) !== key);
    const statuses = getStoredStatuses();
    delete statuses[key];
    saveStoredStatuses(statuses);

    fillApplicationsTable(currentApplications);

    const meta = document.getElementById('applications-meta');
    if (meta) {
      meta.textContent = `${currentApplications.length} application${currentApplications.length === 1 ? '' : 's'} loaded. Last refresh: ${new Date().toLocaleTimeString()}`;
    }

    closeDeleteConfirm();
  } catch (error) {
    if (yesBtn) yesBtn.disabled = false;
    if (noBtn) noBtn.disabled = false;
    setStatus(statusEl, 'error', error.message || 'Delete failed. Please try again.');
  }
};

const bindDeleteConfirmEvents = () => {
  const noBtn = document.getElementById('delete-confirm-no');
  const yesBtn = document.getElementById('delete-confirm-yes');
  const backdrop = document.getElementById('delete-confirm-backdrop');

  if (noBtn) {
    noBtn.addEventListener('click', closeDeleteConfirm);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeDeleteConfirm);
  }
  if (yesBtn) {
    yesBtn.addEventListener('click', async () => {
      if (!pendingDeleteKey) return;
      await deleteApplicationByKey(pendingDeleteKey);
    });
  }
};

const closeApplicationModal = () => {
  const modal = document.getElementById('application-modal');
  if (!modal) return;
  modal.hidden = true;
  currentModalApplicationKey = '';
};

const updateModalStatusFeedback = (message, type = 'success') => {
  const feedback = document.getElementById('modal-status-feedback');
  if (!feedback) return;
  setStatus(feedback, type, message);
};

const getCurrentModalApplication = () => (
  currentApplications.find((entry) => getApplicationKey(entry) === currentModalApplicationKey)
);

const syncApplicationModalControls = (status) => {
  const statusSelect = document.getElementById('modal-status');
  const approveCloseButton = document.getElementById('modal-approve-close');
  const declined = isDeclinedStatus(status);

  if (statusSelect) {
    statusSelect.disabled = declined;
  }

  if (approveCloseButton) {
    approveCloseButton.hidden = declined;
    approveCloseButton.disabled = declined;
  }
};

const openApplicationModal = (index) => {
  const modal = document.getElementById('application-modal');
  const statusSelect = document.getElementById('modal-status');
  const item = currentApplications[index];

  if (!modal || !statusSelect || !item) return;

  currentModalApplicationKey = getApplicationKey(item);

  const fields = {
    'modal-submitted': formatDate(item.createdAt || item.submittedAt),
    'modal-name': item.name || '-',
    'modal-discord': item.discord || '-',
    'modal-role': item.role || '-',
    'modal-age': item.age || '-',
    'modal-country': item.country || '-',
    'modal-message': item.message || '-'
  };

  Object.entries(fields).forEach(([id, value]) => {
    const target = document.getElementById(id);
    if (target) target.textContent = String(value);
  });

  const status = getApplicationStatus(item);

  statusSelect.value = status;
  syncApplicationModalControls(status);
  updateModalStatusFeedback(
    isDeclinedStatus(status)
      ? 'This application is declined and locked.'
      : 'Status changes save automatically until the application is declined.',
    'loading'
  );
  modal.hidden = false;
};

const bindApplicationModalEvents = () => {
  const modal = document.getElementById('application-modal');
  const closeButton = document.getElementById('application-modal-close');
  const closeOnlyButton = document.getElementById('modal-close-only');
  const backdrop = document.getElementById('application-modal-backdrop');
  const statusSelect = document.getElementById('modal-status');
  const approveCloseButton = document.getElementById('modal-approve-close');

  if (!modal) return;

  if (closeButton) {
    closeButton.addEventListener('click', closeApplicationModal);
  }

  if (closeOnlyButton) {
    closeOnlyButton.addEventListener('click', closeApplicationModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeApplicationModal);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeApplicationModal();
    }
  });

  if (statusSelect) {
    statusSelect.addEventListener('change', () => {
      if (!currentModalApplicationKey) return;
      const nextStatus = statusSelect.value;

      setApplicationStatusByKey(currentModalApplicationKey, nextStatus);
      fillApplicationsTable(currentApplications);
      syncApplicationModalControls(nextStatus);
      updateModalStatusFeedback(
        isDeclinedStatus(nextStatus)
          ? 'Saved as Declined. This application is now locked.'
          : `Saved as ${nextStatus}.`,
        'success'
      );
    });
  }

  if (approveCloseButton && statusSelect) {
    approveCloseButton.addEventListener('click', () => {
      if (!currentModalApplicationKey) {
        closeApplicationModal();
        return;
      }

      if (isDeclinedStatus(getApplicationStatusByKey(currentModalApplicationKey))) {
        closeApplicationModal();
        return;
      }

      statusSelect.value = 'Approved';
      setApplicationStatusByKey(currentModalApplicationKey, 'Approved');
      fillApplicationsTable(currentApplications);
      syncApplicationModalControls('Approved');
      updateModalStatusFeedback('Saved as Approved.', 'success');
      closeApplicationModal();
    });
  }
};

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Unknown';
  return parsed.toLocaleString();
};

const fillApplicationsTable = (applications) => {
  const tableBody = document.getElementById('applications-body');
  const emptyNotice = document.getElementById('applications-empty');

  if (!tableBody || !emptyNotice) return;

  tableBody.innerHTML = '';

  if (!applications.length) {
    emptyNotice.hidden = false;
    return;
  }

  emptyNotice.hidden = true;
  currentApplications = applications;

  applications.forEach((item, index) => {
    const row = document.createElement('tr');
    row.className = 'application-row';

    const statusLabel = getApplicationStatus(item);
    const normalizedStatus = String(statusLabel).toLowerCase();
    const isDeclined = isDeclinedStatus(normalizedStatus);

    if (!isDeclined) {
      row.tabIndex = 0;
      row.setAttribute('role', 'button');
      row.setAttribute('aria-label', `Open application from ${item.name || 'Unknown applicant'}`);
    } else {
      row.classList.add('application-row-locked');
      row.setAttribute('aria-label', `Application from ${item.name || 'Unknown applicant'} is declined and locked`);
    }

    if (normalizedStatus === 'pending/waiting') {
      row.classList.add('application-row-pending');
    }
    if (normalizedStatus === 'approved') {
      row.classList.add('application-row-approved');
    }
    if (normalizedStatus === 'declined') {
      row.classList.add('application-row-declined');
    }

    const fields = [
      formatDate(item.createdAt || item.submittedAt),
      item.name || '-',
      item.discord || '-',
      item.role || '-',
      statusLabel,
      item.age || '-',
      item.country || '-',
      item.message || '-'
    ];

    fields.forEach((text, index) => {
      const cell = document.createElement('td');
      cell.textContent = String(text);
      if (index === fields.length - 1) {
        cell.className = 'applications-message-cell';
      }
      if (index === 4) {
        cell.className = 'applications-status-cell';
        if (normalizedStatus === 'approved') {
          cell.classList.add('applications-status-approved');
        }
        if (normalizedStatus === 'declined') {
          cell.classList.add('applications-status-declined');
        }
        if (normalizedStatus === 'pending/waiting') {
          cell.classList.add('applications-status-pending');
        }
      }
      row.appendChild(cell);
    });

    const deleteCell = document.createElement('td');
    deleteCell.className = 'application-delete-cell';
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn application-delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete application from ${item.name || 'Unknown applicant'}`);
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeleteConfirm(getApplicationKey(item));
    });
    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);

    if (!isDeclined) {
      row.addEventListener('click', () => openApplicationModal(index));
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openApplicationModal(index);
        }
      });
    }

    tableBody.appendChild(row);
  });
};

const loadApplications = async (username, password) => {
  const meta = document.getElementById('applications-meta');
  const loginStatus = document.getElementById('staff-login-status');
  const loginCard = document.getElementById('staff-login-card');
  const panel = document.getElementById('applications-panel');

  if (!meta || !panel || !loginCard) return;

  if (!isApplicationsApiConfigured()) {
    setStatus(loginStatus, 'error', 'Dashboard API is not configured yet. Add your Apps Script URL in script.js.');
    return;
  }

  meta.textContent = 'Loading applications...';

  try {
    const targetUrl = `${APPLICATIONS_API_BASE}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const response = await fetch(targetUrl);
    const raw = await response.text();
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error('Server returned an invalid response.');
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Invalid password or access denied.');
    }

    const list = Array.isArray(result.data) ? result.data : [];
    fillApplicationsTable(list);
    meta.textContent = `${list.length} application${list.length === 1 ? '' : 's'} loaded. Last refresh: ${new Date().toLocaleTimeString()}`;
    loginCard.hidden = true;
    panel.hidden = false;
    setStatus(loginStatus, 'success', 'Access granted.');
    sessionStorage.setItem('luxura-staff-username', username);
    sessionStorage.setItem('luxura-staff-password', password);
  } catch (error) {
    const message = error.message || 'Failed to load applications.';
    if (message.toLowerCase().includes('access denied')) {
      setStatus(loginStatus, 'error', 'Access denied. Verify username is allowed and password is correct.');
      return;
    }
    setStatus(loginStatus, 'error', message);
  }
};

if (staffLoginForm) {
  bindApplicationModalEvents();
  bindDeleteConfirmEvents();

  const loginCard = document.getElementById('staff-login-card');
  const panel = document.getElementById('applications-panel');
  const modal = document.getElementById('application-modal');
  if (loginCard) loginCard.hidden = false;
  if (panel) panel.hidden = true;
  if (modal) modal.hidden = true;
  closeApplicationModal();

  staffLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('staff-username');
    const passwordInput = document.getElementById('staff-password');
    const loginStatus = document.getElementById('staff-login-status');
    const username = usernameInput?.value.trim() || '';
    const password = passwordInput?.value.trim() || '';

    if (!username || !password) {
      setStatus(loginStatus, 'error', 'Enter both username and password to continue.');
      return;
    }

    setStatus(loginStatus, 'loading', 'Checking access...');
    await loadApplications(username, password);
  });

  const refreshButton = document.getElementById('refresh-applications');
  if (refreshButton) {
    refreshButton.addEventListener('click', async () => {
      const savedUsername = sessionStorage.getItem('luxura-staff-username') || '';
      const savedPassword = sessionStorage.getItem('luxura-staff-password') || '';
      if (!savedUsername || !savedPassword) return;
      await loadApplications(savedUsername, savedPassword);
    });
  }
}

/* ==================== ROSTER SEARCH (if present) ==================== */
const rosterSearch = document.getElementById('roster-search');
const rosterRoleFilter = document.getElementById('roster-role-filter');
const rosterEmptyState = document.getElementById('roster-empty');

const normalizeRole = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const cleanRosterNames = () => {
  document.querySelectorAll('.member-card .member-flag').forEach((flag) => flag.remove());

  document.querySelectorAll('.member-name').forEach((nameEl) => {
    const original = nameEl.textContent || '';
    const cleaned = original
      .replace(/^[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\s]+/gu, '')
      .replace(/^[A-Za-z]{1,4}\s*[|\-_:~\/]+\s*/u, '')
      .trim();
    nameEl.textContent = cleaned || original.trim();
  });
};

if (document.querySelector('.members-grid')) {
  cleanRosterNames();

  document.querySelectorAll('.roster-section').forEach((section) => {
    const heading = section.querySelector('.role-header h2');
    section.dataset.role = normalizeRole(heading?.textContent || '');
    const cards = section.querySelectorAll('.member-card').length;
    section.dataset.totalMembers = String(cards);
  });
}

const filterRoster = () => {
  if (!document.querySelector('.members-grid')) return;

  const query = (rosterSearch?.value || '').toLowerCase().trim();
  const selectedRole = normalizeRole(rosterRoleFilter?.value || 'all');
  let visibleSections = 0;

  document.querySelectorAll('.roster-section').forEach((section) => {
    const sectionRole = section.dataset.role || '';
    const roleMatch = selectedRole === 'all' || sectionRole.includes(selectedRole);

    section.querySelectorAll('.member-card').forEach((card) => {
      const name = card.querySelector('.member-name')?.textContent.toLowerCase() || '';
      const visible = roleMatch && (!query || name.includes(query));
      card.style.display = visible ? '' : 'none';
    });

    const hasVisibleMembers = [...section.querySelectorAll('.member-card')]
      .some((c) => c.style.display !== 'none');

    const visibleMembers = [...section.querySelectorAll('.member-card')]
      .filter((c) => c.style.display !== 'none').length;

    const countLabel = section.querySelector('.member-count');
    const totalMembers = Number(section.dataset.totalMembers || visibleMembers);
    if (countLabel) {
      countLabel.textContent = selectedRole === 'all' && !query
        ? `${totalMembers} member${totalMembers === 1 ? '' : 's'}`
        : `${visibleMembers}/${totalMembers} visible`;
    }

    section.style.display = hasVisibleMembers ? '' : 'none';
    if (hasVisibleMembers) visibleSections += 1;
  });

  if (rosterEmptyState) {
    rosterEmptyState.hidden = visibleSections > 0;
  }
};

if (rosterSearch) {
  rosterSearch.addEventListener('input', filterRoster);
}

if (rosterRoleFilter) {
  rosterRoleFilter.addEventListener('change', filterRoster);
}

if (rosterSearch || rosterRoleFilter) {
  filterRoster();
}
