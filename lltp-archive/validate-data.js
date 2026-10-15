#!/usr/bin/env node
/**
 * LLTP ARCHIVE · 数据校验脚本（可重复执行的验收流程）
 * ============================================================================
 * 用法：
 *   node validate-data.js            # 在项目根目录执行
 *   node validate-data.js <目录>      # 指定含数据文件的目录
 *
 * 检查项：
 *   1. ID 唯一性（跨书籍 / 电影 / 期数）
 *   2. 关联有效性（引用的 id 必须存在）
 *   3. 双向关联一致性（book.episodeIds ↔ episode.bookIds，电影同理）
 *   4. 空链接 / 非法协议 / 假链接（#）
 *   5. 已核实记录是否具备证据（豆瓣链接）
 *   6. 字段完整性与取值合法性（kind / noteKind / rightsStatus / form / stats）
 *
 * 退出码：0 = 全部通过；1 = 有失败项（可直接接 CI）。
 * ============================================================================
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = process.argv[2] || __dirname;
const FILES = ["books.js", "movies.js", "episodes.js"];

/* ---------------- 载入数据 ---------------- */
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of FILES) {
  const full = path.join(DIR, f);
  if (!fs.existsSync(full)) { console.error("缺少数据文件：" + full); process.exit(1); }
  vm.runInContext(fs.readFileSync(full, "utf8"), sandbox, { filename: f });
}
const BOOKS = sandbox.window.BOOKS || [];
const MOVIES = sandbox.window.MOVIES || [];
const EPISODES = sandbox.window.EPISODES || [];
const SERIES_NOTES = sandbox.window.SERIES_NOTES || [];
const SITE_NOTICE = sandbox.window.SITE_NOTICE || null;

/* ---------------- 断言工具 ---------------- */
let pass = 0;
const failures = [];
function check(name, ok, detail) {
  if (ok) { pass++; console.log("  PASS  " + name); }
  else { failures.push(name + (detail ? " :: " + detail : "")); console.log("  FAIL  " + name + (detail ? " :: " + detail : "")); }
}
function section(t) { console.log("\n" + t); }
const isStr = (v) => typeof v === "string" && v.trim() !== "";
const isHttp = (v) => /^https?:\/\//i.test(String(v || ""));
const urlFields = (o) => ["cover", "doubanUrl", "xiaohongshuUrl", "officialUrl"]
  .concat(["replayUrl"])
  .filter((k) => k in o);

/* ---------------- 1. ID 唯一性 ---------------- */
section("[1] ID 唯一性");
const allIds = [...BOOKS, ...MOVIES, ...EPISODES].map((x) => x.id);
const dupIds = allIds.filter((id, i) => allIds.indexOf(id) !== i);
check("跨类型 ID 全局唯一", dupIds.length === 0, "重复：" + [...new Set(dupIds)].join(", "));
check("每条记录都有非空 id", [...BOOKS, ...MOVIES, ...EPISODES].every((x) => isStr(x.id)),
  [...BOOKS, ...MOVIES, ...EPISODES].filter((x) => !isStr(x.id)).length + " 条缺 id");

/* ---------------- 2. 关联有效性 ---------------- */
section("[2] 关联有效性（无孤立 ID）");
const dangling = [];
BOOKS.forEach((b) => (b.episodeIds || []).forEach((id) => { if (!EPISODES.some((e) => e.id === id)) dangling.push(b.id + " → " + id); }));
MOVIES.forEach((m) => (m.episodeIds || []).forEach((id) => { if (!EPISODES.some((e) => e.id === id)) dangling.push(m.id + " → " + id); }));
EPISODES.forEach((e) => {
  (e.bookIds || []).forEach((id) => { if (!BOOKS.some((b) => b.id === id)) dangling.push(e.id + " → " + id); });
  (e.movieIds || []).forEach((id) => { if (!MOVIES.some((m) => m.id === id)) dangling.push(e.id + " → " + id); });
});
check("所有引用都指向存在的记录", dangling.length === 0, dangling.join(", "));

