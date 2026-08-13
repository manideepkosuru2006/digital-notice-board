import { store } from '../store.js';
import { DEPARTMENTS, ACADEMIC_YEARS, CATEGORIES, PRIORITIES } from '../initialData.js';

export function renderNoticeForm(container, editNotice = null, onClose = null) {
  const isEditing = !!editNotice;

  let formData = {
    title: editNotice ? editNotice.title : '',
    category: editNotice ? editNotice.category : 'Academic',
    department: editNotice ? editNotice.department : 'All Departments',
    targetYear: editNotice ? editNotice.targetYear : 'All Years',
    priority: editNotice ? editNotice.priority : 'Normal',
    status: editNotice ? editNotice.status : 'Published',
    isPinned: editNotice ? editNotice.isPinned : false,
    content: editNotice ? editNotice.content : '',
    venue: editNotice ? editNotice.venue || '' : '',
    expiresAt: editNotice ? editNotice.expiresAt.substring(0, 10) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    attachmentName: editNotice && editNotice.attachments && editNotice.attachments[0] ? editNotice.attachments[0].name : '',
    attachmentSize: editNotice && editNotice.attachments && editNotice.attachments[0] ? editNotice.attachments[0].size : '1.2 MB'
  };

  const formModal = document.createElement('div');
  formModal.className = 'modal-overlay';
  formModal.id = 'notice-form-modal';

  formModal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-header">
        <div class="modal-title-box">
          <h2 class="form-modal-heading">${isEditing ? '✏️ Edit Announcement' : '➕ Publish New Announcement'}</h2>
          <p class="form-modal-sub">Authorized Staff Creator Portal • Current Signatory: <strong>${store.currentUser.name}</strong></p>
        </div>
        <button class="modal-close-btn" id="btn-close-form">✕</button>
      </div>

      <div class="modal-body">
        <form id="notice-form">
          <div class="form-grid-2">
            <!-- Title -->
            <div class="form-group span-2">
              <label for="form-title">Announcement Title <span class="req">*</span></label>
              <input type="text" id="form-title" required placeholder="e.g. End-Semester Examination Schedule - Autumn 2026" value="${formData.title}">
            </div>

            <!-- Category -->
            <div class="form-group">
              <label for="form-category">Category <span class="req">*</span></label>
              <select id="form-category" required>
                ${CATEGORIES.filter(c => c !== 'All Categories').map(c => `
                  <option value="${c}" ${c === formData.category ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>

            <!-- Priority -->
            <div class="form-group">
              <label for="form-priority">Priority Level <span class="req">*</span></label>
              <select id="form-priority" required>
                ${PRIORITIES.filter(p => p !== 'All Priorities').map(p => `
                  <option value="${p}" ${p === formData.priority ? 'selected' : ''}>${p}</option>
                `).join('')}
              </select>
            </div>

            <!-- Department -->
            <div class="form-group">
              <label for="form-dept">Target Department <span class="req">*</span></label>
              <select id="form-dept" required>
                ${DEPARTMENTS.map(d => `
                  <option value="${d}" ${d === formData.department ? 'selected' : ''}>${d}</option>
                `).join('')}
              </select>
            </div>

            <!-- Target Year -->
            <div class="form-group">
              <label for="form-year">Target Academic Year <span class="req">*</span></label>
              <select id="form-year" required>
                ${ACADEMIC_YEARS.map(y => `
                  <option value="${y}" ${y === formData.targetYear ? 'selected' : ''}>${y}</option>
                `).join('')}
              </select>
            </div>

            <!-- Expiry Date -->
            <div class="form-group">
              <label for="form-expiry">Valid Until / Expiry Date</label>
              <input type="date" id="form-expiry" value="${formData.expiresAt}">
            </div>

            <!-- Venue / Location -->
            <div class="form-group">
              <label for="form-venue">Campus Location / Venue (Optional)</label>
              <input type="text" id="form-venue" placeholder="e.g. Main Auditorium / Exam Block B" value="${formData.venue}">
            </div>

            <!-- Attachment File Simulator -->
            <div class="form-group span-2">
              <label for="form-attachment">Simulate Attachment File (Optional)</label>
              <div class="file-simulator-row">
                <input type="text" id="form-att-name" placeholder="Filename e.g. Exam_Timetable.pdf" value="${formData.attachmentName}">
                <input type="text" id="form-att-size" placeholder="Size e.g. 1.5 MB" value="${formData.attachmentSize}" style="max-width: 120px;">
              </div>
            </div>

            <!-- Content / Body -->
            <div class="form-group span-2">
              <label for="form-content">Notice Detailed Body <span class="req">*</span></label>
              <textarea id="form-content" rows="6" required placeholder="Write the complete official notice text here... Include instructions, dates, deadlines, and guidelines.">${formData.content}</textarea>
            </div>

            <!-- Status & Pinning -->
            <div class="form-group span-2 form-checkboxes-row">
              <label class="checkbox-label">
                <input type="checkbox" id="form-is-pinned" ${formData.isPinned ? 'checked' : ''}>
                <span>📌 Pin this announcement to the top of student notice board</span>
              </label>

              <label class="checkbox-label">
                <input type="checkbox" id="form-is-draft" ${formData.status === 'Draft' ? 'checked' : ''}>
                <span>💾 Save as Draft (Will not be visible to students yet)</span>
              </label>
            </div>
          </div>

          <!-- Form Footer Actions -->
          <div class="modal-footer">
            <button type="button" class="btn-secondary" id="btn-cancel-form">Cancel</button>
            <button type="submit" class="btn-primary-action">
              ${isEditing ? 'Save Changes' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(formModal);

  const closeForm = () => {
    formModal.remove();
    if (onClose) onClose();
  };

  formModal.querySelector('#btn-close-form').addEventListener('click', closeForm);
  formModal.querySelector('#btn-cancel-form').addEventListener('click', closeForm);

  formModal.querySelector('#notice-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = formModal.querySelector('#form-title').value.trim();
    const category = formModal.querySelector('#form-category').value;
    const priority = formModal.querySelector('#form-priority').value;
    const department = formModal.querySelector('#form-dept').value;
    const targetYear = formModal.querySelector('#form-year').value;
    const expiryVal = formModal.querySelector('#form-expiry').value;
    const venue = formModal.querySelector('#form-venue').value.trim();
    const content = formModal.querySelector('#form-content').value.trim();
    const isPinned = formModal.querySelector('#form-is-pinned').checked;
    const isDraft = formModal.querySelector('#form-is-draft').checked;

    const attName = formModal.querySelector('#form-att-name').value.trim();
    const attSize = formModal.querySelector('#form-att-size').value.trim();

    const attachments = attName ? [{ name: attName, size: attSize || '1.0 MB', type: 'pdf' }] : [];

    const noticePayload = {
      title,
      category,
      priority,
      department,
      targetYear,
      content,
      venue,
      isPinned,
      status: isDraft ? 'Draft' : 'Published',
      expiresAt: expiryVal ? new Date(expiryVal).toISOString() : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      attachments
    };

    if (isEditing) {
      store.updateNotice(editNotice.id, noticePayload);
    } else {
      store.addNotice(noticePayload);
    }

    closeForm();
  });
}
