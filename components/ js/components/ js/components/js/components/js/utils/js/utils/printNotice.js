// Generates official printable notice view with college letterhead design

export function printOfficialNotice(notice) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert("Please allow popups to generate the official print document.");
    return;
  }

  const dateFormatted = new Date(notice.publishedAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OFFICIAL NOTICE - ${notice.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;600;700&display=swap');
    
    body {
      font-family: 'Merriweather', Georgia, serif;
      margin: 0;
      padding: 40px;
      color: #1a202c;
      background: #ffffff;
    }
    
    .notice-border {
      border: 3px double #1a365d;
      padding: 30px 40px;
      min-height: 90vh;
      box-sizing: border-box;
      position: relative;
    }
    
    .header {
      text-align: center;
      border-bottom: 2px solid #1a365d;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    
    .college-name {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #1a365d;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0 0 6px 0;
    }

    .sub-header {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      color: #4a5568;
      margin: 0 0 15px 0;
    }

    .notice-title-banner {
      background: #1a365d;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      display: inline-block;
      padding: 6px 24px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      margin-top: 10px;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #2d3748;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 25px;
    }

    .priority-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
    }
    .priority-Urgent { background: #fed7d7; color: #9b2c2c; }
    .priority-High { background: #feebc8; color: #9c4221; }
    .priority-Normal { background: #e2e8f0; color: #2d3748; }

    .title {
      font-size: 22px;
      font-weight: 700;
      color: #000;
      margin: 0 0 20px 0;
      line-height: 1.4;
      text-align: center;
    }

    .content {
      font-size: 15px;
      line-height: 1.8;
      text-align: justify;
      white-space: pre-line;
      margin-bottom: 40px;
    }

    .details-box {
      background: #f7fafc;
      border-left: 4px solid #1a365d;
      padding: 12px 18px;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      margin-bottom: 30px;
    }

    .footer-signatures {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      page-break-inside: avoid;
    }

    .seal-box {
      border: 2px dashed #a0aec0;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-size: 10px;
      color: #718096;
      text-align: center;
      text-transform: uppercase;
    }

    .signatory {
      text-align: right;
      font-family: 'Outfit', sans-serif;
    }

    .signatory-name {
      font-weight: 700;
      font-size: 15px;
      color: #1a365d;
    }

    .signatory-role {
      font-size: 13px;
      color: #4a5568;
    }

    @media print {
      body { padding: 0; }
      .notice-border { min-height: 100vh; }
    }
  </style>
</head>
<body>
  <div class="notice-border">
    <div class="header">
      <h1 class="college-name">METROPOLITAN INSTITUTE OF TECHNOLOGY</h1>
      <p class="sub-header">Accredited Grade 'A+' | Autonomous Institution | Affiliated to Central University</p>
      <div class="notice-title-banner">OFFICIAL ANNOUNCEMENT</div>
    </div>

    <div class="meta-row">
      <div><strong>${notice.refNumber || 'REF: NTC/2026/OFFICIAL'}</strong></div>
      <div>Date: ${dateFormatted}</div>
      <div>Priority: <span class="priority-badge priority-${notice.priority}">${notice.priority}</span></div>
    </div>

    <h2 class="title">${notice.title}</h2>

    <div class="content">${notice.content}</div>

    ${notice.venue ? `
    <div class="details-box">
      <strong>📍 Venue / Location:</strong> ${notice.venue}<br>
      <strong>🎯 Target Audience:</strong> ${notice.department} (${notice.targetYear})
    </div>` : ''}

    <div class="footer-signatures">
      <div class="seal-box">
        Official<br>Institutional<br>Seal
      </div>
      <div class="signatory">
        <div style="height: 35px; border-bottom: 1px solid #1a365d; margin-bottom: 5px; width: 180px; margin-left: auto;"></div>
        <div class="signatory-name">${notice.author}</div>
        <div class="signatory-role">${notice.authorRole}</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
