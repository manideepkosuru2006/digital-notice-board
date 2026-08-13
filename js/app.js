import { store } from './store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderStudentFeed } from './components/StudentFeed.js';
import { renderAdminDashboard } from './components/AdminDashboard.js';
let isViewingBookmarksOnly = false;
export function initApp() {
  const navbarContainer = document.getElementById('navbar-mount');
  const mainContentContainer = document.getElementById('main-content-mount');
  function render() {
    // 1. Render Navigation Bar
    renderNavbar(navbarContainer, () => {
      isViewingBookmarksOnly = !isViewingBookmarksOnly;
      render();
    });
    // 2. Render Main Content based on Active Role
    if (store.currentRole === 'student') {
      renderStudentFeed(mainContentContainer, isViewingBookmarksOnly);
    } else {
      isViewingBookmarksOnly = false;
      renderAdminDashboard(mainContentContainer);
    }
  }
  // Subscribe to state changes in NoticeStore
  store.subscribe(() => {
    render();
  });
  // Initial Render
  render();
}
// Auto mount on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
