import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

// 始终以脚本所在目录为项目根目录，不依赖某台机器的绝对路径。
const DIR = path.dirname(fileURLToPath(import.meta.url));
const p = (f) => path.join(DIR, f);
const read = (f) => fs.readFileSync(p(f), "utf8");
const write = (f, s) => fs.writeFileSync(p(f), s);

function getSiteUrl() {
  const i = process.argv.indexOf("--site-url");
  const raw = i >= 0 ? process.argv[i + 1] : "";
  if (!raw) {
    console.error("未生成 SEO 文件：尚未提供正式域名。确定部署域名后执行：\n  node gen-seo.mjs --site-url https://你的正式域名");
    process.exit(2);
  }
  let u;
  try { u = new URL(raw); } catch { u = null; }
  if (!u || !["https:", "http:"].includes(u.protocol) || !u.hostname || u.hostname.includes("YOUR-DOMAIN")) {
    console.error("无效的 --site-url。请提供正式站点的完整 HTTP(S) 地址，例如 https://archive.example.com");
    process.exit(2);
  }
  return u.origin.replace(/\/$/, "");
}

// 在任何文件写入前先验证域名，避免错误配置污染 HTML / sitemap。
const SITE_URL = getSiteUrl();
const sandbox = { window: {} };
vm.createContext(sandbox);
["books.js", "movies.js", "episodes.js"].forEach((f) =>
  vm.runInContext(read(f), sandbox, { filename: f }));
const { BOOKS = [], MOVIES = [], EPISODES = [] } = sandbox.window;

write("robots.txt", `# LLTP ARCHIVE · 非官方粉丝档案\nUser-agent: *\nAllow: /\n\n# 本地分享卡工作台，不对搜索引擎开放\nDisallow: /share-studio.html\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log("robots.txt: ok");

const urls = [SITE_URL + "/", SITE_URL + "/movies.html"].concat(
  EPISODES.map((e) => SITE_URL + "/episodes.html?id=" + encodeURIComponent(e.id)),
  BOOKS.map((b) => SITE_URL + "/book.html?id=" + encodeURIComponent(b.id)),
  MOVIES.map((m) => SITE_URL + "/movie.html?id=" + encodeURIComponent(m.id))
);
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => "  <url><loc>" + u.replace(/&/g, "&amp;") + "</loc></url>").join("\n") +
  "\n</urlset>\n");
console.log("sitemap.xml: " + urls.length + " 条 URL");

const META = {
  "index.html": { title: "LLTP ARCHIVE · 书籍、电影与想法的活档案", desc: "受 Lily's Lost the Plot 启发的非官方书影档案：28 期节目、21 本书籍、14 部电影，以及对应的带读笔记。", url: SITE_URL + "/" },
  "movies.html": { title: "电影索引 · LLTP ARCHIVE", desc: "LLTP 节目里聊过的电影索引：片名、原名、上映年份、导演与对应期数。", url: SITE_URL + "/movies.html" },
  "episodes.html": { title: "期数详情 · LLTP ARCHIVE", desc: "LLTP 节目期数资料页：对应书目、片单与中字回放。", url: SITE_URL + "/episodes.html" },
  "book.html": { title: "书籍详情 · LLTP ARCHIVE", desc: "LLTP 关联书籍资料页：作者、提及期数、中文译本与相关影视改编。", url: SITE_URL + "/book.html" },
  "movie.html": { title: "电影详情 · LLTP ARCHIVE", desc: "LLTP 关联电影资料页：片名、原名、年份、导演与对应期数。", url: SITE_URL + "/movie.html" }
};
function setMeta(html, regex, replacement) {
  return regex.test(html) ? html.replace(regex, replacement) : html.replace("<link rel=\"icon\"", replacement + "\n<link rel=\"icon\"");
}
for (const [f, m] of Object.entries(META)) {
  let s = read(f);
  s = setMeta(s, /<meta name="description"[^>]*\/?\s*>/i, `<meta name="description" content="${m.desc}" />`);
  s = setMeta(s, /<link rel="canonical"[^>]*\/?\s*>/i, `<link rel="canonical" href="${m.url}" />`);
  s = setMeta(s, /<meta property="og:type"[^>]*\/?\s*>/i, '<meta property="og:type" content="website" />');
  s = setMeta(s, /<meta property="og:site_name"[^>]*\/?\s*>/i, '<meta property="og:site_name" content="LLTP ARCHIVE" />');
  s = setMeta(s, /<meta property="og:title"[^>]*\/?\s*>/i, `<meta property="og:title" content="${m.title}" />`);
  s = setMeta(s, /<meta property="og:description"[^>]*\/?\s*>/i, `<meta property="og:description" content="${m.desc}" />`);
  s = setMeta(s, /<meta property="og:url"[^>]*\/?\s*>/i, `<meta property="og:url" content="${m.url}" />`);
  s = setMeta(s, /<meta property="og:image"[^>]*\/?\s*>/i, `<meta property="og:image" content="${SITE_URL}/assets/og-cover.png" />`);
  s = setMeta(s, /<meta name="twitter:card"[^>]*\/?\s*>/i, '<meta name="twitter:card" content="summary_large_image" />');
  write(f, s);
  console.log(`${f}: meta 已更新`);
}

let nf = read("404.html");
if (!/<meta name="robots"/i.test(nf)) nf = nf.replace('<link rel="icon"', '<meta name="robots" content="noindex" />\n<link rel="icon"');
write("404.html", nf);
console.log("404.html: noindex 已确认");