/* ---------------- 3. 双向关联一致性 ---------------- */
section("[3] 双向关联一致性");
const asym = [];
BOOKS.forEach((b) => (b.episodeIds || []).forEach((id) => {
  const ep = EPISODES.find((e) => e.id === id);
  if (ep && !(ep.bookIds || []).includes(b.id)) asym.push("书 " + b.id + " → 期 " + id + " 未回链");
}));
MOVIES.forEach((m) => (m.episodeIds || []).forEach((id) => {
  const ep = EPISODES.find((e) => e.id === id);
  if (ep && !(ep.movieIds || []).includes(m.id)) asym.push("影 " + m.id + " → 期 " + id + " 未回链");
}));
EPISODES.forEach((e) => {
  (e.bookIds || []).forEach((id) => {
    const b = BOOKS.find((x) => x.id === id);
    if (b && !(b.episodeIds || []).includes(e.id)) asym.push("期 " + e.id + " → 书 " + id + " 未回链");
  });
  (e.movieIds || []).forEach((id) => {
    const m = MOVIES.find((x) => x.id === id);
    if (m && !(m.episodeIds || []).includes(e.id)) asym.push("期 " + e.id + " → 影 " + id + " 未回链");
  });
});
check("关联完全双向对称", asym.length === 0, asym.join("; "));

/* ---------------- 4. 空链接 / 非法链接 ---------------- */
section("[4] 链接检查（空链接 / 假链接 / 非法协议）");
const badLink = [];
const emptyLink = [];
[...BOOKS, ...MOVIES, ...EPISODES].forEach((o) => {
  urlFields(o).forEach((k) => {
    const v = o[k];
    if (v === undefined) return;
    if (v === null) return;
    if (typeof v !== "string") { badLink.push(o.id + "." + k + " 非字符串"); return; }
    if (v.trim() === "") {
      if (v.length > 0) emptyLink.push(o.id + "." + k + " 仅含空白字符");
      return;                                     // 真正的空字符串允许（表示暂缺）
    }
    if (v.trim() === "#") { badLink.push(o.id + "." + k + " 是假链接 #"); return; }
    if (!isHttp(v)) badLink.push(o.id + "." + k + " 协议非法：" + v);
  });
  // 内嵌链接
  (o.adaptations || []).forEach((a, i) => { if (isStr(a.doubanUrl) && !isHttp(a.doubanUrl)) badLink.push(o.id + ".adaptations[" + i + "]"); });
  (o.editions || []).forEach((e, i) => { if (isStr(e.doubanUrl) && !isHttp(e.doubanUrl)) badLink.push(o.id + ".editions[" + i + "]"); });
  (o.replays || []).forEach((r, i) => { if (isStr(r.url) && !isHttp(r.url)) badLink.push(o.id + ".replays[" + i + "]"); });
  (o.sources || []).forEach((s, i) => { if (isStr(s.url) && !isHttp(s.url)) badLink.push(o.id + ".sources[" + i + "]"); });
});
check("没有空链接 / 假链接 / 非法协议", badLink.length === 0, badLink.join(", "));
check("没有仅含空白的链接字段", emptyLink.length === 0, emptyLink.join(", "));

/* ---------------- 5. 已核实记录的证据 ---------------- */
section("[5] 已核实记录是否具备证据");
const noEvidence = [];
BOOKS.forEach((b) => { if (b.verificationStatus === "confirmed" && !isHttp(b.doubanUrl)) noEvidence.push(b.id + " 书：" + b.title); });
MOVIES.forEach((m) => { if (m.verificationStatus === "confirmed" && !isHttp(m.doubanUrl)) noEvidence.push(m.id + " 影：" + m.title); });
check("标为已核对的书籍 / 电影都有豆瓣条目作为证据", noEvidence.length === 0, noEvidence.join(", "));
const noteNoTitle = [...BOOKS, ...MOVIES, ...EPISODES].filter((o) => isHttp(o.xiaohongshuUrl) && !isStr(o.xiaohongshuNoteTitle));
check("有笔记链接的条目都填了笔记标题", noteNoTitle.length === 0, noteNoTitle.map((o) => o.id).join(", "));

