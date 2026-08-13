import { store } from '../store.js';
import { tts } from '../utils/tts.js';
import { printOfficialNotice } from '../utils/printNotice.js';

export function createNoticeCard(notice, onOpenDetail) {
  const isBookmarked = store.bookmarks.includes(notice.id);
  const isSpeaking = tts.isSpeaking(notice.id);
  
  // Calculate relative date
  const pubDate = new Date(notice.publishedAt);
  const now = new Date();
  const diffHours = Math.floor((now - pubDate) / (1000 * 60 * 60));
  let timeStr = pubDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  if (diffHours < 24) {
    timeStr = pubDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  // Expiration check
  const expDate = new Date(notice.expiresAt);
  const expDiffHours = Math.floor((expDate - now) / (1000 * 60 * 60));
  const isExpiringSoon = expDiffHours > 0 && expDiffHours <= 48;

  const card = document.createElement('div');
  card.className = `notice-card priority-${notice.priority.toLowerCase()} ${notice.isPinned ? 'is-pinned' : ''}`;
  card.setAttribute('data-id', notice.id);

  card.innerHTML = `
    <!-- Top Meta Row -->
    <div class="card-header-meta">
      <div class="meta-left">
        ${notice.isPinned ? `
          <span class="pinned-tag" title="Pinned by Administration">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z"/>
            </svg>
            PINNED
          </span>
        ` : ''}
        <span class="priority-pill priority-${notice.priority.toLowerCase()}">
          ${notice.priority === 'Urgent' ? '<span class="pulse-dot"></span>' : ''}
          ${notice.priority}
        </span>
        <span class="category-pill">${notice.category}</span>
      </div>

      <div class="meta-right">
        <button class="action-icon-btn btn-bookmark ${isBookmarked ? 'active' : ''}" title="${isBookmarked ? 'Remove Bookmark' : 'Save Notice'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Title & Reference Code -->
    <h3 class="notice-card-title">${notice.title}</h3>
    <div class="notice-ref-code">${notice.refNumber || 'REF: OFFICIAL'}</div>

    <!-- Content Teaser -->
    <p class="notice-card-excerpt">
      ${notice.content.length > 180 ? notice.content.substring(0, 180) + '...' : notice.content}
    </p>

    <!-- Attachment & Location Badges -->
    <div class="card-badges-row">
      <span class="dept-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        ${notice.department}
      </span>
      <span class="year-badge">
        🎓 ${notice.targetYear}
      </span>
      ${notice.attachments && notice.attachments.length > 0 ? `
        <span class="attachment-badge">
          📎 ${notice.attachments.length} Attachment${notice.attachments.length > 1 ? 's' : ''}
        </span>
      ` : ''}
      ${isExpiringSoon ? `
        <span class="expiring-badge">
          ⏱️ Expiring Soon
        </span>
      ` : ''}
    </div>

    <!-- Card Footer -->
    <div class="card-footer">
      <div class="author-info">
        <div class="author-avatar">${notice.author.charAt(0)}</div>
        <div class="author-details">
          <span class="author-name">${notice.author}</span>
          <span class="author-role">${notice.authorRole} • ${timeStr}</span>
        </div>
      </div>

      <div class="card-actions">
        <!-- Text To Speech Reader -->
        <button class="card-action-btn btn-tts ${isSpeaking ? 'speaking' : ''}" title="Listen to Notice (Text to Speech)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          ${isSpeaking ? 'Stop' : 'Listen'}
        </button>

        <!-- Print Official Document -->
        <button class="card-action-btn btn-print" title="Print Official Notice Document">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print
        </button>

        <!-- View Full Notice -->
        <button class="card-action-btn btn-view-detailPrimary">
          Read Full
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Attach card event listeners
  const bookmarkBtn = card.querySelector('.btn-bookmark');
  bookmarkBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    store.toggleBookmark(notice.id);
  });

  const ttsBtn = card.querySelector('.btn-tts');
  ttsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    tts.speak(notice.title + ". " + notice.content, notice.id, () => {
      // re-render icon state
      ttsBtn.classList.remove('speaking');
      ttsBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg> Listen
      `;
    });

    if (tts.isSpeaking(notice.id)) {
      ttsBtn.classList.add('speaking');
      ttsBtn.innerHTML = `⏹️ Stop`;
    }
  });

  const printBtn = card.querySelector('.btn-print');
  printBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    printOfficialNotice(notice);
  });

  const detailBtn = card.querySelector('.btn-view-detailPrimary');
  detailBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    store.incrementViews(notice.id);
    if (onOpenDetail) onOpenDetail(notice);
  });

  // Clicking card anywhere opens modal
  card.addEventListener('click', () => {
    store.incrementViews(notice.id);
    if (onOpenDetail) onOpenDetail(notice);
  });

  return card;
}
