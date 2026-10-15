# LLTP ARCHIVE · V2.8

面向 Lily / NMIXX 粉丝的 **LLTP（Lily's Lost the Plot）节目内容档案网站**。

**产品定位：书籍为核心、电影轻量呈现、期数连接两者。**

产品主线：**节目期数 → 相关书籍 / 电影 → 作品资料 → 对应的小红书解读。**

这是一个**内容型资料库**，不是阅读管理应用。**完全免费**，不含付费、登录、阅读记录、评论区、数据库或任何服务端依赖。

---

## 1. 项目简介

- 纯静态站点：HTML + CSS + 原生 JavaScript + 本地 JS 数据文件。
- 无后端、无数据库、无账号、无支付、无构建步骤。
- 可直接部署到腾讯云 EdgeOne Pages、GitHub Pages、Netlify、Cloudflare Pages 等任意静态托管。
- 所有内容都在数据文件里，改数据即可更新网站，**不需要动渲染代码**。

当前收录：**28 期正片 + 2 条番外/预告**，**书籍 21 本**（核心）、**电影 14 部**（轻量索引）。
28 期正片的书名 / 片名**已全部确认**，且每一期都关联到具体作品；14 部电影也都已确认所属期数，没有「期数待补」。

## 2. 文件结构

```
lltp-archive/
├── index.html          首页
├── episodes.html       期数详情（?id=episode-xxx）
├── book.html           书籍详情（?id=book-xxx）
├── movies.html         电影索引
├── movie.html          电影详情（?id=movie-xxx）
├── 404.html            错误页（带 noindex）
├── style.css           设计系统（Token 全在 :root）
├── books.js            书籍数据（公共档案）
├── movies.js           电影数据（公共档案，结构与书籍分离）
├── episodes.js         期数数据 + SITE_NOTICE 公告 + SERIES_NOTES 合集笔记
├── reading-status.js   个人阅读标记存储模块（阶段 4 预留，暂无 UI）
├── script.js           渲染 / 搜索 / 筛选 / 交互
├── validate-data.js    数据校验脚本（node validate-data.js）
├── gen-seo.mjs         SEO 生成脚本（sitemap / robots / meta）
├── gen-qr.mjs          小红书二维码生成脚本（结果写入 qr.js）
├── assets/
│   ├── og-cover.png    社交分享预览图（1200×630）
│   └── gen_og.py       分享图生成脚本
├── sitemap.xml         由 gen-seo.mjs 生成
├── robots.txt          由 gen-seo.mjs 生成
├── qr.js               由 gen-qr.mjs 生成（小红书笔记二维码，内联 SVG）
├── favicon.svg
├── REVIEW-PACK.md      交付审核包（含源码，可交给其他 AI 审核）
└── README.md
```

> 数据文件用 `window.BOOKS` / `window.MOVIES` / `window.EPISODES` 全局变量 + 普通 `<script>` 引入，
> **不需要 ES Modules、也不需要本地服务器**就能直接打开（仍推荐用服务器预览）。

## 3. 本地运行方式

**方式 A：直接双击 `index.html`**（最简单，本站不依赖模块与网络）。

**方式 B：本地 HTTP 服务器**（更接近线上环境，推荐）：

```bash
# 在项目根目录执行任意一条
python3 -m http.server 8099
npx serve .
```

然后访问 `http://127.0.0.1:8099/`。

## 4. 如何新增书籍（核心板块）

打开 `books.js`，在 `window.BOOKS` 数组里追加一条：

```js
{
  id: "book-038",                       // 必须唯一，形如 book-0xx
  title: "书名",
  originalTitle: "Original Title",       // 没有就留 ""
  author: "作者名",
  cover: "",                             // 封面图地址，留空则自动生成排版封面
  doubanUrl: "",                         // 豆瓣链接，留空则不显示按钮
  chineseEdition: {
    hasSimplifiedChinese: null,          // true 有 / false 无 / null 未知
    publisher: "", translator: "", editionNote: "", sourceUrl: ""
  },
  episodeIds: ["episode-014"],           // 关联期数（可多个）
  tags: ["科幻"],
  summary: "一句话简介。",
  note: "",                              // 译名差异等核对备注，页面显示「注：…」
  verificationStatus: "needs-review",    // "confirmed" | "needs-review"
  sources: [{ label: "来源说明", url: "" }],
  xiaohongshuUrl: "",
  xiaohongshuNoteTitle: "",              // 已整理但未发布时，填这里
  lastVerified: "",                      // 最后核实日期 YYYY-MM-DD
  lastUpdated: ""                        // 最后更新日期 YYYY-MM-DD
}
```

