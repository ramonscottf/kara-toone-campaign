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
    filters: { search: '', support_level: '', precinct: '' },
    loading: false,
  },

  // ── Color maps (matching sheet Status values) ──
  supportColors: {
    'Confirmed Kara': '#2e7d32',
    'Maybe Kara': '#66bb6a',
    'Confirmed Not Kara': '#f44336',
    'Unknown': '#9e9e9e',
    '': '#e0e0e0',
  },

  supportLabels: {
    'Confirmed Kara': 'Confirmed Kara',
    'Maybe Kara': 'Maybe Kara',
    'Confirmed Not Kara': 'Confirmed Not Kara',
    'Unknown': 'Unknown',
    '': 'Unknown',
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
      if (this.state.filters.precinct) params.set('precinct', this.state.filters.precinct);

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
      confirmed_kara: contacts.filter(c => c.support_level === 'Confirmed Kara').length,
      maybe_kara: contacts.filter(c => c.support_level === 'Maybe Kara').length,
      confirmed_not: contacts.filter(c => c.support_level === 'Confirmed Not Kara').length,
      unknown: contacts.filter(c => !c.support_level || c.support_level === 'Unknown').length,
      contacted: contacts.filter(c => {
        var v = (c.contacted || '').toLowerCase();
        return v === 'yes' || v === 'true' || v === '1';
      }).length,
      has_email: contacts.filter(c => c.email && c.email.trim()).length,
      has_phone: contacts.filter(c => c.phone && c.phone.trim()).length,
    };

    // Stat cards
    const cardData = [
      { label: 'Total Delegates', value: stats.total, color: '#1a237e', filter: '' },
      { label: 'Confirmed Kara', value: stats.confirmed_kara, color: '#2e7d32', filter: 'Confirmed Kara', filterType: 'support' },
      { label: 'Maybe Kara', value: stats.maybe_kara, color: '#66bb6a', filter: 'Maybe Kara', filterType: 'support' },
      { label: 'Not Kara', value: stats.confirmed_not, color: '#f44336', filter: 'Confirmed Not Kara', filterType: 'support' },
      { label: 'Unknown', value: stats.unknown, color: '#9e9e9e', filter: 'Unknown', filterType: 'support' },
      { label: 'Contacted', value: stats.contacted, color: '#1565c0', filter: '' },
      { label: 'Has Email', value: stats.has_email, color: '#7b1fa2', filter: '' },
      { label: 'Has Phone', value: stats.has_phone, color: '#e65100', filter: '' },
    ];

    const cardsEl = document.getElementById('stat-cards');
    if (cardsEl) {
      cardsEl.innerHTML = cardData.map(c => `
        <div class="stat-card" data-filter="${c.filter}" data-filter-type="${c.filterType || ''}"
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
            this.state.filters = { search: '', support_level: '', precinct: '' };
          } else if (filterType === 'support') {
            this.state.filters.support_level = filter;
            this.state.filters.precinct = '';
          }
          this.switchTab('contacts');
          this.loadContacts().then(() => this.renderContactsTable());
        });
      });
    }

    // Support breakdown chart
    const breakdown = [
      { key: 'Confirmed Kara', count: stats.confirmed_kara },
      { key: 'Maybe Kara', count: stats.maybe_kara },
      { key: 'Unknown', count: stats.unknown },
      { key: 'Confirmed Not Kara', count: stats.confirmed_not },
    ];

    const chartEl = document.getElementById('support-chart');
    if (chartEl) {
      const maxCount = Math.max(...breakdown.map(b => b.count), 1);
      chartEl.innerHTML = breakdown.map(b => `
        <div class="chart-row">
          <span class="chart-label">${this.supportLabels[b.key] || b.key}</span>
          <div class="chart-bar-wrap">
            <div class="chart-bar" style="width:${(b.count / maxCount) * 100}%;background:${this.supportColors[b.key] || '#9e9e9e'}"></div>
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

    if (countEl) countEl.textContent = `${contacts.length} delegate${contacts.length !== 1 ? 's' : ''}`;

    if (!tbody) return;

    if (contacts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#9e9e9e">No contacts found</td></tr>';
      return;
    }

    tbody.innerHTML = contacts.map(c => {
      const name = ((c.first_name || '') + ' ' + (c.last_name || '')).trim() || '—';
      const supportKey = c.support_level || 'Unknown';
      const supportColor = this.supportColors[supportKey] || '#e0e0e0';
      const contacted = (c.contacted || '').toLowerCase();
      const isContacted = contacted === 'yes' || contacted === 'true' || contacted === '1';

      return `<tr>
        <td><strong>${this.escapeHtml(name)}</strong></td>
        <td>${this.escapeHtml(c.precinct || '—')}</td>
        <td>${this.escapeHtml(c.email || '—')}</td>
        <td>${this.escapeHtml(c.phone || '—')}</td>
        <td>
          <select class="support-select" data-id="${c.id}" style="border-color:${supportColor}">
            <option value="Unknown"${supportKey === 'Unknown' ? ' selected' : ''}>Unknown</option>
            <option value="Confirmed Kara"${supportKey === 'Confirmed Kara' ? ' selected' : ''}>Confirmed Kara</option>
            <option value="Maybe Kara"${supportKey === 'Maybe Kara' ? ' selected' : ''}>Maybe Kara</option>
            <option value="Confirmed Not Kara"${supportKey === 'Confirmed Not Kara' ? ' selected' : ''}>Confirmed Not Kara</option>
          </select>
        </td>
        <td><span class="pill" style="background:${isContacted ? '#2e7d32' : '#9e9e9e'}">${isContacted ? 'Yes' : 'No'}</span></td>
        <td>${this.escapeHtml(c.county_delegate || '—')}</td>
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
          this.showToast('Status updated');
          const contact = this.state.contacts.find(c => c.id === id);
          if (contact) contact.support_level = e.target.value;
          this.renderDashboard();
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
        const filterType = pill.dataset.filterType || 'support';
        const filterValue = pill.dataset.filter || '';

        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        if (filterType === 'support') {
          this.state.filters.support_level = filterValue;
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
