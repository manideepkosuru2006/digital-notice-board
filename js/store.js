import { INITIAL_NOTICES, INITIAL_USERS } from './initialData.js';

class NoticeStore {
  constructor() {
    this.storageKey = 'dnb_notices_data_v1';
    this.bookmarksKey = 'dnb_user_bookmarks_v1';
    this.themeKey = 'dnb_theme_v1';

    this.notices = this.loadNotices();
    this.bookmarks = this.loadBookmarks();
    this.users = INITIAL_USERS;
    this.currentUser = INITIAL_USERS[0]; // Default authorized user
    this.currentRole = 'student'; // Default view: 'student' or 'authorized'

    // Student Filter state
    this.filters = {
      department: 'All Departments',
      targetYear: 'All Years',
      category: 'All Categories',
      priority: 'All Priorities',
      search: ''
    };

    // Dark/Light Theme
    this.theme = localStorage.getItem(this.themeKey) || 'light';

    // Subscriptions for state updates
    this.listeners = [];
    
    // Auto sync theme attribute
    this.applyTheme(this.theme);
  }

  loadNotices() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notices, resetting to default', e);
      }
    }
    return INITIAL_NOTICES;
  }

  saveNotices() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notices));
    this.notify();
  }

  loadBookmarks() {
    const saved = localStorage.getItem(this.bookmarksKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  saveBookmarks() {
    localStorage.setItem(this.bookmarksKey, JSON.stringify(this.bookmarks));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this));
  }

  // --- Theme Toggle ---
  setTheme(newTheme) {
    this.theme = newTheme;
    localStorage.setItem(this.themeKey, newTheme);
    this.applyTheme(newTheme);
    this.notify();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // --- Role & User Management ---
  setRole(role) {
    this.currentRole = role;
    this.notify();
  }

  setUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.notify();
    }
  }

  // --- Filters ---
  setFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  resetFilters() {
    this.filters = {
      department: 'All Departments',
      targetYear: 'All Years',
      category: 'All Categories',
      priority: 'All Priorities',
      search: ''
    };
    this.notify();
  }

  // --- Notice Operations (Create, Edit, Pin, Archive, Delete) ---
  addNotice(noticeData) {
    const newNotice = {
      id: `NTC-2026-${String(this.notices.length + 1).padStart(3, '0')}`,
      refNumber: `REF: ${noticeData.category.substring(0, 3).toUpperCase()}/2026/${Math.floor(100 + Math.random() * 900)}`,
      publishedAt: new Date().toISOString(),
      status: noticeData.status || 'Published',
      isPinned: noticeData.isPinned || false,
      views: 0,
      author: this.currentUser.name,
      authorRole: this.currentUser.role,
      attachments: noticeData.attachments || [],
      ...noticeData
    };

    this.notices.unshift(newNotice); // Add to top
    this.saveNotices();
    return newNotice;
  }

  updateNotice(id, updatedFields) {
    this.notices = this.notices.map(notice => {
      if (notice.id === id) {
        return { ...notice, ...updatedFields };
      }
      return notice;
    });
    this.saveNotices();
  }

  togglePin(id) {
    const notice = this.notices.find(n => n.id === id);
    if (notice) {
      notice.isPinned = !notice.isPinned;
      this.saveNotices();
    }
  }

  toggleStatus(id, newStatus) {
    const notice = this.notices.find(n => n.id === id);
    if (notice) {
      notice.status = newStatus;
      this.saveNotices();
    }
  }

  deleteNotice(id) {
    this.notices = this.notices.filter(n => n.id !== id);
    this.bookmarks = this.bookmarks.filter(bId => bId !== id);
    this.saveBookmarks();
    this.saveNotices();
  }

  incrementViews(id) {
    const notice = this.notices.find(n => n.id === id);
    if (notice) {
      notice.views = (notice.views || 0) + 1;
      this.saveNotices();
    }
  }

  toggleBookmark(id) {
    if (this.bookmarks.includes(id)) {
      this.bookmarks = this.bookmarks.filter(bId => bId !== id);
    } else {
      this.bookmarks.push(id);
    }
    this.saveBookmarks();
  }

  resetToDefaultData() {
    this.notices = INITIAL_NOTICES;
    this.bookmarks = [];
    this.saveNotices();
    this.saveBookmarks();
  }

  // --- Getters ---
  getFilteredNotices() {
    return this.notices.filter(notice => {
      // For student view, only show Published notices
      if (this.currentRole === 'student' && notice.status !== 'Published') {
        return false;
      }

      // Department filter
      if (this.filters.department !== 'All Departments') {
        if (notice.department !== 'All Departments' && notice.department !== this.filters.department) {
          return false;
        }
      }

      // Year filter
      if (this.filters.targetYear !== 'All Years') {
        if (notice.targetYear !== 'All Years' && notice.targetYear !== this.filters.targetYear) {
          return false;
        }
      }

      // Category filter
      if (this.filters.category !== 'All Categories' && notice.category !== this.filters.category) {
        return false;
      }

      // Priority filter
      if (this.filters.priority !== 'All Priorities' && notice.priority !== this.filters.priority) {
        return false;
      }

      // Search query filter
      if (this.filters.search.trim()) {
        const query = this.filters.search.toLowerCase();
        const inTitle = notice.title.toLowerCase().includes(query);
        const inContent = notice.content.toLowerCase().includes(query);
        const inAuthor = notice.author.toLowerCase().includes(query);
        const inCategory = notice.category.toLowerCase().includes(query);
        const inRef = notice.refNumber.toLowerCase().includes(query);
        if (!inTitle && !inContent && !inAuthor && !inCategory && !inRef) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Pinned notices first, then chronologically by publishedAt descending
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
  }

  getAnalytics() {
    const totalNotices = this.notices.length;
    const publishedCount = this.notices.filter(n => n.status === 'Published').length;
    const draftCount = this.notices.filter(n => n.status === 'Draft').length;
    const archivedCount = this.notices.filter(n => n.status === 'Archived').length;
    const totalViews = this.notices.reduce((acc, n) => acc + (n.views || 0), 0);
    const urgentCount = this.notices.filter(n => n.priority === 'Urgent' && n.status === 'Published').length;

    // Category breakdown
    const categoryCounts = {};
    this.notices.forEach(n => {
      categoryCounts[n.category] = (categoryCounts[n.category] || 0) + 1;
    });

    return {
      totalNotices,
      publishedCount,
      draftCount,
      archivedCount,
      totalViews,
      urgentCount,
      categoryCounts
    };
  }
}

export const store = new NoticeStore();