> 书籍数据里**不要**出现 `year` / `director` 字段 —— 那是电影专用字段。

## 5. 如何新增电影记录（轻量板块）

打开 `movies.js`，在 `window.MOVIES` 数组里追加一条。电影字段与书籍**刻意不同**，只保留索引级信息：

```js
{
  id: "movie-015",                       // 必须唯一，形如 movie-0xx
  title: "电影名",
  originalTitle: "Original Title",
  year: 2013,                            // 未核实时写 null
  director: "导演名",                      // 未核实时写 ""
  cover: "",                             // 留空则自动生成排版海报
  doubanUrl: "",
  episodeIds: ["episode-022"],           // 关联期数（可多个，没有就 []）
  summary: "一句话简介或节目中涉及的主题。",
  sources: [{ label: "豆瓣条目页", url: "" }],
  xiaohongshuUrl: "",
  xiaohongshuNoteTitle: "",
  relatedBookIds: [],                    // 跨媒介专题关联（P2），目前留空
  verificationStatus: "confirmed",
  lastVerified: "2026-10-15",
  lastUpdated: ""
}
```

电影板块**刻意不做**：完整剧情、演员表、剧照、评分、影评、评论区、播放平台。
不要在电影记录里塞 `chineseEdition` / `tags` 这类书籍字段。

## 6. 如何关联节目期数（双向，必须成对）

期数文件 `episodes.js` 里，每一期同时持有两个数组：

```js
{
  id: "episode-014",
  episodeNumber: 14,
  title: "火星救援",
  kind: "book",                          // "book" 读书期 | "movie" 观影期 | "extra" 番外/预告
  releaseDate: "",
  summary: "共读安迪·威尔《火星救援》。",
  officialUrl: "",
  xiaohongshuUrl: "",
  xiaohongshuNoteTitle: "",
  bookIds: ["book-009"],                 // ↔ books.js 的 episodeIds
  movieIds: [],                          // ↔ movies.js 的 episodeIds
  verificationStatus: "confirmed",
  lastVerified: "",
  lastUpdated: ""
}
```

**成对规则（务必遵守）**：

- 书上写 `episodeIds: ["episode-014"]`，期数就要写 `bookIds: ["book-009"]`，反之亦然。
- 电影同理，用 `movieIds` ↔ `episodeIds`。
- **一期可以同时关联多本书和多部电影**：`bookIds` 与 `movieIds` 各写各的，互不影响。
  期数详情页会分成「相关书籍」「相关电影」两个面板分别展示。
- **同一本书 / 一部电影出现在多期时，只保留一条主记录**，把多个期数 id 都写进它的 `episodeIds`
  （参考 `book-012 了不起的盖茨比`，同时属于 `episode-019` 与 `episode-guanshu`）。
- 书籍与电影的关联**分开维护**，不要互相塞进对方的数组里。

## 7. 如何设置小红书解读、官方节目和豆瓣链接

- **小红书解读**：填 `xiaohongshuUrl`（完整 `https://` 链接）。
  - 填了链接 → 显示按钮「查看本期小红书解读 ↗」。
  - 没填但填了 `xiaohongshuNoteTitle` → 显示「解读已整理 · 链接待补」。
  - 都没有 → 显示「解读暂未发布」。**不会**用 `#` 或假链接占位。
- **官方节目来源**：`episodes.js` 对应期的 `officialUrl`，留空即隐藏按钮并提示缺失。
- **豆瓣链接**：书籍填 `books.js` 的 `doubanUrl`（`book.douban.com`），电影填 `movies.js` 的 `doubanUrl`（`movie.douban.com`）。

三者是**不同内容，分别维护**。目前书籍与电影的豆瓣链接已核对填入；**官方节目来源仍为空**，需要补充。

### 7.1 如何设置置顶公告（新一期 / 预告）

打开 `episodes.js` 顶部的 `window.SITE_NOTICE`。它只在**首页**、紧贴导航栏下方展示，打开网站就能看到：

