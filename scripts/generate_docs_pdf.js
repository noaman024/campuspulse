// scripts/generate_docs_pdf.js
// Converts CampusPulse markdown documentation files into professional executive PDFs via headless Chromium/Chrome.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
if (!fs.existsSync(CHROME_PATH)) {
  console.error("Error: Chrome not found at " + CHROME_PATH);
  process.exit(1);
}

// Simple robust Markdown to HTML compiler
function markdownToHtml(md) {
  let lines = md.split(/\r?\n/);
  let html = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBuffer = [];
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listType = ''; // 'ul' or 'ol'

  function flushList() {
    if (inList) {
      html.push(`</${listType}>`);
      inList = false;
      listType = '';
    }
  }

  function flushTable() {
    if (inTable) {
      if (tableRows.length > 0) {
        html.push('<div class="table-container"><table>');
        // First row is header
        let headerRow = tableRows[0];
        html.push('<thead><tr>');
        for (let cell of headerRow) {
          html.push(`<th>${formatInline(cell)}</th>`);
        }
        html.push('</tr></thead>');

        // Remaining rows are body (skipping row 1 if it was separator)
        html.push('<tbody>');
        for (let i = 1; i < tableRows.length; i++) {
          html.push('<tr>');
          for (let cell of tableRows[i]) {
            html.push(`<td>${formatInline(cell)}</td>`);
          }
          html.push('</tr>');
        }
        html.push('</tbody></table></div>');
      }
      inTable = false;
      tableRows = [];
    }
  }

  function formatInline(str) {
    if (!str) return '';
    return str
      // Bold + Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline Code
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Checkmarks & crosses
      .replace(/✅/g, '<span class="status-badge success">YES / ACTIVE</span>')
      .replace(/❌/g, '<span class="status-badge danger">NO / DISABLED</span>')
      .replace(/⚠️/g, '<span class="status-badge warning">WARNING</span>');
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        html.push(`<pre class="code-block ${codeBlockLang}"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
        inCodeBlock = false;
        codeBuffer = [];
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Horizontal Rule
    if (/^(\*\*\*|---|___)$/.test(line.trim())) {
      flushList();
      flushTable();
      html.push('<hr class="divider" />');
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      let cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check if this is the separator row | :--- | :--- |
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        // Separator line - skip storing as data
        continue;
      }
      inTable = true;
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      html.push(`<h1 class="doc-title">${formatInline(line.substring(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      html.push(`<h2 class="section-title">${formatInline(line.substring(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      html.push(`<h3 class="subsection-title">${formatInline(line.substring(4))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      flushList();
      html.push(`<h4 class="minor-title">${formatInline(line.substring(5))}</h4>`);
      continue;
    }

    // Blockquotes / Alerts
    if (line.startsWith('> [!TIP]')) {
      flushList();
      html.push('<div class="alert-box tip"><div class="alert-title">TIP</div>');
      continue;
    }
    if (line.startsWith('> [!NOTE]')) {
      flushList();
      html.push('<div class="alert-box note"><div class="alert-title">NOTE</div>');
      continue;
    }
    if (line.startsWith('> [!IMPORTANT]')) {
      flushList();
      html.push('<div class="alert-box important"><div class="alert-title">IMPORTANT</div>');
      continue;
    }
    if (line.startsWith('> [!WARNING]')) {
      flushList();
      html.push('<div class="alert-box warning"><div class="alert-title">WARNING</div>');
      continue;
    }
    if (line.startsWith('> ')) {
      let content = line.substring(2);
      html.push(`<p class="alert-content">${formatInline(content)}</p>`);
      if (i + 1 >= lines.length || !lines[i + 1].startsWith('>')) {
        html.push('</div>');
      }
      continue;
    }

    // Unordered lists
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
        html.push('<ul class="doc-list">');
      }
      let content = line.replace(/^\s*[-*]\s+/, '');
      html.push(`<li>${formatInline(content)}</li>`);
      continue;
    }

    // Ordered lists
    if (/^\s*\d+\.\s+/.test(line)) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
        html.push('<ol class="doc-list ordered">');
      }
      let content = line.replace(/^\s*\d+\.\s+/, '');
      html.push(`<li>${formatInline(content)}</li>`);
      continue;
    }

    flushList();

    // Blank lines
    if (!line.trim()) {
      continue;
    }

    // Standard paragraphs
    html.push(`<p class="doc-paragraph">${formatInline(line)}</p>`);
  }

  flushList();
  flushTable();

  return html.join('\n');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateCompleteHtml(title, categoryName, contentHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 18mm 14mm 18mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 10.5pt;
      line-height: 1.6;
      color: #1E293B;
      background: #FFFFFF;
    }

    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #4F46E5;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo {
      width: 32px;
      height: 32px;
      background: #4F46E5;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 16px;
    }

    .brand-title {
      font-size: 16pt;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.5px;
    }

    .brand-tag {
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748B;
    }

    .category-badge {
      background: #EEF2FF;
      color: #4338CA;
      border: 1px solid #C7D2FE;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    h1.doc-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
      line-height: 1.25;
    }

    h2.section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #1E293B;
      margin-top: 26px;
      margin-bottom: 12px;
      border-left: 4px solid #4F46E5;
      padding-left: 10px;
      page-break-after: avoid;
      break-after: avoid;
    }

    h3.subsection-title {
      font-size: 11pt;
      font-weight: 600;
      color: #334155;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
      break-after: avoid;
    }

    p.doc-paragraph {
      margin-bottom: 12px;
      color: #334155;
      text-align: justify;
    }

    .divider {
      border: none;
      border-top: 1px solid #E2E8F0;
      margin: 20px 0;
    }

    /* Lists */
    ul.doc-list, ol.doc-list {
      margin-left: 20px;
      margin-bottom: 14px;
      color: #334155;
    }

    ul.doc-list li, ol.doc-list li {
      margin-bottom: 5px;
      line-height: 1.5;
    }

    /* Tables */
    .table-container {
      margin: 16px 0 20px 0;
      width: 100%;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      border: 1px solid #CBD5E1;
      background: #FFFFFF;
    }

    th {
      background: #F8FAFC;
      color: #0F172A;
      font-weight: 700;
      text-align: left;
      padding: 8px 12px;
      border: 1px solid #CBD5E1;
      border-bottom: 2px solid #94A3B8;
    }

    td {
      padding: 7px 12px;
      border: 1px solid #E2E8F0;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background: #F8FAFC;
    }

    /* Code Blocks */
    pre.code-block {
      background: #0F172A;
      color: #E2E8F0;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      line-height: 1.5;
      margin: 14px 0;
      overflow-x: auto;
      page-break-inside: avoid;
      break-inside: avoid;
      border: 1px solid #1E293B;
    }

    code.inline-code {
      font-family: 'JetBrains Mono', monospace;
      background: #F1F5F9;
      color: #4F46E5;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8.5pt;
      border: 1px solid #E2E8F0;
      font-weight: 600;
    }

    /* Alerts / Callouts */
    .alert-box {
      border-radius: 8px;
      padding: 12px 14px;
      margin: 14px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .alert-box.tip {
      background: #F0FDF4;
      border: 1px solid #86EFAC;
      border-left: 4px solid #16A34A;
    }

    .alert-box.note {
      background: #EFF6FF;
      border: 1px solid #93C5FD;
      border-left: 4px solid #2563EB;
    }

    .alert-box.important {
      background: #FAF5FF;
      border: 1px solid #D8B4FE;
      border-left: 4px solid #9333EA;
    }

    .alert-box.warning {
      background: #FEFCE8;
      border: 1px solid #FDE047;
      border-left: 4px solid #CA8A04;
    }

    .alert-title {
      font-weight: 800;
      font-size: 8pt;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .alert-box.tip .alert-title { color: #15803D; }
    .alert-box.note .alert-title { color: #1D4ED8; }
    .alert-box.important .alert-title { color: #7E22CE; }
    .alert-box.warning .alert-title { color: #A16207; }

    .alert-content {
      font-size: 9.5pt;
      color: #334155;
    }

    /* Status Badges */
    .status-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 12px;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .status-badge.success {
      background: #DCFCE7;
      color: #15803D;
      border: 1px solid #86EFAC;
    }

    .status-badge.danger {
      background: #FEE2E2;
      color: #B91C1C;
      border: 1px solid #FCA5A5;
    }

    .status-badge.warning {
      background: #FEF9C3;
      color: #854D0E;
      border: 1px solid #FDE047;
    }

    /* Footer */
    .footer-note {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #CBD5E1;
      font-size: 8pt;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="brand-group">
      <div class="brand-logo">CP</div>
      <div>
        <div class="brand-title">CampusPulse</div>
        <div class="brand-tag">Institutional Event & Feedback Infrastructure</div>
      </div>
    </div>
    <div class="category-badge">${escapeHtml(categoryName)}</div>
  </div>

  <div class="content-body">
    ${contentHtml}
  </div>

  <div class="footer-note">
    <span>CampusPulse Enterprise Documentation — Confidential & Institutional Property</span>
    <span>Generated: September 2026</span>
  </div>
</body>
</html>`;
}

// Documents to compile
const docsToCompile = [
  {
    folder: '01_project_overview',
    mdFile: 'CampusPulse_Project_Overview.md',
    pdfFile: 'CampusPulse_Project_Overview.pdf',
    title: 'CampusPulse - Project Overview & Master Architecture',
    category: '01 / Master Overview',
  },
  {
    folder: '02_frontend_architecture',
    mdFile: 'CampusPulse_Frontend_Architecture.md',
    pdfFile: 'CampusPulse_Frontend_Architecture.pdf',
    title: 'CampusPulse - Frontend Architecture & UI Manual',
    category: '02 / Frontend Engineering',
  },
  {
    folder: '03_backend_and_database',
    mdFile: 'CampusPulse_Backend_and_Database.md',
    pdfFile: 'CampusPulse_Backend_and_Database.pdf',
    title: 'CampusPulse - Backend, Database & Server Actions',
    category: '03 / Backend & Database',
  },
  {
    folder: '04_features_and_modules',
    mdFile: 'CampusPulse_Features_and_Modules.md',
    pdfFile: 'CampusPulse_Features_and_Modules.pdf',
    title: 'CampusPulse - Features, Modules & Business Logic',
    category: '04 / Feature Modules',
  },
  {
    folder: '05_deployment_and_devops',
    mdFile: 'CampusPulse_Deployment_and_DevOps.md',
    pdfFile: 'CampusPulse_Deployment_and_DevOps.pdf',
    title: 'CampusPulse - Deployment, DevOps & Infrastructure',
    category: '05 / DevOps & Deployment',
  },
  {
    folder: '06_mobile_android_capacitor',
    mdFile: 'CampusPulse_Mobile_Android_Capacitor.md',
    pdfFile: 'CampusPulse_Mobile_Android_Capacitor.pdf',
    title: 'CampusPulse - Native Android & Capacitor Mobile',
    category: '06 / Mobile Architecture',
  },
];

console.log('Starting CampusPulse Documentation PDF compilation...\n');

for (let item of docsToCompile) {
  const folderPath = path.join(process.cwd(), 'docs', item.folder);
  const mdPath = path.join(folderPath, item.mdFile);
  const pdfPath = path.join(folderPath, item.pdfFile);
  const tempHtmlPath = path.join(folderPath, 'temp_print.html');

  if (!fs.existsSync(mdPath)) {
    console.error(`Warning: ${mdPath} does not exist, skipping.`);
    continue;
  }

  console.log(`Processing: docs/${item.folder}/${item.mdFile} -> ${item.pdfFile}`);

  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const contentHtml = markdownToHtml(mdContent);
  const fullHtml = generateCompleteHtml(item.title, item.category, contentHtml);

  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

  try {
    const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${tempHtmlPath}"`;
    execSync(cmd, { stdio: 'pipe' });

    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log(` SUCCESS: Generated ${item.pdfFile} (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
      console.error(` FAILED: ${item.pdfFile} was not created.`);
    }
  } catch (err) {
    console.error(` ERROR compiling ${item.pdfFile}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

console.log('\nAll documentation PDFs successfully generated!');
