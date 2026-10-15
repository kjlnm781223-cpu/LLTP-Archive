(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const typeSelect = $('recordType');
  const recordSelect = $('recordSelect');
  const templateSelect = $('templateSelect');
  const headlineInput = $('headlineInput');
  const subtitleInput = $('subtitleInput');
  const noteInput = $('noteInput');
  const tagInput = $('tagInput');
  const preview = $('cardPreview');
  const status = $('statusMessage');
  let currentRecord = null;
  let currentType = 'book';

  const escapeXml = (value) => String(value ?? '').replace(/[<>&"']/g, (ch) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[ch]));
  const text = (value, fallback = '') => String(value ?? '').trim() || fallback;
  const typeData = () => ({ book: window.BOOKS || [], movie: window.MOVIES || [], episode: window.EPISODES || [] }[typeSelect.value]);
  const typeLabel = (type) => ({book:'BOOK ARCHIVE',movie:'CINEMA INDEX',episode:'EPISODE FILE'}[type] || 'LLTP ARCHIVE');
  const typeNumber = (record, type) => {
    if (type === 'book') return record.id?.replace('book-', 'BOOK · ') || 'BOOK FILE';
    if (type === 'movie') return record.id?.replace('movie-', 'FILM · ') || 'FILM FILE';
    return record.episodeNumber ? `EPISODE · ${String(record.episodeNumber).padStart(2, '0')}` : (record.id === 'episode-frankenstein' ? 'EP.029 · PREVIEW' : 'SPECIAL FILE');
  };
  const relatedNames = (record) => {
    const bookMap = new Map((window.BOOKS || []).map((b) => [b.id, b.title]));
    const movieMap = new Map((window.MOVIES || []).map((m) => [m.id, m.title]));
    return [...(record.bookIds || []).map((id) => bookMap.get(id)).filter(Boolean), ...(record.movieIds || []).map((id) => movieMap.get(id)).filter(Boolean)];
  };
  const defaultCopy = (record, type) => {
    if (type === 'book') return { headline: record.title, subtitle: [record.author, record.originalTitle].filter(Boolean).join(' / '), note: record.summary || '一条来自 LLTP ARCHIVE 的作品档案。', tags: (record.tags || []).slice(0, 4).join(', ') };
    if (type === 'movie') return { headline: record.title, subtitle: [record.year, record.director, record.originalTitle].filter(Boolean).join(' / '), note: record.summary || '一条来自 LLTP ARCHIVE 的电影档案。', tags: 'FILM, LLTP ARCHIVE' };
    const works = relatedNames(record);
    return { headline: record.title, subtitle: record.episodeNumber ? `EPISODE ${String(record.episodeNumber).padStart(2,'0')}` : (record.id === 'episode-frankenstein' ? 'EP.029 PREVIEW' : 'SPECIAL EPISODE'), note: [record.summary, works.length ? `关联作品：${works.slice(0, 4).join('、')}${works.length > 4 ? '等' : ''}` : ''].filter(Boolean).join('\n'), tags: [record.kind === 'extra' ? 'SPECIAL' : record.kind?.toUpperCase(), record.verificationStatus === 'needs-review' ? 'REVIEW' : 'ARCHIVED'].filter(Boolean).join(', ') };
  };
  const currentCopy = () => ({ headline: headlineInput.value.trim(), subtitle: subtitleInput.value.trim(), note: noteInput.value.trim(), tags: tagInput.value.split(/[，,]/).map((x) => x.trim()).filter(Boolean).slice(0, 6) });
  const wrapText = (value, maxChars, maxLines = 3) => {
    const chars = [...String(value || '')]; const lines = []; let line = '';
    for (const char of chars) {
      if (line.length >= maxChars) { lines.push(line); line = ''; }
      line += char;
    }
    if (line) lines.push(line);
    if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = [...lines[maxLines - 1]].slice(0, Math.max(1, maxChars - 2)).join('') + '…'; }
    return lines;
  };
  const svgText = (lines, x, y, opts = {}) => {
    const { size = 50, lineHeight = 1.2, fill = '#252420', weight = 700, family = 'Noto Serif SC, Songti SC, serif', letter = 0, anchor = 'start' } = opts;
    return `<text x="${x}" y="${y}" fill="${fill}" font-family="${escapeXml(family)}" font-size="${size}" font-weight="${weight}" letter-spacing="${letter}" text-anchor="${anchor}">${lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * lineHeight}">${escapeXml(line)}</tspan>`).join('')}</text>`;
  };
  const svgLabel = (value, x, y, fill = '#252420', size = 18) => `<text x="${x}" y="${y}" fill="${fill}" font-family="DM Mono, monospace" font-size="${size}" letter-spacing="2">${escapeXml(value)}</text>`;
  const makeSvg = () => {
    const copy = currentCopy(); const type = currentType; const record = currentRecord; const template = templateSelect.value;
    const isReview = record.verificationStatus === 'needs-review';
    const isPreview = record.id === 'episode-frankenstein';
    const palettes = template === 'index' ? ['#dce66b','#252420','#e45b46'] : template === 'collage' ? ['#b9acd9','#252420','#e45b46'] : ['#f5f0e8','#252420','#e45b46'];
    const [paper, ink, accent] = palettes;
    const titleLines = wrapText(copy.headline || 'Untitled record', template === 'index' ? 10 : 12, 4);
    const subLines = wrapText(copy.subtitle, 35, 2);
    const noteLines = wrapText(copy.note, 36, 4);
    const tagList = copy.tags;
    let shapes = '';
    if (template === 'editorial') shapes = `<circle cx="920" cy="180" r="135" fill="#dce66b"/><circle cx="920" cy="180" r="94" fill="none" stroke="${ink}" stroke-width="2"/><path d="M790 180H1050M920 50V310" stroke="${ink}" stroke-width="1" opacity=".35"/>`;
    if (template === 'index') shapes = `<rect x="750" y="0" width="330" height="350" fill="${accent}"/><path d="M750 0L1080 350M830 0L1080 250M750 100L980 350" stroke="${ink}" stroke-width="2" opacity=".3"/><circle cx="925" cy="175" r="70" fill="${paper}" stroke="${ink}" stroke-width="2"/>`;
    if (template === 'collage') shapes = `<path d="M700 0H1080V320L920 285L800 345L700 230Z" fill="#dce66b"/><path d="M835 35L1020 65L990 230L810 205Z" fill="#e45b46" transform="rotate(-8 915 135)"/><circle cx="940" cy="130" r="54" fill="#b9acd9" stroke="${ink}" stroke-width="2"/><path d="M720 255l120 -25 45 60 -120 25z" fill="#a9c6d8" stroke="${ink}" stroke-width="2"/>`;
    const top = svgLabel(typeLabel(type), 72, 78, ink, 18);
    const number = svgLabel(typeNumber(record, type), 72, 122, accent, 17);
    const titleY = template === 'collage' ? 410 : 380;
    const titleSize = titleLines.length > 2 ? 66 : (titleLines.join('').length > 11 ? 74 : 88);
    const title = svgText(titleLines, 72, titleY, {size:titleSize,lineHeight:1.16,fill:ink,weight:900,letter:-3});
    const subtitle = svgText(subLines, 76, titleY + titleLines.length * titleSize * 1.16 + 35, {size:23,lineHeight:1.45,fill:ink,weight:500,family:'DM Sans, Noto Sans SC, sans-serif'});
    const noteY = Math.max(850, titleY + titleLines.length * titleSize * 1.16 + 35 + subLines.length * 33 + 52);
    const note = svgText(noteLines, 76, Math.min(noteY, 990), {size:25,lineHeight:1.55,fill:ink,weight:500,family:'DM Sans, Noto Sans SC, sans-serif'});
    let tags = ''; let tagX = 76; let tagY = 1150;
    tagList.forEach((tag, i) => { const width = Math.min(250, Math.max(90, [...tag].length * 21 + 34)); if (tagX + width > 1000) { tagX = 76; tagY += 55; } if (tagY < 1240) { tags += `<rect x="${tagX}" y="${tagY}" width="${width}" height="38" rx="0" fill="${i % 2 ? paper : accent}" stroke="${ink}" stroke-width="1.5"/><text x="${tagX + 16}" y="${tagY + 25}" font-family="DM Mono, monospace" font-size="15" fill="${ink}">${escapeXml(tag.toUpperCase())}</text>`; tagX += width + 12; } });
    const statusPill = isPreview ? `<rect x="760" y="72" width="245" height="42" fill="#e45b46"/><text x="882" y="99" text-anchor="middle" font-family="DM Mono, monospace" font-size="16" fill="#fffdf8" letter-spacing="1">PREVIEW / 预告</text>` : isReview ? `<rect x="820" y="72" width="185" height="42" fill="#252420"/><text x="912" y="99" text-anchor="middle" font-family="DM Mono, monospace" font-size="16" fill="#f5f0e8" letter-spacing="1">REVIEW / 待核实</text>` : '';
    const footer = `<path d="M72 1270H1008" stroke="${ink}" stroke-width="2"/><text x="72" y="1310" fill="${ink}" font-family="DM Mono, monospace" font-size="18" letter-spacing="1">LLTP ARCHIVE</text><text x="1008" y="1310" text-anchor="end" fill="${ink}" font-family="DM Mono, monospace" font-size="14" letter-spacing=".6">UNOFFICIAL FAN ARCHIVE</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="${paper}"/>${shapes}<rect x="36" y="36" width="1008" height="1278" fill="none" stroke="${ink}" stroke-width="2"/>${top}${number}${statusPill}${title}${subtitle}${note}${tags}${footer}</svg>`;
  };
  const render = () => {
    const svg = makeSvg(); preview.innerHTML = svg;
    const copy = currentCopy();
    const caption = `${copy.headline}${copy.subtitle ? `｜${copy.subtitle}` : ''}\n${copy.note}\n\n整理自 LLTP ARCHIVE 粉丝档案。非官方项目，作品权利归原作者及相关权利人所有。`;
    $('captionPreview').textContent = caption;
    status.textContent = '';
  };
  const populateRecords = (keepId = '') => {
    const records = typeData(); recordSelect.innerHTML = '';
    records.forEach((record) => { const option = document.createElement('option'); option.value = record.id; option.textContent = `${record.title || record.id}${record.verificationStatus === 'needs-review' ? ' · 待核实' : ''}`; recordSelect.append(option); });
    if (keepId && records.some((record) => record.id === keepId)) recordSelect.value = keepId;
    if (!recordSelect.value && records.length) recordSelect.selectedIndex = 0;
    loadRecord();
  };
  const loadRecord = () => {
    currentType = typeSelect.value;
    currentRecord = typeData().find((record) => record.id === recordSelect.value) || typeData()[0];
    if (!currentRecord) { preview.innerHTML = '<p>当前类型没有可用记录。</p>'; return; }
    const copy = defaultCopy(currentRecord, currentType);
    headlineInput.value = copy.headline; subtitleInput.value = copy.subtitle; noteInput.value = copy.note; tagInput.value = copy.tags;
    render();
  };
  const download = (filename, blob) => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
  const safeName = () => (currentRecord?.id || 'lltp-share-card').replace(/[^a-z0-9-_]/gi, '-');
  const downloadSvg = () => { download(`${safeName()}-${templateSelect.value}.svg`, new Blob([makeSvg()], {type:'image/svg+xml;charset=utf-8'})); status.textContent = 'SVG 已导出。矢量格式适合继续编辑或放大。'; };
  const downloadPng = async () => {
    try {
      const svgBlob = new Blob([makeSvg()], {type:'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svgBlob); const img = new Image();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350;
      const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('当前浏览器无法创建画布');
      ctx.fillStyle = '#f5f0e8'; ctx.fillRect(0,0,1080,1350); ctx.drawImage(img,0,0,1080,1350); URL.revokeObjectURL(url);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG 生成失败');
      download(`${safeName()}-${templateSelect.value}.png`, blob); status.textContent = 'PNG 已导出（1080 × 1350）。建议打开文件检查字体与换行后再发布。';
    } catch (error) { status.textContent = `PNG 导出失败：${error.message || '未知错误'}。请改用 SVG 导出。`; }
  };
  typeSelect.addEventListener('change', () => populateRecords());
  recordSelect.addEventListener('change', loadRecord);
  templateSelect.addEventListener('change', render);
  [headlineInput, subtitleInput, noteInput, tagInput].forEach((input) => input.addEventListener('input', render));
  $('downloadSvg').addEventListener('click', downloadSvg);
  $('downloadPng').addEventListener('click', downloadPng);
  $('resetCopy').addEventListener('click', loadRecord);
  $('copyCaption').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('captionPreview').textContent); status.textContent = '分享文案已复制。'; } catch { status.textContent = '浏览器未允许剪贴板访问，请手动选择并复制下方分享文案。'; } });
  populateRecords();
})();