```js
window.SITE_NOTICE = {
  active: true,                 // false 则整条不显示
  label: "下一期预告",
  title: "第 29 期预告 · 弗兰肯斯坦",
  text: "玛丽·雪莱《弗兰肯斯坦》——预告已放出，正片发布后这里会更新。",
  episodeId: "episode-frankenstein",   // 点「查看 →」跳到这一期；不要跳转就留 ""
  updatedAt: ""
};
```

**新一期发布后的标准操作**：把 `label` 改成「最新一期」/`title`/`text`/`episodeId` 换成新那期，
同时把 `episodes.js` 里对应记录的 `episodeNumber` 补上、`note` 清空。想让公告消失就设 `active: false`。

**关于右上角的 ×**：关闭只对**本次访问**生效（存在 `sessionStorage`）。重开网站仍会出现——
这是刻意的，因为公告的目的就是「一打开网站就让人看到」。想彻底关掉，改 `active: false`。

### 7.2 如何添加系列级笔记（不属于某一期）

见 `episodes.js` 的 `window.SERIES_NOTES`，用于「全系列总览 / 目录」这类笔记：

```js
window.SERIES_NOTES = [
  {
    title: "KPOP和读书之间的伟大桥梁",
    scope: "全系列 · 28 期总览",     // 显示在卡片第二行
    url: "https://www.xiaohongshu.com/explore/xxxx"
  }
];
```

它会出现在首页「小红书解读」区块，按钮文案为「查看小红书笔记 ↗」。
若某篇笔记已由期数条目展示，作品条目不会重复出现同一条（按 URL 去重）。

## 8. 如何核实与维护电影资料

1. **先查来源再落笔**：年份 / 导演 / 原名以豆瓣电影条目页为准（或影片官方页）。
2. **片名同名要区分**：例如《芝加哥》是 2002 年歌舞片、《发胶》是 2007 年歌舞片、《歌舞青春》是 2006 年迪士尼电影。
   核对结果与原记录不符时，以来源为准。
3. **未核实的一律留空**：`year` 写 `null`、`director` 写 `""`，并标 `verificationStatus: "needs-review"`。
   页面会显示「年份待补 / 导演待补」，**绝不展示猜测值**。
4. **期数不能猜**：只有确认这一期聊了这部电影才填 `episodeIds`；不确定就留 `[]`，并标「待核对」。
5. **译名对不上时写进 `note`**：同一部片常有多个中文译名（例如 Dreamgirls 豆瓣条目叫《梦女孩》、
   也译作《追梦女郎》）。以豆瓣条目名为准存 `title`，其余译名写进 `note`，页面会显示「注：…」。
6. 核实完成后，把 `lastVerified` 填成当天日期；内容有更新时再填 `lastUpdated`。

当前状态：14 部电影全部已核对（`confirmed`），且都关联到了具体期数。译名差异已记录在各自的 `note` 里。

## 9. 如何添加本地封面

1. 建 `assets/` 目录，把封面图放进去（建议 3:4 竖图，如 600×800）。
2. 在 `books.js` / `movies.js` 里把 `cover` 改成 `"assets/你的图.jpg"`。

图片加载失败会自动回退到站点自动生成的排版封面（书籍=书名+作者，电影=片名+年份），不会破图、不会撑破布局。
当前未内置任何图片，全部使用排版封面。

## 10. 如何标记核实状态

| 值 | 含义 | 页面显示 |
|---|---|---|
| `"confirmed"` | 已核对 | 绿色「已核对」 |
| `"needs-review"` | 待核对（译名 / 期数未知等） | 黄色「待核对」 |
| `"unverified"` | 未核实 | 灰色「未核实」 |

**没有把握就标 `needs-review`，不要标 `confirmed`。**

## 11. 如何部署到 EdgeOne Pages

1. 把整个 `lltp-archive/` 目录（含全部文件）上传为一个仓库，或直接上传 ZIP 包。
2. 在 EdgeOne Pages 新建项目 → 选择「静态站点 / 直接上传」。
3. 部署配置：
   - **构建命令：留空（无需构建）**
   - **输出目录 / 发布目录：`/`（项目根目录）**
   - **入口文件：`index.html`**
4. 部署完成后，`/episodes.html?id=xxx`、`/book.html?id=xxx`、`/movie.html?id=xxx` 均为普通静态页，刷新不会 404。
5. 建议在托管平台设置 **自定义 404 页面 → `404.html`**（本项目已提供）。

