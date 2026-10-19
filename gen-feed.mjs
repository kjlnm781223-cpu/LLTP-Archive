/**
 * LLTP Archive · RSS 订阅源生成脚本
 * ------------------------------------------------------------
 * 用法：node gen-feed.mjs [--site-url https://你的正式域名]
 * 不传 --site-url 时，默认使用 GitHub Pages 域名（与 canonical 一致）。
 *
 * 规则：
 * - 订阅条目 = 全部期数（含番外 / 预告），按期数号从新到旧排列。
 * - 每条目的描述复用 episodes.js 的 summary（本期节目事实 + 作品钩子，不归因 Lily）。
 * - releaseDate / lastUpdated 为空时【不加】pubDate，绝不伪造日期。
 * - 零依赖，手写 RSS 2.0 XML。
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

// 始终以脚本所在目录为项目根目录，不依赖某台机器的绝对路径。
const DIR = path.dirname(fileURLToPath(import.meta.url));
const p = (f) => path.join(DIR, f);
const read = (f) => fs.readFileSync(p(f), "utf8");
const write = (f, s) => fs.writeFileSync(p(f), s);

const DEFAULT_SITE = "https://kjlnm781223-cpu.github.io/LLTP-Archive";

function getSiteUrl() {
  const i = process.argv.indexOf("--site-url");
  const raw = i >= 0 ? process.argv[i + 1] : "";
  if (!raw) return DEFAULT_SITE;
  let u;
  try { u = new URL(raw); } catch { u = null; }
  if (!u || !["https:", "http:"].includes(u.protocol) || !u.hostname) {
    console.error("无效的 --site-url，已回退到默认 GitHub Pages 域名。");
    return DEFAULT_SITE;
  }
  return u.origin.replace(/\/$/, "");
}

const SITE_URL = getSiteUrl();

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read("episodes.js"), sandbox, { filename: "episodes.js" });
const EPISODES = sandbox.window.EPISODES || [];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 有期数号的排前面（大的在前 = 最新一期最上面），无期数号的番外/预告放末尾。
const sorted = EPISODES.slice().sort((a, b) => {
  const na = a.episodeNumber == null ? -1 : a.episodeNumber;
  const nb = b.episodeNumber == null ? -1 : b.episodeNumber;
  return nb - na;
});

const items = sorted.map((e) => {
  const title = e.episodeNumber != null ? `LLTP 第 ${e.episodeNumber} 期 · ${e.title}` : e.title;
  const link = SITE_URL + "/episodes.html?id=" + encodeURIComponent(e.id);
  const desc = e.summary || e.title;
  // 无权威日期时不写 pubDate（宁缺勿编），阅读器按条目顺序展示。
  const pubDate = e.releaseDate || e.lastUpdated || "";
  return (
    "    <item>\n" +
    "      <title>" + esc(title) + "</title>\n" +
    "      <link>" + esc(link) + "</link>\n" +
    "      <guid isPermaLink=\"true\">" + esc(link) + "</guid>\n" +
    (pubDate ? "      <pubDate>" + esc(new Date(pubDate).toUTCString()) + "</pubDate>\n" : "") +
    "      <description>" + esc(desc) + "</description>\n" +
    "    </item>"
  );
});

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
  "  <channel>\n" +
  "    <title>LLTP ARCHIVE · 书影档案</title>\n" +
  "    <link>" + esc(SITE_URL + "/") + "</link>\n" +
  '    <description>受 Lily\'s Lost the Plot 启发的非官方书影档案：LLTP 节目期数、关联书籍与电影。</description>\n' +
  "    <language>zh-CN</language>\n" +
  '    <atom:link href="' + esc(SITE_URL + "/feed.xml") + '" rel="self" type="application/rss+xml" />\n' +
  "    <lastBuildDate>" + new Date().toUTCString() + "</lastBuildDate>\n" +
  items.join("\n") + "\n" +
  "  </channel>\n" +
  "</rss>\n";

write("feed.xml", xml);
console.log("feed.xml: " + items.length + " 条订阅条目（默认站点 " + SITE_URL + "）");