/* ---------------- 6. 字段完整性与取值 ---------------- */
section("[6] 字段完整性与取值");
const needBook = ["id", "title", "author", "episodeIds", "tags", "summary", "verificationStatus", "chineseEdition", "adaptations", "editions", "rightsStatus"];
check("书籍字段齐全", BOOKS.every((b) => needBook.every((k) => k in b)),
  BOOKS.filter((b) => !needBook.every((k) => k in b)).map((b) => b.id).join(", "));
const needMovie = ["id", "title", "year", "director", "episodeIds", "summary", "verificationStatus", "rightsStatus"];
check("电影字段齐全", MOVIES.every((m) => needMovie.every((k) => k in m)),
  MOVIES.filter((m) => !needMovie.every((k) => k in m)).map((m) => m.id).join(", "));
const needEp = ["id", "episodeNumber", "title", "englishTitle", "kind", "summary", "bookIds", "movieIds", "verificationStatus", "replays"];
check("期数字段齐全", EPISODES.every((e) => needEp.every((k) => k in e)),
  EPISODES.filter((e) => !needEp.every((k) => k in e)).map((e) => e.id).join(", "));

check("电影数据结构与书籍分离（不含 tags / chineseEdition 等）",
  MOVIES.every((m) => !("tags" in m) && !("chineseEdition" in m) && !("adaptations" in m)));
const RIGHTS = ["placeholder", "licensed", "public-domain", "official-permission", "unknown"];
check("rightsStatus 取值合法", [...BOOKS, ...MOVIES].every((o) => RIGHTS.indexOf(o.rightsStatus) !== -1),
  [...BOOKS, ...MOVIES].filter((o) => RIGHTS.indexOf(o.rightsStatus) === -1).map((o) => o.id).join(", "));
check("期数 kind 取值合法", EPISODES.every((e) => ["book", "movie", "extra"].indexOf(e.kind) !== -1));
const KIND_OK = ["note", "shelf"];
check("笔记类型取值合法", EPISODES.every((e) => !e.noteKind || KIND_OK.indexOf(e.noteKind) !== -1));
check("系列笔记类型取值合法", SERIES_NOTES.every((s) => !s.kind || s.kind === "list"));
check("改编 form 取值合法", BOOKS.every((b) => (b.adaptations || []).every((a) => ["电影", "剧集"].indexOf(a.form) !== -1)));

section("[7] 规模与公告");
const epNumbers = EPISODES.filter((e) => e.episodeNumber != null).map((e) => e.episodeNumber).sort((a, b) => a - b);
console.log("  书籍 " + BOOKS.length + " · 电影 " + MOVIES.length + " · 期数 " + EPISODES.length);
console.log("  正片 " + epNumbers.length + " 期（" + epNumbers[0] + "–" + epNumbers[epNumbers.length - 1] + "）· 番外/预告 " + EPISODES.filter((e) => e.episodeNumber == null).length);
console.log("  中字回放覆盖 " + EPISODES.filter((e) => (e.replays || []).length).length + " 期");
console.log("  待核对条目 " + [...BOOKS, ...MOVIES, ...EPISODES].filter((o) => o.verificationStatus === "needs-review").length + " 条");
check("正片期数为 1–28 连续", epNumbers.length === 28 && epNumbers[0] === 1 && epNumbers[27] === 28);
check("公告指向的期数存在", !SITE_NOTICE || !SITE_NOTICE.episodeId || EPISODES.some((e) => e.id === SITE_NOTICE.episodeId));

/* ---------------- 汇总 ---------------- */
console.log("\n================ 结果 ================");
console.log("通过 " + pass + " · 失败 " + failures.length);
if (failures.length) {
  console.log("\n失败项：");
  failures.forEach((f) => console.log(" - " + f));
  process.exit(1);
}
console.log("数据校验全部通过。");