## 12. 如何更新网站内容

1. 编辑 `books.js` / `movies.js` / `episodes.js`（新增条目、补链接、改核实状态）。
2. 有真实更新时，把对应条目的 `lastUpdated` 填成当天日期（`YYYY-MM-DD`），首页「最近更新」会自动按真实日期排序。
3. 重新部署（重复第 11 节）。

## 13. 目前的技术限制与未实现功能

**未实现（按需求刻意不做）**：付费解锁码 / 付费墙 / 购买支付 / 注册登录 / 阅读标记按钮与个人清单 UI / 个人笔记 / 阅读统计 / 云同步 / 评论区 / 推荐算法 / 后台数据库。阅读状态的 localStorage 存储接口已预留，但当前不显示按钮，也没有跨设备同步。电影板块同样不做完整剧情、演员表、剧照、评分、影评与播放平台。跨媒介专题关联（书籍 ↔ 电影）属 P2，字段 `relatedBookIds` 已预留但未启用。

**当前限制**：

- **官方节目来源为空**：没有可核实来源，页面显示明确缺失提示，不伪造。豆瓣链接（36/37 条）与小红书解读（12 条记录 / 3 篇笔记）已填。
- **封面为自动生成**：尚未放入真实封面图。
- **部分数据待核对**：番外「逛书架」中《密林勿近》《我存在》等书目的译名尚未完全核实，标记为「待核对」。
- **无发布日期**：未找到可靠来源，`releaseDate` 统一留空，页面如实显示「未记录」。
- **搜索为前端内存匹配**：数据量级（几十~几百条）完全够用；上万条时需另议。
- **移动端**：已做响应式与窄屏适配，但未在真机 / 375px 视口实测。

---

## 14. 资料来源与借鉴

站内的期数清单与作品对应关系**由站主本人整理提供**，年份 / 导演 / 出版社 / 译者等取自豆瓣条目页这类公开事实库，
两者都不属于「搬运他人内容」，因此**页面不做第三方来源标注**（只保留豆瓣、小红书等可点击外链按钮）。

设计与交互上参考过以下公开来源，各自借鉴了什么记录在此，方便日后回溯：

| 来源 | 借鉴的点 | 落地位置 |
|---|---|---|
| 豆瓣（书籍 / 电影条目页） | `又名`（一片多译名）、年份、导演、出版社 / 译者 | `note`、`year`、`director`、`chineseEdition` |
| thewiki.kr（NMIXX 直播列表） | 每期配官方 YouTube 链接与播出日期 | **尚未落地**，见下方说明 |
| 小红书笔记（缘浅） | ① 书单按类型归组（推理 / 科幻 / 经典…）② 逛书架只收 Lily 本人提到的书，编辑推荐的另外两本已剔除 | 首页书籍「按主题」分组视图 |
| 我方《28 期一览》图 | 列表式速查比卡片更快 | 首页「节目期数」的 **卡片 / 列表** 切换 |
| Favorbook（K-pop 书单档案） | 「只收录可核实条目」的理念 | 以 `verificationStatus`「已核对 / 待核对」体现 |

**尚未落地的一项**：thewiki.kr 的直播列表给每期配了官方 YouTube 链接与播出日期，这正是 `releaseDate` / `officialUrl` 的来源。
但**它的期数编号与我们的清单差一位**（它把《火星救援》标为 #13，实际是第 14 期）——
既然我们的期数是对的，就说明它的编号不可直接采信，因此**不写入任何链接和日期**，避免张冠李戴。字段已预留，拿到可靠映射后填入即可。

---

## 15. 视觉设计说明（V2.0）

### 方向

**独立文学杂志 × 电影档案馆 × 轻度拼贴。** 目标是让人一眼看出这是一个有编辑判断的文化档案，
而不是模板套色的书单站，也不是应援站。

### 色彩 Token（全部定义在 `style.css` 的 `:root`）

| Token | 值 | 用途 |
|---|---|---|
| `--paper` / `--paper-2` / `--paper-3` | `#F5F0E8` / `#EFE8DC` / `#E6DDCD` | 暖纸张底色，承担全部界面底色 |
| `--ink` / `--ink-2..4` | `#252420` → 灰阶 | 正文与层级化元数据 |
| `--vermilion` | `#E45B46` | **品牌强调色**：期数编号、链接、标记、hover |
| `--lavender` | `#B9ACD9` | 书籍类标签、备注块 |
| `--acid` | `#DCE66B` | 极少量高亮（选中文字、公告标签） |
| `--mist` | `#A9C6D8` | 电影类标签 |

