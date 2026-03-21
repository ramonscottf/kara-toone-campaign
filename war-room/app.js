// ──────────────────────────────────────────────
// Campaign Connect — War Room Dashboard Logic
// Vanilla JS, no build step. Connects to /api/* endpoints.
// ──────────────────────────────────────────────

const app = {
  // ── State ─────────────────────────────────
  state: {
    currentTab: 'dashboard',
    contacts: [],
    totalContacts: 0,
    filters: { search: '', support_level: '', type: '' },
    loading: false,
  },

  // ── Color maps ────────────────────────────
  supportColors: {
    strong_support: '#2e7d32',
    leaning_support: '#66bb6a',
    undecided: '#9e9e9e',
    leaning_opponent: '#ff9800',
    strong_opponent: '#f44336',
    no_contact: '#e0e0e0',
    '': '#e0e0e0',
  },

  supportLabels: {
    strong_support: 'Strong Support',
    leaning_support: 'Leaning Support',
    undecided: 'Undecided',
    leaning_opponent: 'Leaning Opponent',
    strong_opponent: 'Strong Opponent',
    no_contact: 'No Contact',
    '': 'No Contact',
  },

  typeColors: {
    delegate: '#1a237e',
    volunteer: '#E91E63',
    donor: '#ff9800',
    yardsign: '#2e7d32',
    supporter: '#9c27b0',
    '': '#9e9e9e',
  },

  // ── Initialize ────────────────────────────
  async init() {
    this.bindTabs();
    this.bindSearch();
    this.bindFilters();
    this.bindBlast();
    await this.loadContacts();
    this.renderDashboard();
    this.renderForms();
    this.renderSettings();
    this.hideLoading();
  },

  // ── Tab Navigation ────────────────────────
  bindTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });
  },

  switchTab(tabName) {
    this.state.currentTab = tabName;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.view').forEach(view => {
      view.classList.toggle('active', view.id === tabName + '-view');
    });

    if (tabName === 'dashboard') this.renderDashboard();
    if (tabName === 'contacts') this.renderContactsTable();
  },

  // ── API Helper ────────────────────────────
  async apiCall(method, path, body) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(path, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  },

  // ── Loading ───────────────────────────────
  showLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('hidden');
  },

  hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.add('hidden');
  },

  // ── Toast ─────────────────────────────────
  showToast(message, type) {
    type = type || 'success';
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      padding:12px 20px;border-radius:8px;color:#fff;font-size:14px;font-weight:500;
      box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:opacity 0.3s;
      background:${type === 'error' ? '#f44336' : '#2e7d32'};
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // ── Load Contacts ─────────────────────────
  async loadContacts() {
    try {
      const params = new URLSearchParams();
      if (this.state.filters.search) params.set('search', this.state.filters.search);
      if (this.state.filters.support_level) params.set('support', this.state.filters.support_level);
      if (this.state.filters.type) params.set('type', this.state.filters.type);

      const qs = params.toString();
      const data = await this.apiCall('GET', '/api/contacts' + (qs ? '?' + qs : ''));
      this.state.contacts = data.contacts || [];
      this.state.totalContacts = data.count || this.state.contacts.length;
    } catch (err) {
      console.error('Failed to load contacts:', err);
      this.state.contacts = [];
      this.state.totalContacts = 0;
    }
  },

  // ── Dashboard ─────────────────────────────
  renderDashboard() {
    const contacts = this.state.contacts;

    const stats = {
      total: contacts.length,
      delegates: contacts.filter(c => (c.type || '').includes('delegate')).length,
      strong_support: contacts.filter(c => c.support_level === 'strong_support').length,
      leaning_support: contacts.filter(c => c.support_level === 'leaning_support').length,
      undecided: contacts.filter(c => !c.support_level || c.support_level === 'undecided').length,
      volunteers: contacts.filter(c => (c.type || '').includes('volunteer')).length,
      yard_signs: contacts.filter(c => (c.type || '').includes('yardsign') || (c.source || '').includes('yardsign')).length,
      donors: contacts.filter(c => (c.type || '').includes('donor')).length,
    };

    // Stat cards
    const cardData = [
      { label: 'Total Contacts', value: stats.total, color: '#1a237e', filter: '' },
      { label: 'Delegates', value: stats.delegates, color: '#1a237e', filter: 'delegate' },
      { label: 'Strong Support', value: stats.strong_support, color: '#2e7d32', filter: 'strong_support', filterType: 'support' },
      { label: 'Leaning Support', value: stats.leaning_support, color: '#66bb6a', filter: 'leaning_support', filterType: 'support' },
      { label: 'Volunteers', value: stats.volunteers, color: '#E91E63', filter: 'volunteer' },
      { label: 'Yard Signs', value: stats.yard_signs, color: '#2e7d32', filter: 'yardsign' },
      { label: 'Donors', value: stats.donors, color: '#ff9800', filter: 'donor' },
    ];

    const cardsEl = document.getElementById('stat-cards');
    if (cardsEl) {
      cardsEl.innerHTML = cardData.map(c => `
        <div class="stat-card" data-filter="${c.filter}" data-filter-type="${c.filterType || 'type'}"
             style="border-top:4px solid ${c.color};cursor:pointer">
          <div class="stat-label">${c.label}</div>
          <div class="stat-value" style="color:${c.color}">${c.value}</div>
        </div>
      `).join('');

      cardsEl.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
          const filter = card.dataset.filter;
          const filterType = card.dataset.filterType;
          if (!filter) {
            this.state.filters = { search: '', support_level: '', type: '' };
          } else if (filterType === 'support') {
            this.state.filters.support_level = filter;
            this.state.filters.type = '';
          } else {
            this.state.filters.type = filter;
            this.state.filters.support_level = '';
          }
          this.switchTab('contacts');
          this.loadContacts().then(() => this.renderContactsTable());
        });
      });
    }

    // Support breakdown chart
    const breakdown = [
      { key: 'strong_support', count: stats.strong_support },
      { key: 'leaning_support', count: stats.leaning_support },
      { key: 'undecided', count: stats.undecided },
      { key: 'leaning_opponent', count: contacts.filter(c => c.support_level === 'leaning_opponent').length },
      { key: 'strong_opponent', count: contacts.filter(c => c.support_level === 'strong_opponent').length },
      { key: 'no_contact', count: contacts.filter(c => c.support_level === 'no_contact').length },
    ];

    const chartEl = document.getElementById('support-chart');
    if (chartEl) {
      const maxCount = Math.max(...breakdown.map(b => b.count), 1);
      chartEl.innerHTML = breakdown.map(b => `
        <div class="chart-row">
          <span class="chart-label">${this.supportLabels[b.key]}</span>
          <div class="chart-bar-wrap">
            <div class="chart-bar" style="width:${(b.count / maxCount) * 100}%;background:${this.supportColors[b.key]}"></div>
          </div>
          <span class="chart-count">${b.count}</span>
        </div>
      `).join('');
    }
  },

  // ── Contacts Table ────────────────────────
  renderContactsTable() {
    const contacts = this.state.contacts;
    const tbody = document.getElementById('contacts-tbody');
    const countEl = document.getElementById('contacts-count');

    if (countEl) countEl.textContent = `${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`;

    if (!tbody) return;

    if (contacts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#9e9e9e">No contacts found</td></tr>';
      return;
    }

    tbody.innerHTML = contacts.map(c => {
      const name = ((c.first_name || '') + ' ' + (c.last_name || '')).trim() || '—';
      const supportKey = c.support_level || '';
      const supportColor = this.supportColors[supportKey] || '#e0e0e0';
      const supportText = this.supportLabels[supportKey] || 'No Contact';
      const primaryType = (c.type || '').split(',')[0].trim();
      const typeColor = this.typeColors[primaryType] || '#9e9e9e';

      return `<tr>
        <td><strong>${this.escapeHtml(name)}</strong></td>
        <td>${this.escapeHtml(c.email || '—')}</td>
        <td>${this.escapeHtml(c.phone || '—')}</td>
        <td>${this.escapeHtml(c.precinct || '—')}</td>
        <td><span class="pill" style="background:${typeColor}">${this.escapeHtml(primaryType || '—')}</span></td>
        <td>
          <select class="support-select" data-id="${c.id}" style="border-color:${supportColor}">
            <option value="">No Contact</option>
            <option value="strong_support"${supportKey === 'strong_support' ? ' selected' : ''}>Strong Support</option>
            <option value="leaning_support"${supportKey === 'leaning_support' ? ' selected' : ''}>Leaning Support</option>
            <option value="undecided"${supportKey === 'undecided' ? ' selected' : ''}>Undecided</option>
            <option value="leaning_opponent"${supportKey === 'leaning_opponent' ? ' selected' : ''}>Leaning Opponent</option>
            <option value="strong_opponent"${supportKey === 'strong_opponent' ? ' selected' : ''}>Strong Opponent</option>
          </select>
        </td>
        <td>${this.escapeHtml(c.priority || '—')}</td>
        <td>
          <button class="btn-small btn-danger" data-delete="${c.id}" title="Delete">X</button>
        </td>
      </tr>`;
    }).join('');

    // Bind support level changes
    tbody.querySelectorAll('.support-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const id = e.target.dataset.id;
        try {
          await this.apiCall('PATCH', '/api/contacts/' + id, { support_level: e.target.value });
          this.showToast('Support level updated');
          const contact = this.state.contacts.find(c => c.id === id);
          if (contact) contact.support_level = e.target.value;
        } catch (err) {
          this.showToast('Update failed: ' + err.message, 'error');
        }
      });
    });

    // Bind delete buttons
    tbody.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.delete;
        if (!confirm('Delete this contact?')) return;
        try {
          await this.apiCall('DELETE', '/api/contacts/' + id);
          this.showToast('Contact deleted');
          await this.loadContacts();
          this.renderContactsTable();
        } catch (err) {
          this.showToast('Delete failed: ' + err.message, 'error');
        }
      });
    });
  },

  // ── Search ────────────────────────────────
  bindSearch() {
    const input = document.getElementById('contacts-search');
    if (!input) return;

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        this.state.filters.search = input.value;
        await this.loadContacts();
        this.renderContactsTable();
      }, 300);
    });
  },

  // ── Filters ───────────────────────────────
  bindFilters() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', async () => {
        const filterType = pill.dataset.filterType || 'type';
        const filterValue = pill.dataset.filter || '';

        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        if (filterType === 'support') {
          this.state.filters.support_level = filterValue;
          this.state.filters.type = '';
        } else {
          this.state.filters.type = filterValue;
          this.state.filters.support_level = '';
        }

        await this.loadContacts();
        this.renderContactsTable();
      });
    });
  },

  // ── Blast ─────────────────────────────────
  bindBlast() {
    const channelRadios = document.querySelectorAll('input[name="blast-channel"]');
    const subjectRow = document.getElementById('subject-row');
    const textarea = document.getElementById('blast-message');
    const charCounter = document.getElementById('char-counter');
    const sendBtn = document.getElementById('send-blast-btn');
    const costEstimate = document.getElementById('cost-estimate');

    // Channel toggle (show/hide subject line for email)
    channelRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const isEmail = radio.value === 'email';
        if (subjectRow) subjectRow.style.display = isEmail ? '' : 'none';
        if (charCounter) charCounter.style.display = isEmail ? 'none' : '';
        if (costEstimate) {
          costEstimate.textContent = isEmail
            ? 'Resend: Free up to 3,000/month'
            : 'Twilio: ~$0.008 per text';
        }
      });
    });

    // Character counter for SMS
    if (textarea && charCounter) {
      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        charCounter.textContent = len + '/160';
        charCounter.style.color = len > 160 ? '#f44336' : len > 140 ? '#ff9800' : '#9e9e9e';
      });
    }

    // Send blast
    if (sendBtn) {
      sendBtn.addEventListener('click', async () => {
        const channel = document.querySelector('input[name="blast-channel"]:checked');
        const audience = document.querySelector('input[name="blast-audience"]:checked');
        const message = textarea ? textarea.value.trim() : '';
        const subject = document.getElementById('blast-subject');

        if (!channel || !audience) {
          this.showToast('Select a channel and audience', 'error');
          return;
        }
        if (!message) {
          this.showToast('Enter a message', 'error');
          return;
        }

        const isEmail = channel.value === 'email';
        if (isEmail && subject && !subject.value.trim()) {
          this.showToast('Enter a subject line', 'error');
          return;
        }

        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

        try {
          let result;
          if (isEmail) {
            result = await this.apiCall('POST', '/api/messages/email', {
              audience: audience.value,
              subject: subject.value.trim(),
              body: message,
            });
          } else {
            result = await this.apiCall('POST', '/api/messages/sms', {
              audience: audience.value,
              message: message,
            });
          }

          const msg = `Sent: ${result.sent || 0}, Failed: ${result.failed || 0}`;
          this.showToast(msg, result.failed > 0 ? 'error' : 'success');
        } catch (err) {
          this.showToast('Send failed: ' + err.message, 'error');
        } finally {
          sendBtn.disabled = false;
          sendBtn.textContent = 'Send Blast';
        }
      });
    }
  },

  // ── Forms ─────────────────────────────────
  renderForms() {
    const formCards = document.querySelectorAll('.form-card');
    formCards.forEach(card => {
      const embedBtn = card.querySelector('.embed-toggle');
      const embedCode = card.querySelector('.embed-code');
      if (embedBtn && embedCode) {
        embedBtn.addEventListener('click', () => {
          const visible = embedCode.style.display !== 'none';
          embedCode.style.display = visible ? 'none' : 'block';
          embedBtn.textContent = visible ? 'Show Embed Code' : 'Hide Embed Code';
        });
      }
    });
  },

  // ── Settings ──────────────────────────────
  renderSettings() {
    // Settings are read-only — just informational about env vars needed
  },

  // ── Utilities ─────────────────────────────
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },
};

// ── Boot ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => app.init());

// Expose for inline handlers
window.app = app;
