import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

/* 把 books / movies / episodes 里出现的每个小红书链接生成二维码，
   内联进根目录的 qr.js（笔记ID → SVG 的 data URI）。
   页面在电脑端会显示二维码，方便手机扫码打开 —— 小红书电脑网页会强制
   登录，只有手机 App 能直接打开。

   依赖只用于「生成」阶段，站点本身不依赖任何库：
     npm i qrcode && node gen-qr.mjs
   数据里新增小红书链接后，重新跑一次即可。
*/

const DIR = path.dirname(fileURLToPath(import.meta.url));
const p = (f) => path.join(DIR, f);
const read = (f) => fs.readFileSync(p(f), "utf8");

let QRCode;
try {
  QRCode = createRequire(import.meta.url)("qrcode");
} catch {
  console.error("缺少依赖 qrcode。请先执行：\n  npm i qrcode\n再运行：node gen-qr.mjs");
  process.exit(2);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
["books.js", "movies.js", "episodes.js"].forEach((f) =>
  vm.runInContext(read(f), sandbox, { filename: f }));
const { BOOKS = [], MOVIES = [], EPISODES = [] } = sandbox.window;

const urls = new Set();
[...BOOKS, ...MOVIES, ...EPISODES].forEach((x) => {
  if (x && typeof x.xiaohongshuUrl === "string" && x.xiaohongshuUrl) urls.add(x.xiaohongshuUrl);
});

const map = {};
for (const url of urls) {
  const m = url.match(/[0-9a-fA-F]{16,}/); // 笔记 ID
  if (!m) {
    console.warn("跳过（无法解析笔记 ID）：" + url);
    continue;
  }
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    width: 132,
    color: { dark: "#252420", light: "#FFFFFF" },
  });
  map[m[0]] = "data:image/svg+xml;base64," + Buffer.from(svg, "utf8").toString("base64");
}

fs.writeFileSync(
  p("qr.js"),
  "/* 由 gen-qr.mjs 生成，请勿手动修改；新增小红书链接后重新运行 gen-qr.mjs。 */\n" +
    "window.XHS_QR = " + JSON.stringify(map, null, 2) + ";\n"
);
console.log("已生成 qr.js：包含 " + Object.keys(map).length + " 个小红书二维码");