比例控制：**暖纸 + 墨色占 90% 以上**，红橙只出现在编号/链接/hover，
紫、浅蓝、荧光黄仅用于分类标签与个别装饰。**没有**蓝紫渐变、玻璃拟态、发光效果。

### 字体

| 角色 | 字体 | 说明 |
|---|---|---|
| 品牌 / 标题 / 书名 | `--font-serif` | Songti SC / Noto Serif SC / Georgia 回退链，中英文都走衬线 |
| 导航 / 正文 / 控件 | `--font-sans` | PingFang SC → 系统无衬线，中文优先 |
| 期数 / 年份 / 英文原名 / 元数据 | `--font-mono` | 等宽 + 大写 + `letter-spacing`，构成「档案元数据语言」 |

英文只承担品牌与元数据（LLTP ARCHIVE、Vol. 01、BK—011、Year / Director），正文与说明一律中文。

### 版面

- **首页**是杂志封面式非对称布局：左侧大标题 + 英文副题 + 中文导语 + 搜索；右侧是三张**真实条目**的拼贴卡（最近三期），底部是**真实统计**（28 Episodes / 23 Books / 14 Films / 4 Notes）。
- **章节**统一用「编号 — 英文名」小节头（`01 — Spotlight`…）+ 2px 粗线分隔，形成翻阅节奏。
- **Spotlight 只收录已发布真实解读链接的条目**，不做热度排序、不包装成「编辑推荐」。
- **详情页各不相同**：书籍 = 封面 + 档案编号印章 + 作者/原文名/出版信息；电影 = 影视档案条（Year / Director / Episodes）；期数 = 期号印章 + 双栏「相关书籍 / 相关电影」。

### 设计细节（已实现）

档案编号（`BK—011` / `FL—07` / `EP.14`）、页码式小节编号、纯 CSS 纸张纹理、hairline 分隔线、
卡片 hover 位移 + 实色投影（`translate(-3px,-3px)` + 硬阴影，杂志印刷感）、
统一的 focus-visible 描边、`prefers-reduced-motion` 降级、空状态 / 缺图 / 搜索无结果均有完整设计。

### 素材与版权

不使用任何艺人照片、专辑图、电影剧照或受版权保护的封面。
封面一律是**站点生成的排版封面**（书名 + 作者 + 纸色块），品牌辨识度来自排版、编号、线与几何，而非图片。

---

## 16. 图片使用规范（版权策略）

**默认不展示任何外部书封、海报或剧照。** 所有封面都是站点用 CSS 生成的**排版封面**
（书名 / 片名 + 作者 / 年份 + 纸色块 + 档案编号体系），有明确的设计意图，不是灰色占位框。

### 三个字段（`books.js` / `movies.js` 每条都有）

| 字段 | 说明 |
|---|---|
| `cover` | 图片地址。**留空 = 用排版封面**（当前全部如此） |
| `rightsStatus` | `"placeholder"`（默认，只用排版封面）/ `"licensed"` / `"public-domain"` / `"official-permission"` / `"unknown"` |
| `imageSource` | 图片来源页面 URL，用于留存取证 |
| `licenseNote` | 授权条款或使用条件说明（如「CC BY-SA 4.0」「已邮件获授权，2026-10-15」） |

### 显示规则（已在前端强制）

`script.js` 的 `coverEl()` 里有一道白名单：

```js
var APPROVED = ["licensed", "public-domain", "official-permission"];
if (src && APPROVED.indexOf(item.rightsStatus) !== -1) { 显示图片 }
else { 用排版封面 }
```

也就是说 **`rightsStatus` 不是上述三个值之一，图片一律不显示**，
即使 `cover` 填了地址也不会渲染。图片加载失败（`onerror`）同样回退到排版封面，不影响布局。

### 维护流程

1. 找到想用的图片 → 确认授权（开放许可 / 公有领域 / 已获授权 / 适用法律例外）。
2. 在数据里填 `cover`、`imageSource`、`licenseNote`，并把 `rightsStatus` 改成对应的白名单值。
3. **不要**把图片下载进仓库或复制到自己的服务器；即使使用外链，也要确认允许这样使用。
4. 授权存疑就不填 `rightsStatus`（保持 `"placeholder"`），页面自动用排版封面。
5. 未来做专题或付费内容时，**重新核查一遍授权范围**——免费可用不等于商用可用。

