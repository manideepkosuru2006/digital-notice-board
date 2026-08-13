import { store } from '../store.js';
import { renderNoticeForm } from './NoticeForm.js';
import { renderNoticeModal } from './NoticeModal.js';
import { printOfficialNotice } from '../utils/printNotice.js';

export function renderAdminDashboard(container) {
  const analytics = store.getAnalytics();
  const currentUser = store.currentUser;
  let activeTab = 'All'; // 'All', 'Published', 'Draft', 'Archived'
  let searchQuery = '';

  function renderTable() {
    let notices = store.notices;

    if (activeTab !== 'All') {
      notices = notices.filter(n => n.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      notices = notices.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.refNumber.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q)
      );
    }

    const tableContainer = container.querySelector('#admin-table-container');
    if (!tableContainer) return;

    if (notices.length === 0) {
      tableContainer.innerHTML = `
        <div class="empty-table-state">
          <p>No notices match the selected criteria.</p>
        </div>
      `;
      return;
    }

    tableContainer.innerHTML = `
      <table class="admin-data-table">
        <thead>
          <tr>
            <th>Ref & Priority</th>
            <th>Announcement Title</th>
            <th>Target Scope</th>
            <th>Status</th>
            <th>Views</th>
            <th>Published Date</th>
            <th class="text-right">Manage Actions</th>
          </tr>
        </thead>
        <tbody>
          ${notices.map(notice => `
            <tr class="${notice.isPinned ? 'table-row-pinned' : ''}">
              <td>
                <div class="table-ref-col">
                  <span class="ref-tag">${notice.refNumber || 'REF: OFF'}</span>
                  <span class="priority-pill priority-${notice.priority.toLowerCase()}">
                    ${notice.priority}
                  </span>
                </div>
              </td>
              <td>
                <div class="table-title-col">
                  ${notice.isPinned ? '📌 ' : ''}
                  <span class="table-notice-title" data-id="${notice.id}">${notice.title}</span>
                  <span class="table-author-sub">By ${notice.author} (${notice.authorRole})</span>
                </div>
              </td>
              <td>
                <div class="table-scope-col">
                  <span class="scope-pill-sm">${notice.category}</span>
                  <span class="scope-sub">${notice.department} • ${notice.targetYear}</span>
                </div>
              </td>
              <td>
                <span class="status-badge status-${notice.status.toLowerCase()}">
                  ${notice.status}
                </span>
              </td>
              <td>
                <span class="views-badge">👁️ ${notice.views || 0}</span>
              </td>
              <td>
                <span class="table-date">${new Date(notice.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </td>
              <td class="text-right">
                <div class="table-actions-group">
                  <!-- Toggle Pin -->
                  <button class="action-btn-sm btn-pin ${notice.isPinned ? 'active' : ''}" data-id="${notice.id}" title="${notice.isPinned ? 'Unpin Notice' : 'Pin to Top'}">
                    📌
                  </button>

                  <!-- Edit Notice -->
                  <button class="action-btn-sm btn-edit" data-id="${notice.id}" title="Edit Announcement">
                    ✏️
                  </button>

                  <!-- Status Toggle -->
                  <select class="status-select-sm" data-id="${notice.id}">
                    <option value="Published" ${notice.status === 'Published' ? 'selected' : ''}>Published</option>
                    <option value="Draft" ${notice.status === 'Draft' ? 'selected' : ''}>Draft</option>
                    <option value="Archived" ${notice.status === 'Archived' ? 'selected' : ''}>Archived</option>
                  </select>

                  <!-- Print Official -->
                  <button class="action-btn-sm btn-print-admin" data-id="${notice.id}" title="Print Official Letterhead">
                    🖨️
                  </button>

                  <!-- Delete Notice -->
                  <button class="action-btn-sm btn-delete-danger" data-id="${notice.id}" title="Delete Announcement">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Attach Table Handlers
    tableContainer.querySelectorAll('.table-notice-title').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        const n = store.notices.find(item => item.id === id);
        if (n) renderNoticeModal(n);
      });
    });

    tableContainer.querySelectorAll('.btn-pin').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.togglePin(id);
        renderAdminDashboard(container);
      });
    });

    tableContainer.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const n = store.notices.find(item => item.id === id);
        if (n) {
          renderNoticeForm(container, n, () => renderAdminDashboard(container));
        }
      });
    });

    tableContainer.querySelectorAll('.status-select-sm').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-id');
        store.toggleStatus(id, e.target.value);
        renderAdminDashboard(container);
      });
    });

    tableContainer.querySelectorAll('.btn-print-admin').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const n = store.notices.find(item => item.id === id);
        if (n) printOfficialNotice(n);
      });
    });

    tableContainer.querySelectorAll('.btn-delete-danger').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm("Are you sure you want to permanently delete this announcement?")) {
          store.deleteNotice(id);
          renderAdminDashboard(container);
        }
      });
    });
  }

  container.innerHTML = `
    <div class="admin-dashboard-layout">
      <!-- Admin Welcome Banner -->
      <div class="admin-header-card">
        <div class="admin-welcome-left">
          <div class="admin-avatar">${currentUser.name.charAt(0)}</div>
          <div>
            <h1 class="admin-heading">Notice Management Dashboard</h1>
            <p class="admin-subheading">Authorized Portal • ${currentUser.name} (${currentUser.role})</p>
          </div>
        </div>

        <div class="admin-header-actions">
          <button class="btn-create-notice-primary" id="btn-create-notice">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Publish New Announcement
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon icon-published">📢</div>
          <div class="stat-info">
            <div class="stat-value">${analytics.publishedCount}</div>
            <div class="stat-label">Published Notices</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-views">👁️</div>
          <div class="stat-info">
            <div class="stat-value">${analytics.totalViews}</div>
            <div class="stat-label">Total Student Views</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-urgent">🚨</div>
          <div class="stat-info">
            <div class="stat-value">${analytics.urgentCount}</div>
            <div class="stat-label">Active Urgent Alerts</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-draft">📝</div>
          <div class="stat-info">
            <div class="stat-value">${analytics.draftCount}</div>
            <div class="stat-label">Pending Drafts</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-archive">📦</div>
          <div class="stat-info">
            <div class="stat-value">${analytics.archivedCount}</div>
            <div class="stat-label">Archived Notices</div>
          </div>
        </div>
      </div>

      <!-- Management Card -->
      <div class="admin-content-card">
        <div class="table-toolbar">
          <div class="status-tabs">
            <button class="tab-btn ${activeTab === 'All' ? 'active' : ''}" data-tab="All">All (${store.notices.length})</button>
            <button class="tab-btn ${activeTab === 'Published' ? 'active' : ''}" data-tab="Published">Published (${analytics.publishedCount})</button>
            <button class="tab-btn ${activeTab === 'Draft' ? 'active' : ''}" data-tab="Draft">Drafts (${analytics.draftCount})</button>
            <button class="tab-btn ${activeTab === 'Archived' ? 'active' : ''}" data-tab="Archived">Archived (${analytics.archivedCount})</button>
          </div>

          <div class="admin-search-box">
            <input type="text" id="admin-search-input" placeholder="Filter announcements by title, ref code..." value="${searchQuery}">
          </div>
        </div>

        <div id="admin-table-container"></div>
      </div>
    </div>
  `;

  // Attach Top Handlers
  container.querySelector('#btn-create-notice')?.addEventListener('click', () => {
    renderNoticeForm(container, null, () => renderAdminDashboard(container));
  });

  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTable();
    });
  });

  const searchInput = container.querySelector('#admin-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTable();
  });

  // Initial table render
  renderTable();
}
