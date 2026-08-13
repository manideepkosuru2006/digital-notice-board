import { store } from '../store.js';

export function renderNavbar(container, onOpenBookmarks) {
  const isStudent = store.currentRole === 'student';
  const currentUser = store.currentUser;
  const bookmarkCount = store.bookmarks.length;

  container.innerHTML = `
    <header class="navbar">
      <div class="navbar-container">
        <!-- Brand Logo -->
        <div class="navbar-brand">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              <path d="M7 7h10M7 11h10M7 15h6"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">CAMPUS PULSE</span>
            <span class="brand-subtitle">Digital Notice Board</span>
          </div>
        </div>

        <!-- Center View Switcher Pills -->
        <div class="role-switcher-container">
          <button class="role-btn ${isStudent ? 'active' : ''}" id="btn-role-student">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            Student Board
          </button>
          <button class="role-btn ${!isStudent ? 'active' : ''}" id="btn-role-admin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Authorized Staff Portal
          </button>
        </div>

        <!-- Right Side Actions -->
        <div class="navbar-actions">
          <!-- Bookmarks Count (For Student View) -->
          ${isStudent ? `
            <button class="icon-btn" id="btn-view-bookmarks" title="Saved Bookmarks">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              ${bookmarkCount > 0 ? `<span class="badge-count">${bookmarkCount}</span>` : ''}
            </button>
          ` : `
            <!-- Persona Switcher for Staff View -->
            <div class="persona-selector">
              <select id="select-user-persona">
                ${store.users.map(u => `
                  <option value="${u.id}" ${u.id === currentUser.id ? 'selected' : ''}>
                    ${u.name} (${u.role})
                  </option>
                `).join('')}
              </select>
            </div>
          `}

          <!-- Dark/Light Theme Toggle -->
          <button class="icon-btn" id="btn-toggle-theme" title="Toggle Light/Dark Theme">
            ${store.theme === 'dark' ? `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ` : `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            `}
          </button>
        </div>
      </div>
    </header>
  `;

  // Attach event listeners
  document.getElementById('btn-role-student')?.addEventListener('click', () => {
    store.setRole('student');
  });

  document.getElementById('btn-role-admin')?.addEventListener('click', () => {
    store.setRole('authorized');
  });

  document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
    store.setTheme(store.theme === 'light' ? 'dark' : 'light');
  });

  document.getElementById('select-user-persona')?.addEventListener('change', (e) => {
    store.setUser(e.target.value);
  });

  document.getElementById('btn-view-bookmarks')?.addEventListener('click', () => {
    if (onOpenBookmarks) onOpenBookmarks();
  });
}