### 16.4 素材调研结论（2026-10 核查）

对全部 21 本书 + 14 部电影做过一轮可用素材核查，结论如下：

**可用（候选，均已登记在数据里但尚未启用）**

原著在 1929 年前于美国进入公有领域的作品，其**早期版本扫描件**（书名页 / 首刊封面 / 内页插图）有可能可用：

| 书 | 候选素材 | 记录位置 |
|---|---|---|
| 傲慢与偏见 | 1813 年首版书名页；1833 年 Bentley 版插图 | `book-011` 的 `imageSource` / `licenseNote` |
| 爱玛 | 1815/1816 年首版书名页 | `book-019` |
| 血字的研究 | 1887 年《Beeton's Christmas Annual》首刊封面 | `book-021` |
| 弗兰肯斯坦 | 1818 年首版书名页 | `book-037` |

**这些候选目前 `rightsStatus` 仍是 `placeholder`，页面上不会显示** —— 因为作者本机与沙箱都**无法直连
commons.wikimedia.org 逐字核验文件页的授权标签**。按第 16 节的白名单规则，未核实的素材一律不展示。

**启用的三步**（核验后照做即可，不需要改代码）：

1. 打开该书的 `imageSource` 页面，确认 Licensing 段落明确写着 Public Domain / CC0 / CC BY 等；
2. 把 `licenseNote` 更新为核验日期与许可证名称（例如「Public Domain，2026-10-20 核验」）；
3. 把 `cover` 填成图片直链、`rightsStatus` 改成 `"public-domain"`（或 `"licensed"` / `"official-permission"`）。

**不可用（明确结论，不要再找）**

- **14 部电影的海报全部不可用**：均为 1990 年后作品，仍在版权期内。
- **17 本书的现代封面不可用**：出版社封面设计受版权保护。
- **Open Library Covers API 不可用**：官方只提供接口与礼貌性使用要求，**未授予任何图片再利用许可**；
  封面版权仍属出版社 / 设计方。（其目录元数据是 CC0，但封面图片不在 CC0 范围内。）
- 豆瓣、Pinterest、出版社与发行方官网、搜索引擎图片：一律不可用。

**可用于装饰的来源**

- **Unsplash** / **Pexels**：其自有许可明确允许免费使用（含商用）且无需署名，可用于「书 / 书架 / 阅读 / 影院」
  这类**泛主题氛围图**。但许可同时排除「画面中呈现的受版权保护作品」，因此**只能当背景装饰，不能冒充任何具体作品的封面或海报**。
  当前站点未使用任何此类图片；如需使用，同样要走 `RIGHTS` 白名单流程。

### 16.5 明确不使用的素材

Lily 的照片、NMIXX 官方图片、专辑视觉、节目截图、电影剧照，以及从搜索引擎 / 豆瓣 / Pinterest /
出版社或发行方站点直接扒下来的封面与海报，一律不用作装饰或展示。

---

## 17. 数据字段说明（公共档案）

### 17.1 命名与 ID

- 所有记录使用**稳定 ID**：`book-0xx` / `movie-0xx` / `episode-0xx`。ID 一旦发布不再改动，
  译名变化只改 `title`，不新建记录（避免同一本书因译名不同产生重复条目）。
- 书籍与电影**书名 / 片名统一使用豆瓣条目名**，其余译名写进 `note`。
- 期数标题同样对齐豆瓣条目名，节目里的叫法差异写进 `note`。

### 17.2 三类关系的区分（互不混用）

| 概念 | 承载字段 | 说明 |
|---|---|---|
| **节目提及关系** | 书 / 影的 `episodeIds`、期数的 `bookIds` / `movieIds` | 双向成对，只表达「这期聊到了这个作品」 |
| **作品信息** | `title / originalTitle / author / year / director / chineseEdition / tags / summary` | 作品本身的属性 |
| **链接有效性** | `doubanUrl / xiaohongshuUrl / replays[].url / adaptations[].doubanUrl / editions[].doubanUrl` | 留空 = 暂缺；非空必须是 http(s)，禁止 `#` |
| **图片授权** | `cover / rightsStatus / imageSource / licenseNote` | 只有白名单状态才渲染图片，详见第 16 节 |

