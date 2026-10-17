/* ==========================================================================
   LLTP Archive · 交互逻辑
   纯原生 JS，无外部依赖。
   数据来源：books.js（window.BOOKS）/ movies.js（window.MOVIES）/ episodes.js（window.EPISODES）
   定位：书籍为核心，电影轻量索引，期数连接两者。
   ========================================================================== */
(function () {
  "use strict";

  var BOOKS = window.BOOKS || [];
  var MOVIES = window.MOVIES || [];
  var EPISODES = window.EPISODES || [];

  /* ---------------- 小工具 ---------------- */

  // 安全创建元素：文本一律走 textContent，避免注入
  function el(tag, opts, children) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.text != null) node.textContent = String(opts.text);
    if (opts.cls) node.className = opts.cls;
    if (opts.href) node.setAttribute("href", opts.href);
    if (opts.attrs) {
      for (var k in opts.attrs) {
        if (Object.prototype.hasOwnProperty.call(opts.attrs, k)) node.setAttribute(k, opts.attrs[k]);
      }
    }
    if (children) {
      for (var i = 0; i < children.length; i++) {
        if (children[i]) node.appendChild(children[i]);
      }
    }
    return node;
  }

  // 仅允许 http/https 链接，其余（含 javascript:）一律视为无效
  function safeUrl(u) {
    if (!u || typeof u !== "string") return "";
    try {
      var url = new URL(u, window.location.href);
      if (url.protocol === "http:" || url.protocol === "https:") return url.href;
    } catch (e) { /* 忽略非法 URL */ }
    return "";
  }

  // 稳定的封面配色编号
  function tintOf(id) {
    var h = 0, s = String(id || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
    return h % 6;
  }

  /* 期数类型徽标：内容类型（读书期 / 观影期 / 番外）与发布状态（预告）分开表达 */
  function epTypeBadge(ep) {
    var t = ep.preview ? "预告" : (ep.kind === "movie" ? "观影期" : ep.kind === "extra" ? "番外" : "读书期");
    var cls = ep.preview ? "kind-preview" : "kind-" + ep.kind;
    return el("span", { cls: "badge " + cls, text: t });
  }

  function byId(arr, id) {
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  }

  function isMovie(item) { return typeof item.year === "number" || !!item.director; }

  // 完整期数标签，例如 "第 17 期 · 傲慢与偏见"（番外则直接用其标题，避免重复）
  function epLabel(ep) {
    if (!ep) return "";
    if (ep.episodeNumber != null) return "第 " + ep.episodeNumber + " 期 · " + ep.title;
    return ep.title || "番外";
  }

  // 简短期数，例如 "第 17 期"
  function epShort(ep) {
    if (!ep) return "";
    if (ep.episodeNumber != null) return "第 " + ep.episodeNumber + " 期";
    return ep.title || "番外";
  }

  // 作品封面：有 cover 用图片（失败回退排版封面），否则直接排版封面
  function coverEl(item, opts) {
    opts = opts || {};
    var movie = isMovie(item);
    var cls = "cover" + (opts.extra ? (" " + opts.extra) : "");
    var wrap = el("div", { cls: cls + " tint-" + tintOf(item.id) });

    function paint() {
      wrap.textContent = "";
      wrap.appendChild(el("span", { cls: "cv-kind", text: movie ? "电影" : "书籍" }));
      wrap.appendChild(el("div", { cls: "cv-title", text: item.title || "未命名" }));
      wrap.appendChild(el("div", { cls: "cv-rule" }));
      var sub = movie
        ? [item.year || "", item.director || "导演待补"].filter(Boolean).join(" · ")
        : (item.author || "作者待补");
      wrap.appendChild(el("div", { cls: "cv-author", text: sub }));
    }

    /* 版权策略：只有明确标注为已授权 / 公有领域 / 获官方许可时，才展示外部图片；
       其余一律回退到站点生成的排版封面，避免使用来源不明的书封与海报。 */
    var APPROVED = ["licensed", "public-domain", "official-permission"];
    var src = safeUrl(item.cover);
    var approved = APPROVED.indexOf(item.rightsStatus) !== -1;

    if (src && approved) {
      var img = el("img", { attrs: { alt: (item.title || "") + " 封面", loading: "lazy" } });
      img.src = src;
      img.onerror = paint; // 失败 → 排版封面，不影响布局
      wrap.appendChild(img);
    } else {
      paint();
    }
    return wrap;
  }

  function externalBtn(label, url, cls) {
    var u = safeUrl(url);
    if (!u) return null;
    return el("a", {
      cls: "btn " + (cls || "ghost"),
      href: u,
      text: label,
      attrs: { target: "_blank", rel: "noopener noreferrer" }
    });
  }

  /* 小红书电脑网页会强制登录，只有手机 App 能直接打开；
     电脑端补一张二维码方便扫码进去（移动端由 CSS 隐藏）。 */
  function xhsQrBlock(url) {
    var u = safeUrl(url);
    if (!u) return null;
    var m = u.match(/[0-9a-fA-F]{16,}/); // 笔记 ID
    var src = (m && window.XHS_QR) ? window.XHS_QR[m[0]] : null;
    if (!src) return null; // 还没生成二维码就整块不显示
    return el("div", { cls: "xhs-qr" }, [
      el("img", {
        cls: "xhs-qr-img",
        attrs: { src: src, alt: "小红书笔记二维码", width: "104", height: "104" }
      }),
      el("div", { cls: "xhs-qr-cap", text: "电脑打不开小红书？用手机扫码直接进 App。" })
    ]);
  }

  // 微信 / QQ / 百度等内置浏览器会拦截「网页跳 App」，且部分（如百度）会把跳转变成下载。
  function inAppBrowserName() {
    var ua = navigator.userAgent;
    if (/MicroMessenger/i.test(ua)) return "微信";
    if (/Weibo/i.test(ua)) return "微博";
    if (/QQ\//i.test(ua) || /QQBrowser/i.test(ua)) return "QQ";
    if (/baidubrowser|BIDUBrowser|baidu\.com/i.test(ua)) return "百度";
    if (/Alipay/i.test(ua)) return "支付宝";
    if (/DingTalk/i.test(ua)) return "钉钉";
    if (/Toutiao|NewsArticle/i.test(ua)) return "今日头条";
    return null;
  }

  function copyText(text, btn, doneLabel) {
    var old = btn.textContent;
    var done = function () {
      btn.textContent = doneLabel || "已复制";
      window.setTimeout(function () { btn.textContent = old; }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text, done); });
      return;
    }
    legacyCopy(text, done);
  }
  function legacyCopy(text, done) {
    var ta = el("textarea", { attrs: { readonly: "" } });
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
  }

  /* 小红书链接：点按钮＝复制链接，再到小红书 App 里打开。
     小红书网页版强制登录、内置浏览器又会拦截跳转，复制是最稳的方式；
     电脑端另给二维码（见 xhsQrBlock）。
     url 为空时返回空数组，调用方自行回退到「暂未发布」文案。 */
  function xhsLinkNodes(url) {
    var u = safeUrl(url);
    if (!u) return [];
    var btn = el("button", { cls: "btn primary small", text: "复制链接去小红书", attrs: { type: "button" } });
    btn.addEventListener("click", function () { copyText(u, btn, "已复制 · 去小红书打开"); });
    var nodes = [btn];

    var app = inAppBrowserName();
    if (app) {
      nodes.push(el("div", {
        cls: "xhs-tip",
        text: "在" + app + "里可能打不开小红书：复制链接后，打开小红书 App 粘贴即可。"
      }));
    }
    return nodes;
  }

  // 来源列表已移除：站内资料来自用户自建的期数清单与豆瓣公开事实，不再做第三方来源标注。

  /* ---------------- 顶部公告（新一期 / 预告） ---------------- */

  // 打开网站即可看到，配置见 episodes.js 的 SITE_NOTICE
  function renderNotice() {
    var n = window.SITE_NOTICE;
    if (!n || !n.active) return;
    if (document.body.getAttribute("data-page") !== "home") return; // 公告只在首页
    /* 关闭只对「本次访问」生效：关掉后本次浏览不再打扰，重新打开网站仍会看到。
       想彻底不显示，就把 SITE_NOTICE 的 active 改成 false。 */
    var fp = (n.label || "") + "|" + (n.title || "") + "|" + (n.text || "");
    try {
      if (sessionStorage.getItem("lltp.notice.dismissed") === fp) return;
    } catch (e) { /* 存储不可用则每次都显示 */ }
    try { localStorage.removeItem("lltp.notice.dismissed"); } catch (e) { /* 清理旧版永久关闭标记 */ }

    function dismiss() {
      try { sessionStorage.setItem("lltp.notice.dismissed", fp); } catch (e) {}
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }

    var closeBtn = el("button", { cls: "notice-close", type: "button", text: "×", attrs: { "aria-label": "关闭公告" } });
    closeBtn.addEventListener("click", dismiss);

    var bar = el("div", { cls: "site-notice" }, [
      el("div", { cls: "notice-inner" }, [
        el("span", { cls: "notice-label", text: n.label || "公告" }),
        el("span", { cls: "notice-title", text: n.title || "" }),
        n.text ? el("span", { cls: "notice-text", text: n.text }) : null,
        n.episodeId ? el("a", {
          cls: "notice-link",
          href: "episodes.html?id=" + encodeURIComponent(n.episodeId),
          text: "查看 →"
        }) : null,
        closeBtn
      ])
    ]);
    var header = document.querySelector(".masthead");
    // 实际导航位于 .masthead 内；公告应插入整个 header 之后，而不是插到不存在的 .site-nav 之前。
    if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);
  }

  /* ---------------- 卡片 ---------------- */

  function bookCard(book, opts) {
    opts = opts || {};
    return el("a", { cls: "book-card", href: "book.html?id=" + encodeURIComponent(book.id) }, [
      coverEl(book),
      el("div", { cls: "book-body" }, [
        el("div", { cls: "b-title", text: book.title || "未命名" }),
        el("div", { cls: "b-author", text: book.author || "作者待补" }),
        el("div", { cls: "b-tags" }, (book.tags || []).slice(0, 3).map(function (t) {
          return el("span", { cls: "badge", text: t });
        })),
        /* 期数详情页里不需要再强调「属于哪一期」 */
        opts.hideEpisodes ? null : el("div", { cls: "b-foot" }, [
          el("span", { cls: "b-eps", text: episodeIdsText(book) })
        ])
      ])
    ]);
  }

  function episodeIdsText(item) {
    var ids = item.episodeIds || [];
    if (!ids.length) return "期数待补";
    var labels = ids.map(function (id) {
      var ep = byId(EPISODES, id);
      return ep ? epShort(ep) : null;
    }).filter(Boolean);
    return labels.length ? labels.join(" · ") : "期数待补";
  }

  // 电影：轻量行式卡片（不做与书籍同等的卡片体系）
  function movieCard(m, opts) {
    opts = opts || {};
    var eps = (m.episodeIds || []).map(function (id) { return byId(EPISODES, id); }).filter(Boolean);
    var metaBits = [];
    if (m.year) metaBits.push(String(m.year));
    if (m.director) metaBits.push(m.director);
    /* 期数详情页里不需要再强调「属于哪一期」 */
    if (!opts.hideEpisodes) metaBits.push(eps.length ? eps.map(epShort).join(" · ") : "期数待补");
    return el("a", { cls: "movie-card", href: "movie.html?id=" + encodeURIComponent(m.id) }, [
      el("div", { cls: "m-poster cover tint-" + tintOf(m.id) }, [
        el("span", { cls: "cv-kind", text: "电影" }),
        el("div", { cls: "cv-title", text: m.title || "未命名" }),
        el("div", { cls: "cv-rule" }),
        el("div", { cls: "cv-author", text: m.year ? String(m.year) : "年份待补" })
      ]),
      el("div", { cls: "m-body" }, [
        el("div", { cls: "m-head" }, [
          el("div", { cls: "m-title", text: m.title || "未命名" })
        ]),
        m.originalTitle ? el("div", { cls: "m-orig", text: m.originalTitle }) : null,
        el("div", { cls: "m-meta", text: metaBits.join(" · ") }),
        m.summary ? el("div", { cls: "m-sum", text: m.summary }) : null,
        el("div", { cls: "m-tags" }, [
          (safeUrl(m.doubanUrl) ? el("span", { cls: "badge", text: "有豆瓣链接" }) : null),
          (m.xiaohongshuNoteTitle ? el("span", { cls: "badge draft", text: "有带读笔记" }) : null)
        ])
      ])
    ]);
  }

  function episodeCard(ep) {
    var nb = (ep.bookIds || []).filter(function (id) { return byId(BOOKS, id); }).length;
    var nm = (ep.movieIds || []).filter(function (id) { return byId(MOVIES, id); }).length;
    var bits = [];
    if (nb) bits.push(nb + " 本书");
    if (nm) bits.push(nm + " 部电影");
    return el("a", { cls: "ep-card", href: "episodes.html?id=" + encodeURIComponent(ep.id) }, [
      el("div", { cls: "ep-no", text: epNo(ep) }),
      el("div", { cls: "ep-title", text: ep.title || "未命名期数" }),
      el("div", { cls: "ep-meta" }, [
        epTypeBadge(ep),
        el("span", { text: bits.length ? ("关联 " + bits.join(" + ")) : "作品待补" }),
        ep.xiaohongshuNoteTitle ? el("span", { cls: "badge draft", text: "有带读笔记" }) : null
      ])
    ]);
  }

  /* ---------------- 顶部导航 ---------------- */

  function initNav() {
    var toggle = document.querySelector(".mh-toggle");
    var links = document.querySelector(".mh-nav");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", links.classList.contains("open") ? "true" : "false");
      });
    }
    var page = document.body.getAttribute("data-page");
    var map = { episodes: "episodes", books: "books", book: "books", movies: "films", movie: "films", films: "films", journal: "journal", about: "about" };
    var active = map[page] || "";
    if (!active) return;
    document.querySelectorAll(".mh-nav a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === active) a.classList.add("active");
    });
  }

  /* ---------------- 左上角回退键 ----------------
     各页导航栏最左是静态的 <a class="mh-back" href="index.html">←</a>（无 JS 也能回首页）。
     这里只做增强：来源是同站时改为历史回退（保留来路），直接打开 / 外链来源仍回首页。 */
  function initBack() {
    var btn = document.querySelector(".mh-back");
    if (!btn) return;
    var ref = document.referrer || "";
    if (ref.indexOf(location.origin) !== 0) return;   // 非站内来源 → 保持 href 回首页
    btn.addEventListener("click", function (e) {
      if (window.history.length > 1) { e.preventDefault(); window.history.back(); }
    });
  }

  /* ---------------- 档案编号 ---------------- */

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function pad3(n) { return n < 10 ? "00" + n : n < 100 ? "0" + n : String(n); }

  function bookNo(b) { return "书 " + pad3(parseInt(String(b.id).replace(/\D/g, ""), 10)); }
  function movieNo(m) { return "影 " + pad(parseInt(String(m.id).replace(/\D/g, ""), 10)); }
  function epNo(e) {
    if (e.episodeNumber != null) return "第 " + e.episodeNumber + " 期";
    return e.preview ? "预告" : "番外";
  }

  /* ---------------- 首页 ---------------- */

  function renderHome() {
    renderHero();

    var epGrid = document.getElementById("epGrid");
    if (epGrid) {
      var numbered = EPISODES.filter(function (e) { return e.episodeNumber != null; })
        .sort(function (a, b) { return a.episodeNumber - b.episodeNumber; });
      var extras = EPISODES.filter(function (e) { return e.episodeNumber == null; });
      epGrid.textContent = "";
      numbered.concat(extras).forEach(function (ep) { epGrid.appendChild(episodeCard(ep)); });
    }

    initFilters();   // 内部同时渲染卡片与分组视图，保证两者使用同一份筛选结果
    initBookView();
    renderEpisodeTable();
    initEpisodeView();
    renderSpotlight();
    renderMovieIndex();
    initSearch();
  }

  /* 首屏：真实统计 + 真实条目拼贴（不伪造任何数据） */
  function renderHero() {
    var stats = document.getElementById("heroStats");
    if (stats) {
      var items = [
        [EPISODES.filter(function (e) { return e.episodeNumber != null; }).length, "期节目"],
        [BOOKS.length, "本书籍"],
        [MOVIES.length, "部电影"],
        [collectNotes().length, "篇笔记 / 合集"]
      ];
      stats.textContent = "";
      items.forEach(function (it) {
        stats.appendChild(el("div", { cls: "stat" }, [
          el("b", { text: String(it[0]) }),
          el("span", { text: it[1] })
        ]));
      });
    }

    var col = document.getElementById("heroCollage");
    if (col) {
      col.textContent = "";
      /* 取最近三期真实条目，组成拼贴 */
      var numbered = EPISODES.filter(function (e) { return e.episodeNumber != null; })
        .sort(function (a, b) { return b.episodeNumber - a.episodeNumber; }).slice(0, 3);
      numbered.forEach(function (e) {
        var works = (e.bookIds || []).map(function (id) { return byId(BOOKS, id); }).filter(Boolean)
          .concat((e.movieIds || []).map(function (id) { return byId(MOVIES, id); }).filter(Boolean));
        var w = works[0];
        col.appendChild(el("a", { cls: "collage-card", href: "episodes.html?id=" + encodeURIComponent(e.id) }, [
          el("span", { cls: "cc-no", text: epNo(e) }),
          el("div", { cls: "cc-t", text: e.title || "未命名" }),
          el("div", { cls: "cc-m", text: w && w.originalTitle ? w.originalTitle : (e.englishTitle || "") })
        ]));
      });
    }

    /* 三个入口的真实数量 */
    document.querySelectorAll("[data-count]").forEach(function (n) {
      var k = n.getAttribute("data-count");
      var v = k === "episodes" ? EPISODES.filter(function (e) { return e.episodeNumber != null; }).length
        : k === "books" ? BOOKS.length
        : k === "films" ? MOVIES.length : "";
      n.textContent = v === "" ? "" : String(v);
    });
  }

  /* 精选：只收录「已发布真实笔记链接」的条目；合集排在单本之前 */
  var NOTE_KIND_LABEL = { list: "书单合集", shelf: "书架合集", note: "单本笔记" };
  var NOTE_KIND_ORDER = { list: 0, shelf: 1, note: 2 };

  function renderSpotlight() {
    var host = document.getElementById("spotGrid");
    if (!host) return;
    host.textContent = "";
    var items = [];
    EPISODES.forEach(function (e) {
      if (e.preview) return;   // 预告笔记只在预告详情页显示，不进精选
      if (safeUrl(e.xiaohongshuUrl)) {
        items.push({
          kind: e.noteKind || "note",
          href: "episodes.html?id=" + encodeURIComponent(e.id),
          no: epNo(e),
          title: e.title,
          note: e.xiaohongshuNoteTitle,
          url: e.xiaohongshuUrl
        });
      }
    });
    (window.SERIES_NOTES || []).forEach(function (s) {
      if (safeUrl(s.url)) {
        items.push({ kind: s.kind || "list", href: "", no: s.scope || "全系列", title: s.title, orig: "", note: "", url: s.url });
      }
    });
    items.sort(function (a, b) { return NOTE_KIND_ORDER[a.kind] - NOTE_KIND_ORDER[b.kind]; });

    if (!items.length) {
      host.appendChild(el("div", { cls: "empty" }, [
        el("div", { cls: "big", text: "暂无可跳转的笔记" }),
        el("div", { cls: "hint", text: "笔记发布后会自动出现在这里。" })
      ]));
      return;
    }

    items.forEach(function (it) {
      var card = el("article", { cls: "spot-card" }, [
        el("div", { cls: "sp-head" }, [
          el("span", { cls: "sp-no", text: it.no }),
          el("span", { cls: "badge", text: NOTE_KIND_LABEL[it.kind] || "笔记" })
        ]),
        el("h3", {}, [it.href ? el("a", { href: it.href, text: it.title || "" }) : el("span", { text: it.title || "" })]),
        it.orig ? el("div", { cls: "sp-orig", text: it.orig }) : null,
        el("p", { text: it.note || "笔记已发布。" }),
        el("div", { cls: "sp-foot" },
          xhsLinkNodes(it.url).concat([
            it.href ? el("a", { cls: "btn ghost small", href: it.href, text: "查看档案" }) : null,
            xhsQrBlock(it.url)
          ])
        )
      ]);
      host.appendChild(card);
    });
  }

  function initFilters() {
    var grid = document.getElementById("bookGrid");
    var countNote = document.getElementById("bookCount");
    var fEp = document.getElementById("filterEpisode");
    var fTag = document.getElementById("filterTag");
    var fCn = document.getElementById("filterChinese");
    var reset = document.getElementById("filterReset");
    if (!grid) return;

    if (fEp) {
      /* 只列出确实关联了书籍的期数，避免纯观影期被选中后得到空结果 */
      var bookEpIds = {};
      BOOKS.forEach(function (b) { (b.episodeIds || []).forEach(function (id) { bookEpIds[id] = true; }); });
      EPISODES.filter(function (e) { return bookEpIds[e.id]; })
        .sort(function (a, b) {
          var an = a.episodeNumber == null ? 999 : a.episodeNumber;
          var bn = b.episodeNumber == null ? 999 : b.episodeNumber;
          return an - bn;
        }).forEach(function (e) {
          fEp.appendChild(el("option", { text: epLabel(e), attrs: { value: e.id } }));
        });
    }
    if (fTag) {
      var tagSet = {};
      BOOKS.forEach(function (b) { (b.tags || []).forEach(function (t) { tagSet[t] = true; }); });
      Object.keys(tagSet).sort().forEach(function (t) {
        fTag.appendChild(el("option", { text: t, attrs: { value: t } }));
      });
    }

    function apply() {
      var epSel = fEp ? fEp.value : "";
      var tagSel = fTag ? fTag.value : "";
      var cnSel = fCn ? fCn.value : "";

      var out = BOOKS.filter(function (b) {
        if (epSel && (b.episodeIds || []).indexOf(epSel) === -1) return false;
        if (tagSel && (b.tags || []).indexOf(tagSel) === -1) return false;
        if (cnSel) {
          var raw = b.chineseEdition ? b.chineseEdition.hasSimplifiedChinese : null;
          var has = typeof raw === "boolean" ? raw : null;   // true / false / null（待确认）
          if (cnSel === "yes" && has !== true) return false;
          if (cnSel === "no" && has !== false) return false;
          if (cnSel === "unknown" && has !== null) return false;
        }
        return true;
      });

      grid.textContent = "";
      if (!out.length) {
        grid.appendChild(el("div", { cls: "empty", attrs: { style: "grid-column:1/-1" } }, [
          el("div", { cls: "big", text: "没有符合条件的书籍" }),
          el("div", { text: "试试放宽筛选条件，或点「清除筛选」。" })
        ]));
      } else {
        out.forEach(function (b) { grid.appendChild(bookCard(b)); });
      }
      renderBookGroups(out);   // 分组视图与卡片共用同一份筛选结果
      if (countNote) {
        countNote.textContent = "共 " + out.length + " 本书" +
          (out.length !== BOOKS.length ? "（已从 " + BOOKS.length + " 本中筛选）" : "");
      }
    }

    [fEp, fTag, fCn].forEach(function (elm) { if (elm) elm.addEventListener("change", apply); });
    if (reset) {
      reset.addEventListener("click", function () {
        if (fEp) fEp.value = "";
        if (fTag) fTag.value = "";
        if (fCn) fCn.value = "";
        apply();
      });
    }
    apply();
  }

  // 期数一览表：借鉴「28 期一览」的列表式速查（比卡片网格更快扫读）
  function renderEpisodeTable() {
    var host = document.getElementById("epTable");
    if (!host) return;
    var rows = EPISODES.filter(function (e) { return e.episodeNumber != null; })
      .sort(function (a, b) { return a.episodeNumber - b.episodeNumber; })
      .concat(EPISODES.filter(function (e) { return e.episodeNumber == null; }));

    var tbody = el("tbody", {}, rows.map(function (e) {
      var works = (e.bookIds || []).map(function (id) { return byId(BOOKS, id); }).filter(Boolean)
        .concat((e.movieIds || []).map(function (id) { return byId(MOVIES, id); }).filter(Boolean));
      var w = works[0];
      return el("tr", {}, [
        el("td", { cls: "c-ep", text: e.preview ? "预告" : (e.episodeNumber != null ? ("EP " + e.episodeNumber) : "番外") }),
        el("td", {}, [el("a", {
          cls: "c-work",
          href: "episodes.html?id=" + encodeURIComponent(e.id),
          text: e.title || "—"
        })]),
        el("td", { cls: "col-orig", text: (w && w.originalTitle) || (e.englishTitle || "—") }),
        el("td", {}, [epTypeBadge(e)])
      ]);
    }));

    var table = el("table", { cls: "ep-table" }, [
      el("thead", {}, [el("tr", {}, [
        el("th", { text: "期数" }),
        el("th", { text: "作品" }),
        el("th", { cls: "col-orig", text: "原名" }),
        el("th", { text: "类型" })
      ])]),
      tbody
    ]);
    host.textContent = "";
    host.appendChild(table);
  }

  // 网格 / 列表 / 分组 视图切换（通用）
  function wireToggle(sectionId, selector) {
    var sect = document.getElementById(sectionId);
    var btns = document.querySelectorAll(selector);
    if (!sect || !btns.length) return;
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var view = b.getAttribute("data-view");
        sect.classList.remove("table-mode", "group-mode");
        if (view === "table") sect.classList.add("table-mode");
        if (view === "group") sect.classList.add("group-mode");
        btns.forEach(function (x) {
          var on = x.getAttribute("data-view") === view;
          x.classList.toggle("active", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });
      });
    });
  }

  function initEpisodeView() { wireToggle("episodes", "#episodes .view-btn"); }
  function initBookView() { wireToggle("books", "#books .book-view-btn"); }

  // 书籍按主题分组：借鉴「书单按类型归组」的速览方式
  var BOOK_GROUPS = [
    { name: "推理 / 悬疑", match: ["推理", "悬疑"] },
    { name: "科幻 / 奇幻", match: ["科幻", "硬科幻", "太空", "反乌托邦", "奇幻"] },
    { name: "经典文学", match: ["经典", "名著"] },
    { name: "其他", match: [] }
  ];

  function groupOfBook(b) {
    var tags = b.tags || [];
    for (var i = 0; i < BOOK_GROUPS.length; i++) {
      var g = BOOK_GROUPS[i];
      for (var j = 0; j < g.match.length; j++) {
        if (tags.indexOf(g.match[j]) !== -1) return g.name;
      }
    }
    return "其他";
  }

  function renderBookGroups(books) {
    var host = document.getElementById("bookGroups");
    if (!host) return;
    var list = books || BOOKS;
    host.textContent = "";
    BOOK_GROUPS.forEach(function (g) {
      var items = list.filter(function (b) { return groupOfBook(b) === g.name; });
      if (!items.length) return;
      host.appendChild(el("section", { cls: "book-group" }, [
        el("h3", { cls: "bg-title" }, [
          el("span", { text: g.name }),
          el("span", { cls: "bg-count", text: items.length + " 本" })
        ]),
        el("div", { cls: "book-grid" }, items.map(function (b) { return bookCard(b); }))
      ]));
    });
  }

  // 首页「电影索引」：轻量预览。固定排序 = 关联期数从新到旧，同期数再按片名。
  function movieEpNumber(m) {
    var nums = (m.episodeIds || []).map(function (id) {
      var e = byId(EPISODES, id);
      return e && e.episodeNumber != null ? e.episodeNumber : null;
    }).filter(function (n) { return n != null; });
    return nums.length ? Math.min.apply(null, nums) : 0;
  }

  function renderMovieIndex() {
    var host = document.getElementById("movieIndex");
    if (!host) return;
    var limit = parseInt(host.getAttribute("data-limit") || "0", 10);
    var sorted = MOVIES.slice().sort(function (a, b) {
      var d = movieEpNumber(b) - movieEpNumber(a);
      if (d !== 0) return d;
      return String(a.title || "").localeCompare(String(b.title || ""), "zh-Hans-CN");
    });
    var list = limit > 0 ? sorted.slice(0, limit) : sorted;
    host.textContent = "";
    list.forEach(function (m) { host.appendChild(movieCard(m)); });
  }

  // 收集所有已整理 / 已发布的带读笔记
  function collectNotes() {
    var notes = [];
    EPISODES.forEach(function (e) {
      if (e.preview) return;   // 预告笔记不计入精选统计
      if (e.xiaohongshuNoteTitle || e.xiaohongshuUrl) {
        var subjects = (e.bookIds || []).map(function (id) { var b = byId(BOOKS, id); return b ? b.title : ""; })
          .concat((e.movieIds || []).map(function (id) { var m = byId(MOVIES, id); return m ? m.title : ""; }))
          .filter(Boolean);
        notes.push({
          title: e.xiaohongshuNoteTitle || ("第 " + e.episodeNumber + " 期笔记"),
          epLabel: epShort(e), epId: e.id, subjects: subjects, url: e.xiaohongshuUrl
        });
      }
    });
    // 作品级：若这篇笔记已由「期数级」条目展示过，就不重复出现。
    // 预告虽不进精选，但它已持有该链接，对应书籍不应再补位出现。
    var seenUrl = {};
    EPISODES.forEach(function (e) { if (e.xiaohongshuUrl) seenUrl[e.xiaohongshuUrl] = true; });
    BOOKS.concat(MOVIES).forEach(function (x) {
      if ((x.xiaohongshuNoteTitle || x.xiaohongshuUrl) && !seenUrl[x.xiaohongshuUrl]) {
        notes.push({
          title: x.xiaohongshuNoteTitle || (x.title + " 笔记"),
          epLabel: episodeIdsText(x), epId: (x.episodeIds || [])[0] || "",
          subjects: [x.title], url: x.xiaohongshuUrl
        });
      }
    });
    (window.SERIES_NOTES || []).forEach(function (s) {
      if (s.title || s.url) {
        notes.push({
          title: s.title || "小红书笔记",
          epLabel: s.scope || "全系列",
          epId: "",
          subjects: [],
          note: true,
          url: s.url
        });
      }
    });
    var seen = {}, out = [];
    notes.forEach(function (n) {
      var key = n.title + "|" + n.epLabel;
      if (seen[key]) return;
      seen[key] = true; out.push(n);
    });
    return out;
  }

  /* ---------------- 搜索（全书名 / 作者 / 片名 / 导演 / 期数） ---------------- */

  function initSearch() {
    var input = document.getElementById("searchInput");
    var panel = document.getElementById("searchResults");
    var clearBtn = document.getElementById("searchClear");
    var goBtn = document.getElementById("searchGo");
    if (!input || !panel) return;

    function norm(s) {
      return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
    }

    function run() {
      var q = norm(input.value);
      if (!q) { panel.hidden = true; panel.textContent = ""; if (clearBtn) clearBtn.hidden = true; return; }
      if (clearBtn) clearBtn.hidden = false;

      var books = BOOKS.filter(function (b) {
        var alt = (b.editions || []).map(function (e) { return e.translator; }).join(" ");
        return norm([b.title, b.originalTitle, b.author, b.note, (b.tags || []).join(" "), alt].join(" ")).indexOf(q) !== -1;
      });
      var movies = MOVIES.filter(function (m) {
        return norm([m.title, m.originalTitle, m.director, m.year, m.note].join(" ")).indexOf(q) !== -1;
      });
      var eps = EPISODES.filter(function (e) {
        var hay = [(e.episodeNumber != null ? ("第 " + e.episodeNumber + " 期 " + e.episodeNumber) : ""), e.title, e.englishTitle, e.summary, e.note].join(" ");
        return norm(hay).indexOf(q) !== -1;
      });

      panel.textContent = "";
      if (!books.length && !movies.length && !eps.length) {
        panel.appendChild(el("div", { cls: "sr-empty", text: "没有找到与「" + input.value.trim() + "」相关的书籍、电影或期数。" }));
      } else {
        if (books.length) {
          panel.appendChild(el("div", { cls: "sr-group-title", text: "书籍（" + books.length + "）" }));
          books.slice(0, 6).forEach(function (b) {
            panel.appendChild(el("a", { cls: "sr-item", href: "book.html?id=" + encodeURIComponent(b.id) }, [
              coverEl(b, { extra: "sr-thumb" }),
              el("div", { cls: "sr-main" }, [
                el("div", { cls: "sr-title", text: b.title }),
                el("div", { cls: "sr-sub", text: [b.author || "作者待补", "书籍"].join(" · ") })
              ])
            ]));
          });
        }
        if (movies.length) {
          panel.appendChild(el("div", { cls: "sr-group-title", text: "电影（" + movies.length + "）" }));
          movies.slice(0, 6).forEach(function (m) {
            panel.appendChild(el("a", { cls: "sr-item", href: "movie.html?id=" + encodeURIComponent(m.id) }, [
              el("div", { cls: "sr-main" }, [
                el("div", { cls: "sr-title", text: m.title }),
                el("div", { cls: "sr-sub", text: [[m.year, m.director].filter(Boolean).join(" · "), "电影"].filter(Boolean).join(" · ") })
              ])
            ]));
          });
        }
        if (eps.length) {
          panel.appendChild(el("div", { cls: "sr-group-title", text: "期数（" + eps.length + "）" }));
          eps.slice(0, 6).forEach(function (e) {
            panel.appendChild(el("a", { cls: "sr-item", href: "episodes.html?id=" + encodeURIComponent(e.id) }, [
              el("div", { cls: "sr-main" }, [
                el("div", { cls: "sr-title", text: epLabel(e) }),
                el("div", { cls: "sr-sub", text: e.summary || "" })
              ])
            ]));
          });
        }
      }
      panel.hidden = false;
    }

    input.addEventListener("input", run);
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        var first = panel.querySelector(".sr-item");
        if (first) window.location.href = first.getAttribute("href");
      }
      if (ev.key === "Escape") { input.value = ""; run(); }
    });
    if (clearBtn) clearBtn.addEventListener("click", function () { input.value = ""; run(); input.focus(); });
    if (goBtn) goBtn.addEventListener("click", function () {
      var first = panel.querySelector(".sr-item");
      if (first && !panel.hidden) window.location.href = first.getAttribute("href");
      else run();
    });
    document.addEventListener("click", function (ev) {
      if (!panel.hidden && !panel.contains(ev.target) && ev.target !== input) panel.hidden = true;
    });
  }

  /* ---------------- 电影索引页（轻量） ---------------- */

  function renderMoviesPage() {
    var host = document.getElementById("movieList");
    if (!host) return;
    var filter = document.getElementById("movieFilter");
    var note = document.getElementById("movieCount");
    var sortBtns = document.querySelectorAll(".sort-btn");
    var sortKey = "year";

    function epNo(m) {
      var ep = (m.episodeIds || []).map(function (id) { return byId(EPISODES, id); }).filter(Boolean)[0];
      return ep && ep.episodeNumber != null ? ep.episodeNumber : 9999;
    }

    function paint() {
      var q = filter ? filter.value.trim().toLowerCase() : "";
      var list = MOVIES.slice().sort(function (a, b) {
        return sortKey === "episode" ? epNo(a) - epNo(b) : (b.year || 0) - (a.year || 0);
      }).filter(function (m) {
        return !q || [m.title, m.originalTitle, m.director, m.year].join(" ").toLowerCase().indexOf(q) !== -1;
      });
      host.textContent = "";
      if (!list.length) {
        host.appendChild(el("div", { cls: "empty" }, [
          el("div", { cls: "big", text: "没有匹配的电影" }),
          el("div", { text: "试试换一个片名或导演关键词。" })
        ]));
      } else {
        list.forEach(function (m) { host.appendChild(movieCard(m)); });
      }
      if (note) note.textContent = "共 " + list.length + " 部电影" + (q ? "（已筛选）" : "");
    }

    sortBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        sortKey = b.getAttribute("data-sort");
        sortBtns.forEach(function (x) {
          x.classList.toggle("active", x === b);
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        paint();
      });
    });
    if (filter) filter.addEventListener("input", paint);
    paint();
  }

  /* ---------------- 期数详情 ---------------- */

  function renderEpisodePage() {
    var root = document.getElementById("detailRoot");
    if (!root) return;
    var id = new URLSearchParams(window.location.search).get("id");
    var ep = byId(EPISODES, id);

    if (!ep) {
      root.appendChild(notFoundBlock("找不到这一期", "期数 ID 可能是错的，或这一期还没有收录。"));
      return;
    }

    document.title = (ep.episodeNumber != null ? epShort(ep) + " · " : "") + ep.title + " · LLTP Archive";

    root.appendChild(el("nav", { cls: "breadcrumb" }, [
      el("a", { href: "index.html", text: "首页" }),
      el("span", { text: " / 节目期数 / " }),
      el("span", { text: epShort(ep) })
    ]));

    /* 官方节目来源：只有填了有效链接时才出现，绝不凭猜测补 */
    var officialBtn = externalBtn("官方节目 ↗", ep.officialUrl, "ghost small");

    root.appendChild(el("div", { cls: "detail-info" }, [
      el("span", { cls: "archive-no archive-no--stamp", text: epNo(ep) }),
      el("h1", { text: ep.title }),
      ep.englishTitle ? el("div", { cls: "orig", text: ep.englishTitle }) : null,
      el("div", { cls: "meta-row" }, [
        epTypeBadge(ep),
        ep.episodeNumber != null ? el("span", { cls: "badge", text: "第 " + ep.episodeNumber + " 期" })
          : el("span", { cls: "badge", text: ep.preview ? "正片待发布" : "番外 / 特辑" })
      ]),
      ep.summary ? el("p", { cls: "summary", text: ep.summary }) : null,
      ep.note ? el("p", { cls: "note-line", text: "注：" + ep.note }) : null,
      officialBtn ? el("div", { cls: "actions", attrs: { style: "margin-top:12px" } }, [officialBtn]) : null
    ]));

    /* 中字回放（B 站）与带读笔记（小红书）：只显示真实存在的内容。
       两者都没有时整块隐藏；单个子模块为空时该行隐藏。 */
    var replays = (ep.replays || []).filter(function (r) { return safeUrl(r.url); });
    var hasNote = !!safeUrl(ep.xiaohongshuUrl) || !!ep.xiaohongshuNoteTitle;
    var srcRows = [];

    if (hasNote) {
      var xhsAct = el("div", { cls: "src-act" });
      var xhsNodes = xhsLinkNodes(ep.xiaohongshuUrl);
      if (xhsNodes.length) xhsNodes.forEach(function (n) { xhsAct.appendChild(n); });
      else xhsAct.appendChild(el("span", { cls: "badge draft", text: "已整理 · 链接待补" }));
      srcRows.push(el("li", { cls: "src-row src-row--xhs" }, [
        el("span", { cls: "src-plat src-plat--xhs", text: "小红书" }),
        el("div", { cls: "src-main" }, [
          el("div", { cls: "src-title", text: "带读笔记" }),
          el("div", { cls: "src-sub", text: ep.xiaohongshuNoteTitle || "Lily带你读好书 · 本期归纳" })
        ]),
        xhsAct,
        xhsQrBlock(ep.xiaohongshuUrl)
      ]));
    }

    if (replays.length) {
      var biliAct = el("div", { cls: "src-act" });
      replays.forEach(function (r) {
        biliAct.appendChild(el("a", {
          cls: "btn ghost small",
          href: safeUrl(r.url),
          text: (r.by || "粉丝字幕组") + " ↗",
          attrs: { target: "_blank", rel: "noopener noreferrer" }
        }));
      });
      srcRows.push(el("li", { cls: "src-row src-row--bili" }, [
        el("span", { cls: "src-plat src-plat--bili", text: "B 站" }),
        el("div", { cls: "src-main" }, [
          el("div", { cls: "src-title", text: "中字回放" }),
          el("div", { cls: "src-sub", text: replays.map(function (r) { return r.by || "粉丝字幕组"; }).join("、") })
        ]),
        biliAct
      ]));
    }

    if (srcRows.length) {
      root.appendChild(el("section", { cls: "panel" }, [
        el("h2", { text: "中字回放与带读笔记" }),
        el("ul", { cls: "src-list" }, srcRows)
      ]));
    }

    // 本期作品：只渲染实际存在的类别，不生成空面板、不解释「另一类为什么没有」
    var books = (ep.bookIds || []).map(function (x) { return byId(BOOKS, x); }).filter(Boolean);
    var movies = (ep.movieIds || []).map(function (x) { return byId(MOVIES, x); }).filter(Boolean);

    if (books.length) {
      var bSec = el("section", { cls: "panel" }, [
        el("h2", { text: ep.preview ? "预告书目" : "本期讨论书籍" })
      ]);
      var bg = el("div", { cls: "book-grid" });
      books.forEach(function (b) { bg.appendChild(bookCard(b, { hideEpisodes: true })); });
      bSec.appendChild(bg);
      root.appendChild(bSec);
    }

    if (movies.length) {
      var mSec = el("section", { cls: "panel" }, [
        el("h2", { text: ep.preview ? "预告影片" : "本期讨论电影" })
      ]);
      var mg = el("div", { cls: "movie-list" });
      movies.forEach(function (m) { mg.appendChild(movieCard(m, { hideEpisodes: true })); });
      mSec.appendChild(mg);
      root.appendChild(mSec);
    }

    if (!books.length && !movies.length) {
      var hint = ep.preview
        ? "预告期暂未公布本期作品，正片发布后更新。"
        : (ep.kind === "extra" ? "这期番外没有单独对应的作品条目。" : "本期作品仍在整理中。");
      root.appendChild(el("section", { cls: "panel" }, [
        el("h2", { text: "本期作品" }),
        el("div", { cls: "empty" }, [el("div", { text: hint })])
      ]));
    }
  }

  /* ---------------- 书籍详情 ---------------- */

  function renderBookPage() {
    var root = document.getElementById("detailRoot");
    if (!root) return;
    var id = new URLSearchParams(window.location.search).get("id");
    var book = byId(BOOKS, id);

    if (!book) {
      root.appendChild(notFoundBlock("找不到这本书", "书籍 ID 可能是错的，或这本书还没有收录。"));
      return;
    }

    document.title = book.title + " · LLTP Archive";

    root.appendChild(el("nav", { cls: "breadcrumb" }, [
      el("a", { href: "index.html", text: "首页" }),
      el("span", { text: " / 书籍 / " }),
      el("span", { text: book.title })
    ]));

    root.appendChild(el("div", { cls: "detail-head" }, [
      coverEl(book, { big: true }),
      el("div", { cls: "detail-info" }, [
        el("span", { cls: "archive-no archive-no--stamp", text: bookNo(book) }),
        el("h1", { text: book.title }),
        book.originalTitle ? el("div", { cls: "orig", text: book.originalTitle }) : null,
        el("div", { cls: "meta-row" }, [el("span", { cls: "badge", text: "书籍" })]),
        el("div", { cls: "byline" }, [el("span", { text: "作者 " }), el("b", { text: book.author || "待补" })]),
        book.summary ? el("p", { cls: "summary", text: book.summary }) : el("p", { cls: "missing", text: "简介待补。" }),
        book.note ? el("p", { cls: "note-line", text: "注：" + book.note }) : null,
        el("div", { cls: "chip-list", attrs: { style: "margin-top:14px" } },
          (book.tags || []).map(function (t) { return el("span", { cls: "badge", text: t }); }))
      ])
    ]));

    var eps = (book.episodeIds || []).map(function (x) { return byId(EPISODES, x); }).filter(Boolean);
    var epPanel = el("section", { cls: "panel" }, [el("h2", { text: "关联的 LLTP 期数" })]);
    if (eps.length) {
      var chips = el("div", { cls: "chip-list" });
      eps.forEach(function (e) {
        chips.appendChild(el("a", { cls: "chip", href: "episodes.html?id=" + encodeURIComponent(e.id) }, [
          el("span", { text: epLabel(e) })
        ]));
      });
      epPanel.appendChild(chips);
    } else {
      epPanel.appendChild(el("div", { cls: "missing", text: "这本书暂未关联到具体期数（期数待补）。" }));
    }
    root.appendChild(epPanel);

    // 相关影视（原著改编）
    var ad = book.adaptations || [];
    if (ad.length) {
      root.appendChild(el("section", { cls: "panel" }, [
        el("h2", { text: "相关影视 · 改编" }),
        el("ul", { cls: "plain-list" }, ad.map(function (a) {
          var u = safeUrl(a.doubanUrl);
          return el("li", {}, [
            el("span", { cls: "pl-t", text: a.title + (a.year ? "（" + a.year + "）" : "") }),
            el("span", { cls: "badge", text: a.form || "电影" }),
            u ? el("a", { cls: "pl-l", href: u, text: "豆瓣 ↗", attrs: { target: "_blank", rel: "noopener noreferrer" } }) : null
          ]);
        }))
      ]));
    }

    /* 中文译本：主版本 + 其他译本，只列出来 */
    var ce = book.chineseEdition || {};
    var edRows = [];
    var seenUrl = {};
    if (ce.publisher || ce.translator || ce.editionNote) {
      var pu = safeUrl(ce.sourceUrl) || safeUrl(book.doubanUrl);
      if (pu) seenUrl[pu] = true;
      edRows.push({ bits: [ce.publisher, ce.translator].filter(Boolean).join(" · ") || ce.editionNote || "", url: pu });
    }
    (book.editions || []).forEach(function (e) {
      var u = safeUrl(e.doubanUrl);
      if (u && seenUrl[u]) return;
      if (u) seenUrl[u] = true;
      edRows.push({ bits: [e.publisher, e.translator, e.year ? String(e.year) : ""].filter(Boolean).join(" · "), url: u });
    });
    var hasEditionLink = edRows.some(function (r) { return r.url; });

    var linkActions = [];
    var xhsNodes = xhsLinkNodes(book.xiaohongshuUrl);
    if (xhsNodes.length) xhsNodes.forEach(function (n) { linkActions.push(n); });
    else if (book.xiaohongshuNoteTitle) linkActions.push(el("span", { cls: "badge draft", text: "笔记已整理 · 链接待补" }));
    else linkActions.push(el("span", { cls: "missing", text: "带读笔记：暂未发布" }));

    /* 中文译本每一行都已带豆瓣入口时，不再重复放一个全书级豆瓣按钮 */
    if (!hasEditionLink) {
      var db = externalBtn("查看豆瓣书籍页面 ↗", book.doubanUrl, "ghost small");
      if (db) linkActions.push(db);
    }

    var xhsQr = xhsQrBlock(book.xiaohongshuUrl);
    if (xhsQr) linkActions.push(xhsQr);

    var panel = el("section", { cls: "panel" }, [el("h2", { text: "中文译本" })]);
    if (edRows.length) {
      panel.appendChild(el("ul", { cls: "plain-list" }, edRows.map(function (r) {
        return el("li", {}, [
          el("span", { cls: "pl-t", text: r.bits || "版本待补" }),
          r.url ? el("a", { cls: "pl-l", href: r.url, text: "豆瓣 ↗", attrs: { target: "_blank", rel: "noopener noreferrer" } }) : null
        ]);
      })));
    } else {
      panel.appendChild(el("div", { cls: "missing", text: "暂无中文译本记录。" }));
    }
    panel.appendChild(el("div", { cls: "actions" }, linkActions));
    root.appendChild(panel);
  }

  /* ---------------- 电影详情（轻量） ---------------- */

  function renderMoviePage() {
    var root = document.getElementById("detailRoot");
    if (!root) return;
    var id = new URLSearchParams(window.location.search).get("id");
    var m = byId(MOVIES, id);

    if (!m) {
      root.appendChild(notFoundBlock("找不到这部电影", "电影 ID 可能是错的，或这部电影还没有收录。"));
      return;
    }

    document.title = m.title + " · LLTP Archive";

    root.appendChild(el("nav", { cls: "breadcrumb" }, [
      el("a", { href: "index.html", text: "首页" }),
      el("span", { text: " / " }),
      el("a", { href: "movies.html", text: "电影" }),
      el("span", { text: " / " }),
      el("span", { text: m.title })
    ]));

    root.appendChild(el("div", { cls: "detail-head" }, [
      coverEl(m, { big: true }),
      el("div", { cls: "detail-info" }, [
        el("span", { cls: "archive-no archive-no--stamp", text: movieNo(m) }),
        el("h1", { text: m.title }),
        m.originalTitle ? el("div", { cls: "orig", text: m.originalTitle }) : null,
        el("div", { cls: "meta-row" }, [el("span", { cls: "badge", text: "电影" })]),
        el("div", { cls: "film-slate" }, [
          el("div", {}, [el("span", { cls: "k", text: "年份" }), el("span", { cls: "v", text: m.year ? String(m.year) : "待补" })]),
          el("div", {}, [el("span", { cls: "k", text: "导演" }), el("span", { cls: "v", text: m.director || "待补" })]),
          el("div", {}, [el("span", { cls: "k", text: "对应期数" }), el("span", {
            cls: "v",
            text: (m.episodeIds || []).map(function (id) { var e = byId(EPISODES, id); return e ? epShort(e) : null; })
              .filter(Boolean).join(" / ") || "待补"
          })])
        ]),
        m.summary ? el("p", { cls: "summary", text: m.summary }) : el("p", { cls: "missing", text: "简介待补。" }),
        m.note ? el("p", { cls: "note-line", text: "注：" + m.note }) : null
      ])
    ]));

    var eps = (m.episodeIds || []).map(function (x) { return byId(EPISODES, x); }).filter(Boolean);
    var epPanel = el("section", { cls: "panel" }, [el("h2", { text: "对应的 LLTP 期数" })]);
    if (eps.length) {
      var chips = el("div", { cls: "chip-list" });
      eps.forEach(function (e) {
        chips.appendChild(el("a", { cls: "chip", href: "episodes.html?id=" + encodeURIComponent(e.id) }, [
          el("span", { text: epLabel(e) })
        ]));
      });
      epPanel.appendChild(chips);
    } else {
      epPanel.appendChild(el("div", { cls: "missing", text: "这部电影暂未关联到具体期数（期数待补）。" }));
    }
    root.appendChild(epPanel);

    var actions = [];
    /* 电影不做带读笔记，因而不放「暂未发布 / 链接待补」这类占位；仅当确有链接时才显示。 */
    var xhsNodes = xhsLinkNodes(m.xiaohongshuUrl);
    if (xhsNodes.length) xhsNodes.forEach(function (n) { actions.push(n); });

    var db = externalBtn("查看豆瓣影片页面 ↗", m.doubanUrl, "ghost small");
    if (db) actions.push(db); else actions.push(el("span", { cls: "missing", text: "豆瓣链接：暂未填写" }));

    var xhsQr = xhsQrBlock(m.xiaohongshuUrl);
    if (xhsQr) actions.push(xhsQr);

    root.appendChild(el("section", { cls: "panel" }, [
      el("h2", { text: "链接" }),
      el("div", { cls: "actions" }, actions)
    ]));

    // 相关书籍（P2 跨媒介专题关联，目前多数字段为空）
    var relBooks = (m.relatedBookIds || []).map(function (x) { return byId(BOOKS, x); }).filter(Boolean);
    if (relBooks.length) {
      var rb = el("section", { cls: "panel" }, [el("h2", { text: "相关书籍" })]);
      var rbg = el("div", { cls: "book-grid" });
      relBooks.forEach(function (b) { rbg.appendChild(bookCard(b)); });
      rb.appendChild(rbg);
      root.appendChild(rb);
    }
  }

  /* ---------------- 未找到 ---------------- */

  function notFoundBlock(title, msg) {
    return el("div", { cls: "empty", attrs: { style: "margin-top:40px" } }, [
      el("div", { cls: "big", text: title }),
      el("div", { text: msg }),
      el("div", { attrs: { style: "margin-top:16px" } }, [
        el("a", { cls: "btn primary", href: "index.html", text: "回到首页" })
      ])
    ]);
  }

  /* ---------------- 启动 ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initBack();
    renderNotice();
    var page = document.body.getAttribute("data-page");
    if (page === "home") renderHome();
    else if (page === "episodes") renderEpisodePage();
    else if (page === "books") renderBookPage();
    else if (page === "movies") renderMoviesPage();
    else if (page === "movie") renderMoviePage();
  });
})();
