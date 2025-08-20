/*
Automated gallery updater
- Scans assets/images/products/All-Products/* for product image folders
- For each HTML with an <img id="mainImage" ...>, selects a best-matching folder
- Rewrites the main image src, thumbnail gallery (up to 6 images; fallback to 3), and preloadImage path

Run with: node update-galleries.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const ALL_PRODUCTS_DIR = path.join(ROOT, 'assets', 'images', 'products', 'All-Products');

function listDirectories(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function listImages(dir) {
  const exts = new Set(['.png', '.jpg', '.jpeg', '.webp']);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => exts.has(path.extname(name).toLowerCase()));
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\.html$/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(custom|company|profile|near|me|in|lagos|nigeria|and|of|the|a|an|with)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.html$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tokens(str) {
  return new Set(normalizeName(str).split(' ').filter(Boolean));
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  const inter = new Set([...a].filter((x) => b.has(x))).size;
  const union = new Set([...a, ...b]).size;
  return inter / union;
}

function bestFolderMatch(pageName, folders) {
  const pageTokens = tokens(pageName);
  const pageSlug = slugify(pageName);
  let best = null;
  let bestScore = -1;
  for (const folder of folders) {
    const base = folder;
    const scoreTokens = jaccard(pageTokens, tokens(base));
    const folderSlug = slugify(base);
    let scoreSlug = 0;
    if (folderSlug === pageSlug) scoreSlug = 0.6;
    else if (folderSlug.includes(pageSlug) || pageSlug.includes(folderSlug)) scoreSlug = 0.4;
    const score = scoreTokens + scoreSlug;
    if (score > bestScore) {
      bestScore = score;
      best = folder;
    }
  }
  // Accept only reasonable matches
  return bestScore >= 0.25 ? best : null;
}

function encodeSrc(p) {
  // Ensure forward slashes for URLs and encode URI components after root
  const url = p.split(path.sep).join('/');
  const parts = url.split('/');
  // Encode from after 'assets' to handle special chars safely
  return [parts[0], parts[1], ...parts.slice(2).map(encodeURIComponent)].join('/');
}

function updateMainImage(html, newSrc) {
  return html.replace(/<img([^>]*?)id=["']mainImage["']([\s\S]*?)>/i, (m, pre, post) => {
    let tag = `<img${pre}id="mainImage"${post}>`;
    if (/src=/.test(tag)) {
      return tag.replace(/src=["'][^"']*["']/, `src="${newSrc}"`);
    }
    return tag.replace('<img', `<img src="${newSrc}"`);
  });
}

function buildThumbnails(srcs) {
  const lines = srcs
    .map(
      (s, i) =>
        `                            <img src="${s}" alt="Product image ${i + 1}" class="thumbnail-image" onclick="updateMainImage(this.src)" loading="lazy" decoding="async">`
    )
    .join('\n');
  return `                        <div class="thumbnail-gallery">\n${lines}\n                        </div>`;
}

function updateThumbnails(html, thumbHtml) {
  return html.replace(
    /<div class=\"thumbnail-gallery\"[^>]*>[\s\S]*?<\/div>/i,
    thumbHtml
  );
}

function updatePreload(html, newSrc) {
  return html.replace(/preloadImage\(["'][^"']+["']\)/, `preloadImage('${newSrc}')`);
}

function pickImages(imgs) {
  if (imgs.length >= 6) return imgs.slice(0, 6);
  if (imgs.length >= 3) return imgs.slice(0, 3);
  return imgs.slice(0, imgs.length);
}

function processPage(htmlPath, folders) {
  const fileName = path.basename(htmlPath);
  const pageBase = fileName.replace(/\.html$/, '');
  const OVERRIDES = {
    'mugs.html': 'mug',
    'tshirt-printing.html': 'round-neck-tshirt-printing',
    'keyholder-printing.html': 'kry-holder',
    'label-sticker-printing.html': 'label-stricker',
    'standard-id-card-printing.html': 'i.d-card',
    'advert-banner-print.html': 'advertbanner',
    'bifold-product.html': 'bi-fold-brochure',
    'branded-hoodies.html': 'branded-hoddies',
    'desk-table-calendar-print.html': 'desktop-table-calender',
    'disposablebox.html': 'disposable-box',
    'boxflyer.html': 'box-flyer',
    'luxury-roundneck-print.html': 'custom-luxury-tshirt',
    'trifold-brochure-printing.html': 'Trifold-brochure',
    'invitations.html': 'invitattions',
    'pvc-transparent-plastic-business-card-print.html': 'pvc transparent-business-card',
    'standard-business-card-printing.html': 'standard-business-card',
    'sticker-printing.html': 'stricker-printing'
  };

  const match = OVERRIDES[fileName] || bestFolderMatch(pageBase, folders);
  if (!match) {
    return { updated: false, reason: 'no-match' };
  }

  const folderAbs = path.join(ALL_PRODUCTS_DIR, match);
  let images = listImages(folderAbs);
  if (images.length === 0) return { updated: false, reason: 'no-images', folder: match };

  // Try to prioritize files with '1'/'a' in name to be first
  images.sort((a, b) => a.localeCompare(b));

  const picked = pickImages(images);
  if (picked.length === 0) return { updated: false, reason: 'no-picked', folder: match };

  const srcs = picked.map((f) =>
    encodeSrc(path.join('assets', 'images', 'products', 'All-Products', match, f))
  );
  const mainSrc = srcs[0];

  let html = fs.readFileSync(htmlPath, 'utf8');
  if (!/id=["']mainImage["']/.test(html)) return { updated: false, reason: 'no-mainImage', folder: match };

  html = updateMainImage(html, mainSrc);
  if (/class=\"thumbnail-gallery\"/.test(html)) {
    html = updateThumbnails(html, buildThumbnails(srcs));
  } else {
    // Insert thumbnails right after main image
    const thumbs = buildThumbnails(srcs);
    html = html.replace(/(<img[^>]*id=["']mainImage["'][^>]*>)/i, `$1\n${thumbs}`);
  }
  html = updatePreload(html, mainSrc);

  fs.writeFileSync(htmlPath, html, 'utf8');
  return { updated: true, folder: match, images: picked.length };
}

function main() {
  const folders = listDirectories(ALL_PRODUCTS_DIR);
  const pages = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.join(ROOT, f));

  const targetPages = pages.filter((p) => /main-product-image/.test(fs.readFileSync(p, 'utf8')));

  const results = [];
  for (const page of targetPages) {
    try {
      const res = processPage(page, folders);
      results.push({ page: path.basename(page), ...res });
      console.log(`${path.basename(page)}: ${res.updated ? 'OK' : 'SKIP'}${res.folder ? ` [${res.folder}]` : ''}${res.images ? ` (${res.images})` : ''}${res.reason ? ` - ${res.reason}` : ''}`);
    } catch (err) {
      console.error(`${path.basename(page)}: ERROR`, err.message);
      results.push({ page: path.basename(page), updated: false, reason: 'error' });
    }
  }

  const summary = results.reduce(
    (acc, r) => {
      if (r.updated) acc.updated += 1; else acc.skipped += 1;
      return acc;
    },
    { updated: 0, skipped: 0 }
  );
  console.log(`\nUpdated: ${summary.updated}, Skipped: ${summary.skipped}`);
}

main();