### 17.3 笔记与合集的区分

`episodes.js` 与 `SERIES_NOTES` 用 `noteKind` / `kind` 区分三类内容，**不混称「解读」**：

| 类型 | 取值 | 含义 | 当前实例 |
|---|---|---|---|
| 单本笔记 | `note`（默认） | 一期一本书的归纳笔记 | 傲慢与偏见（第 17 期） |
| 书架合集 | `shelf` | 番外「逛书架」，一次介绍多本 | 番外 · 逛书架 |
| 书单合集 | `list`（`SERIES_NOTES`） | 全系列总览 | KPOP和读书之间的伟大桥梁 |

首页「精选」按 **书单合集 → 书架合集 → 单本笔记** 排序。

### 17.4 待核实清单

标为 `needs-review` 的条目共 **9 条**，均因「译名或作者尚未最终确认」，页面**不显示核实徽标**
（徽标机制已移除，避免噪声），仅在数据中保留状态。清单：

- `book-029` 密林勿近：确认为繁体版，作者 C. G. 德鲁丝，简体版未见
- `book-033` 我存在：作者玛姬·欧法洛，与《I Am, I Am, I Am》的对应关系属推断
- `episode-guanshu` 番外 · 逛书架：整期属于整理图转录
- `episode-frankenstein` 第 29 期预告 · 弗兰肯斯坦：尚未播出
- 其余为番外书目（`book-030/031/032/034/037`）：书目成立，但「这期确实提到过」仅有一份整理图作依据

---

## 18. 校验脚本（可重复执行的验收流程）

```bash
node validate-data.js        # 在项目根目录执行；退出码 0 = 通过，1 = 有失败项
node test-reading-status.js  # 阅读状态模块的本地安全性测试
```

检查项：

1. **ID 唯一性** —— 跨书籍 / 电影 / 期数查重
2. **关联有效性** —— 引用的 id 必须存在（发现孤立 ID）
3. **双向关联一致性** —— `book.episodeIds ↔ episode.bookIds`，电影同理
4. **链接检查** —— 空链接、假链接 `#`、非法协议
5. **已核实是否具备证据** —— `confirmed` 的记录必须有豆瓣条目
6. **字段完整性与取值** —— `kind / noteKind / rightsStatus / adaptations.form` 等枚举合法性
7. **规模与公告** —— 正片期数连续、公告指向的期数存在

可直接接 CI：失败时退出码为 1。

---

## 19. 阅读标记模块（阶段 4 · 仅预留接口）

`reading-status.js` 提供个人阅读状态的存储接口。**前端目前没有任何标记按钮**，
本阶段只做数据与代码结构的准备，不开发账号、云同步或完整的阅读管理界面。

```js
window.ReadingStatus.getReadingStatus(workId)        // → {status, updatedAt, scope} | null
window.ReadingStatus.setReadingStatus(workId, status) // status ∈ want_to_read | reading | read
window.ReadingStatus.removeReadingStatus(workId)
window.ReadingStatus.getReadingList()                 // → [{workId, status, updatedAt, scope}]
window.ReadingStatus.clearAll()                       // 危险操作，需显式调用
window.ReadingStatus.available()                      // 浏览器是否允许存储
window.ReadingStatus.version                          // 存储结构版本（当前 1）
```

设计边界：

- **公共数据与个人数据完全分离**：阅读状态只写 `localStorage`（键名 `lltp.reading.status`），
  **绝不写入 `books.js` / `movies.js` / `episodes.js`**。
- **按稳定作品 ID 关联**：只用 `book-011` 这类 ID，不依赖书名。
- **版本化**：存储内带 `version` 字段，未来改结构时按版本迁移，不猜测旧数据。
- **不自动覆盖**：只有显式调用 `setReadingStatus` / `removeReadingStatus` 才写盘。
- **失败安全**：浏览器禁用存储、JSON 损坏、未来版本数据、状态名非法、workId 为空 → 降级为「读不到」或拒绝写入，
  不抛异常、不覆盖损坏数据，也不让旧版模块覆盖未来版本的数据。
- **为版本级标记预留**：`scope` 字段留空即表示「按作品标记」；未来要按版本标记时填入版本标识。
- **不含后端**：未引入数据库、登录或任何第三方服务。是否需要跨设备同步，等核心档案稳定后再决定。

