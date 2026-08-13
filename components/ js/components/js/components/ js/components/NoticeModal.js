import { store } from '../store.js';
import { tts } from '../utils/tts.js';
import { printOfficialNotice } from '../utils/printNotice.js';

export function renderNoticeModal(notice, onClose) {
  const existingModal = document.getElementById('notice-detail-modal');
  if (existingModal) existingModal.remove();

  const isBookmarked = store.bookmarks.includes(notice.id);
  const isSpeaking = tts.isSpeaking(notice.id);
  const pubDateFormatted = new Date(notice.publishedAt).toLocaleString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'notice-detail-modal';

  modalOverlay.innerHTML = `
    <div class="modal-dialog">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-meta-badges">
          <span class="priority-pill priority-${notice.priority.toLowerCase()}">
            ${notice.priority === 'Urgent' ? '<span class="pulse-dot"></span>' : ''}
            ${notice.priority} Priority
          </span>
          <span class="category-pill">${notice.category}</span>
          ${notice.isPinned ? '<span class="pinned-tag">📌 PINNED ANNOUNCEMENT</span>' : ''}
        </div>
        <button class="modal-close-btn" id="btn-modal-close" title="Close Modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <div class="modal-ref-code">${notice.refNumber || 'REF: OFFICIAL/NOTICE'}</div>
        <h2 class="modal-notice-title">${notice.title}</h2>

        <div class="modal-author-bar">
          <div class="author-block">
            <div class="author-avatar-large">${notice.author.charAt(0)}</div>
            <div>
              <div class="author-name-modal">${notice.author}</div>
              <div class="author-sub">${notice.authorRole} • Published: ${pubDateFormatted}</div>
            </div>
          </div>
          <div class="views-counter">
            👁️ ${notice.views || 1} Views
          </div>
        </div>

        <div class="modal-content-text">${notice.content}</div>

        <!-- Venue / Location Box -->
        ${notice.venue ? `
          <div class="venue-box">
            <div class="venue-title">📍 Venue / Campus Location:</div>
            <div class="venue-text">${notice.venue}</div>
          </div>
        ` : ''}

        <!-- Target Scope Box -->
        <div class="scope-box">
          <div class="scope-item">
            <span class="scope-label">Target Department:</span>
            <span class="scope-value">${notice.department}</span>
          </div>
          <div class="scope-item">
            <span class="scope-label">Target Academic Year:</span>
            <span class="scope-value">${notice.targetYear}</span>
          </div>
          <div class="scope-item">
            <span class="scope-label">Valid Until:</span>
            <span class="scope-value">${new Date(notice.expiresAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        <!-- Attachments Section -->
        ${notice.attachments && notice.attachments.length > 0 ? `
          <div class="attachments-section">
            <h4 class="attachments-title">📎 Official Attachments (${notice.attachments.length})</h4>
            <div class="attachments-list">
              ${notice.attachments.map(att => `
                <div class="attachment-item">
                  <div class="att-icon">📄</div>
                  <div class="att-info">
                    <span class="att-name">${att.name}</span>
                    <span class="att-size">${att.size}</span>
                  </div>
                  <button class="att-download-btn" onclick="alert('Downloading attachment: ${att.name}')">
                    Download
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Modal Footer Actions -->
      <div class="modal-footer">
        <div class="modal-footer-left">
          <button class="modal-btn btn-modal-tts ${isSpeaking ? 'speaking' : ''}" id="btn-modal-tts">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            ${isSpeaking ? 'Stop Audio' : 'Listen Read-Aloud'}
          </button>

          <button class="modal-btn btn-modal-bookmark ${isBookmarked ? 'active' : ''}" id="btn-modal-bookmark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            ${isBookmarked ? 'Saved in Bookmarks' : 'Save Notice'}
          </button>
        </div>

        <div class="modal-footer-right">
          <button class="modal-btn btn-modal-print" id="btn-modal-print">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print Official Notice
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Close handlers
  const closeModal = () => {
    tts.stop();
    modalOverlay.remove();
    if (onClose) onClose();
  };

  document.getElementById('btn-modal-close')?.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Action listeners inside modal
  const ttsBtn = document.getElementById('btn-modal-tts');
  ttsBtn?.addEventListener('click', () => {
    tts.speak(notice.title + ". " + notice.content, notice.id, () => {
      ttsBtn.classList.remove('speaking');
      ttsBtn.innerHTML = `Listen Read-Aloud`;
    });

    if (tts.isSpeaking(notice.id)) {
      ttsBtn.classList.add('speaking');
      ttsBtn.innerHTML = `⏹️ Stop Audio`;
    }
  });

  document.getElementById('btn-modal-bookmark')?.addEventListener('click', () => {
    store.toggleBookmark(notice.id);
    renderNoticeModal(notice, onClose); // Refresh modal view state
  });

  document.getElementById('btn-modal-print')?.addEventListener('click', () => {
    printOfficialNotice(notice);
  });
}
