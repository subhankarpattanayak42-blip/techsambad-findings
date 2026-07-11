// Generate static Blogger-friendly HTML from index.html data
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/index.html', 'utf8');

const catMatch = src.match(/const CATEGORIES = (\{[\s\S]*?\});/);
const artMatch = src.match(/const ARTICLES = (\[[\s\S]*?\n\]);/);
const CATEGORIES = eval('(' + catMatch[1] + ')');
const ARTICLES = eval(artMatch[1]);

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

let toc = '';
let body = '';
let i = 0;
for (const [key, meta] of Object.entries(CATEGORIES)) {
  const items = ARTICLES.filter(a => a.c === key);
  if (!items.length) continue;
  i++;
  toc += `<li style="margin:6px 0;"><a href="#cat-${key}" style="color:#4338ca;text-decoration:none;font-weight:600;">${meta.icon} ${esc(meta.name)}</a> <span style="color:#888;font-size:13px;">— ${items.length} articles</span></li>\n`;

  body += `<h2 id="cat-${key}" style="font-size:22px;color:#1e1b4b;border-bottom:3px solid #818cf8;padding-bottom:8px;margin:40px 0 6px;">${i}. ${meta.icon} ${esc(meta.name)}</h2>\n`;
  body += `<p style="margin:0 0 18px;"><a href="#top" style="color:#888;font-size:12px;text-decoration:none;">↑ Back to contents</a></p>\n`;

  let j = 0;
  for (const a of items) {
    j++;
    const link = (a.u && a.u !== '#') ? ` &nbsp;<a href="${a.u}" style="color:#4338ca;font-weight:600;text-decoration:none;">Source ↗</a>` : '';
    body += `<div style="background:#f8f9fc;border:1px solid #e2e5f0;border-left:4px solid #818cf8;border-radius:8px;padding:14px 18px;margin:0 0 14px;">
<div style="font-size:12px;color:#6d28d9;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${esc(a.d)} &nbsp;·&nbsp; ${esc(a.a)}</div>
<div style="font-size:17px;font-weight:700;color:#111;margin:4px 0 6px;">${i}.${j} &nbsp;${esc(a.t)}</div>
<div style="font-size:14px;color:#444;line-height:1.55;">${esc(a.s)}${link}</div>
</div>\n`;
  }
}

const html = `<div id="top" style="font-family:Georgia,serif;max-width:760px;margin:0 auto;color:#222;">
<div style="text-align:center;padding:10px 0 20px;">
<div style="font-size:15px;color:#666;font-style:italic;">A curated intelligence archive of AI, agentic engineering &amp; vibe coding — the research vault behind TechSambad.</div>
<div style="font-size:14px;color:#6d28d9;font-weight:700;margin-top:8px;">${ARTICLES.length} articles · ${Object.keys(CATEGORIES).length} categories · May–July 2026</div>
</div>
<div style="background:#eef0fb;border:1px solid #d5d9f2;border-radius:10px;padding:18px 24px;margin-bottom:10px;">
<div style="font-size:18px;font-weight:700;color:#1e1b4b;margin-bottom:10px;">📖 Contents</div>
<ul style="list-style:none;padding:0;margin:0;">
${toc}</ul>
</div>
${body}
<hr style="border:none;border-top:1px solid #ddd;margin:36px 0 16px;">
<p style="text-align:center;color:#888;font-size:13px;">Built from the TechSambad Findings vault · Generated Jul 11, 2026<br>🤖 Kunia (AI, working for Subhankar)</p>
</div>`;

fs.writeFileSync(__dirname + '/blogger-post.html', html);
console.log('Wrote blogger-post.html:', html.length, 'bytes,', ARTICLES.length, 'articles');