---

## 20. SEO 与部署后检查

```bash
node gen-seo.mjs --site-url https://你的正式域名  # 配置正式域名后生成 sitemap / robots / meta
```

- **配置正式域名后再做**：执行 `node gen-seo.mjs --site-url https://你的正式域名` 生成 sitemap、robots 与 canonical/分享 URL；未配置域名时不要生成带占位域名的 SEO 文件。
  当前尚未部署，HTML 不含虚构 canonical/分享 URL，sitemap 暂为空；这是预部署状态，不应提交给搜索引擎。
- 已配置：`canonical`、`og:title / og:description / og:url / og:image`、`twitter:card`、
  分享预览图 `assets/og-cover.png`（1200×630，站点自己生成，无版权素材）。
- `404.html` 带 `noindex`。
- **已知限制**：详情页是纯静态 + 查询参数，OG 标签**无法按条目动态变化**，
  分享任意详情页都会显示站点级卡片。要做到每条目独立预览，需要预渲染或服务端渲染。

---

## 21. 小红书链接的打开方式（电脑 / 手机）

小红书网页版强制登录（登录墙），**直接点链接常常只到登录页**，只有手机 App 能真正打开；
微信 / QQ / 百度等**内置浏览器还会拦截「网页跳 App」**，百度甚至会把跳转变下载——这些都是
平台策略，静态站点绕不过去，只能尽量兜底。

**手机端**（`xhsLinkNodes`）
- 主按钮先尝试用 URL Scheme 唤起 App（`xhsdiscover://item/{笔记ID}`），1.2 秒内没唤起就自动退回网页链接。
- 旁边给一个「复制链接」：跳转失败时，复制后到小红书 App 内粘贴也能打开。
- 在微信 / QQ / 百度 / 微博等内置浏览器里时，按钮下方会出现提示，引导「在浏览器打开」。

**电脑端**：那一行会附一张二维码，扫码用手机进 App（≥721px 显示，手机端自动隐藏）。

**二维码生成**：`node gen-qr.mjs` → 写入根目录 `qr.js`（笔记 ID → 内联 SVG 的 data URI），
页面用 `<script src="qr.js">` 引入；未生成二维码的链接不显示二维码，不影响页面。
生成脚本依赖 `qrcode`，**只在生成阶段用**，站点自身不依赖任何库：

```bash
npm i qrcode && node gen-qr.mjs   # 数据里新增小红书链接后重新跑一次
```

**已知限制**：URL Scheme 与各浏览器行为随 App / 系统版本变化，站点侧无法保证 100% 唤起成功。

---

## 22. 阶段进度

| 阶段 | 内容 | 状态 |
|---|---|---|
| 1 | 档案可信度：命名 / ID 统一、关系与授权字段区分、待核实清单 | **已完成**（第 17 节） |
| 2 | 核心浏览体验：三个入口、书籍详情为核心页、搜索筛选、深链、移动端 | **已完成** |
| 3 | 自动检查与上线：`validate-data.js`、sitemap / robots / meta | **脚本已完成**；线上 URL 实测需等真实域名 |
| 4 | 为读物标记预留能力：数据分离、存储接口、版本化 | **接口已完成**，**前端 UI 未开发** |

**尚未完成的事项（不声称已上线）**：

- 阅读标记**没有任何前端按钮**，用户目前无法在页面上标记
- 尚未配置正式域名；当前不生成带占位域名的 canonical、OG URL 或 sitemap 地址
- 详情页无法按条目生成独立分享预览
- 中字回放只覆盖 15 / 28 期；其余期数无中字来源
- `releaseDate`、官方来源链接仍为空（无可核实来源）
- 图片仍全部为排版封面，未取得任何可授权素材

---

## 附录：需要你补充的真实内容清单

| 字段 | 位置 | 说明 |
|---|---|---|
| 小红书笔记链接 | 三个数据文件的 `xiaohongshuUrl` | 已填 3 篇（傲慢与偏见、番外逛书架、全系列总览）；其余发布后填链接即可 |
| 官方节目来源 | `episodes.js` 的 `officialUrl` | 每期 YouTube / B站 搬运链接 |
| 封面图 | `books.js` / `movies.js` 的 `cover` + `assets/` | 建议 3:4，合法可用来源 |
| 发布日期 | `episodes.js` 的 `releaseDate` | 有权威来源再填 |
