import { store } from '../store.js';
import { DEPARTMENTS, ACADEMIC_YEARS, CATEGORIES, PRIORITIES } from '../initialData.js';
import { createNoticeCard } from './NoticeCard.js';
import { renderNoticeModal } from './NoticeModal.js';

export function renderStudentFeed(container, onlyBookmarks = false) {
  let notices = store.getFilteredNotices();

  if (onlyBookmarks) {
    notices = notices.filter(n => store.bookmarks.includes(n.id));
  }

  const pinnedNotices = notices.filter(n => n.isPinned);
  const regularNotices = notices.filter(n => !n.isPinned);

  const activeFilters = store.filters;
  const isFiltered = activeFilters.department !== 'All Departments' ||
                     activeFilters.targetYear !== 'All Years' ||
                     activeFilters.category !== 'All Categories' ||
                     activeFilters.priority !== 'All Priorities' ||
                     activeFilters.search.trim() !== '' ||
                     onlyBookmarks;

  container.innerHTML = `
    <div class="student-feed-layout">
      <!-- Hero Banner -->
      <section class="hero-banner">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="live-pulse"></span> REAL-TIME CAMPUS ANNOUNCEMENTS
          </div>
          <h1 class="hero-title">${onlyBookmarks ? 'Your Bookmarked Notices' : 'Digital Notice Board'}</h1>
          <p class="hero-subtitle">
            ${onlyBookmarks ? 'Quickly access saved college updates and offline readable announcements.' : 'Access latest, relevant, and verified announcements published directly by university administration and faculty.'}
          </p>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-wrapper">
          <div class="search-input-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" id="input-search" placeholder="Search notices by keyword, exam title, department, ref code..." value="${activeFilters.search}">
            ${activeFilters.search ? `
              <button class="clear-search-btn" id="btn-clear-search">✕</button>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Main Controls & Filters -->
      <div class="feed-controls-card">
        <div class="filter-controls-row">
          <!-- Department Select -->
          <div class="filter-group">
            <label for="select-dept">Department</label>
            <select id="select-dept">
              ${DEPARTMENTS.map(d => `<option value="${d}" ${d === activeFilters.department ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>

          <!-- Academic Year Select -->
          <div class="filter-group">
            <label for="select-year">Target Year</label>
            <select id="select-year">
              ${ACADEMIC_YEARS.map(y => `<option value="${y}" ${y === activeFilters.targetYear ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
          </div>

          <!-- Priority Select -->
          <div class="filter-group">
            <label for="select-priority">Priority</label>
            <select id="select-priority">
              ${PRIORITIES.map(p => `<option value="${p}" ${p === activeFilters.priority ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>

          <!-- Reset Filters Button -->
          ${isFiltered ? `
            <div class="filter-group align-end">
              <button class="btn-reset-filters" id="btn-reset-filters">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Reset Filters
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Quick Category Tabs -->
        <div class="category-tabs-scroll">
          ${CATEGORIES.map(cat => `
            <button class="cat-tab-btn ${cat === activeFilters.category ? 'active' : ''}" data-cat="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Feed Header Info -->
      <div class="feed-header-info">
        <div class="results-count">
          Showing <strong>${notices.length}</strong> ${onlyBookmarks ? 'bookmarked' : ''} announcement${notices.length !== 1 ? 's' : ''}
        </div>
        ${onlyBookmarks ? `
          <button class="back-link-btn" id="btn-back-all-notices">← Back to All Notices</button>
        ` : ''}
      </div>

      <!-- Notice List Grid -->
      ${notices.length === 0 ? `
        <div class="empty-state-box">
          <div class="empty-icon">📢</div>
          <h3>No announcements found</h3>
          <p>Try adjusting your search keywords or relevance filters to see more notices.</p>
          <button class="btn-reset-filters-large" id="btn-reset-empty">Clear All Filters</button>
        </div>
      ` : `
        <div class="notices-grid" id="notices-cards-container"></div>
      `}
    </div>
  `;

  // Render cards into container
  const cardsContainer = container.querySelector('#notices-cards-container');
  if (cardsContainer) {
    notices.forEach(notice => {
      const cardElem = createNoticeCard(notice, (selectedNotice) => {
        renderNoticeModal(selectedNotice);
      });
      cardsContainer.appendChild(cardElem);
    });
  }

  // --- Attach Event Listeners ---
  const searchInput = container.querySelector('#input-search');
  let searchTimeout;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      store.setFilter('search', e.target.value);
    }, 250);
  });

  container.querySelector('#btn-clear-search')?.addEventListener('click', () => {
    store.setFilter('search', '');
  });

  container.querySelector('#select-dept')?.addEventListener('change', (e) => {
    store.setFilter('department', e.target.value);
  });

  container.querySelector('#select-year')?.addEventListener('change', (e) => {
    store.setFilter('targetYear', e.target.value);
  });

  container.querySelector('#select-priority')?.addEventListener('change', (e) => {
    store.setFilter('priority', e.target.value);
  });

  container.querySelectorAll('.cat-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setFilter('category', btn.getAttribute('data-cat'));
    });
  });

  const resetAction = () => {
    store.resetFilters();
    if (onlyBookmarks) renderStudentFeed(container, false);
  };

  container.querySelector('#btn-reset-filters')?.addEventListener('click', resetAction);
  container.querySelector('#btn-reset-empty')?.addEventListener('click', resetAction);
  container.querySelector('#btn-back-all-notices')?.addEventListener('click', () => {
    renderStudentFeed(container, false);
  });
}
