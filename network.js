/**
 * LLTP Archive · 阅读网络
 * ------------------------------------------------------------
 * 按「类型泳道 × 难度三档」组织的书籍关系视图。
 *
 * 只收录站内已有的书；难度分档是站主判断，不是客观评级，
 * 依据是篇幅、语言门槛、叙事结构三项，页面上会注明。
 *
 * 一本书可以同时属于两条泳道（如《蝴蝶梦》= 经典 + 悬疑），
 * 这种重叠就是网络里的「跨类桥梁」。
 */
window.BOOK_NETWORK = {
  levels: [
    { id: "entry", name: "入门" },
    { id: "step", name: "进阶" },
    { id: "challenge", name: "挑战" }
  ],
  lanes: [
    { id: "fantasy", name: "奇幻" },
    { id: "mystery", name: "推理" },
    { id: "scifi", name: "科幻" },
    { id: "classic", name: "经典" },
    { id: "nonfiction", name: "非虚构" }
  ],
  // level: 0 入门 / 1 进阶 / 2 挑战
  books: {
    "book-001": { level: 0, short: "哈利·波特", lanes: ["fantasy"] },
    "book-031": { level: 0, short: "波西·杰克逊", lanes: ["fantasy"] },
    "book-004": { level: 1, short: "当怪物来敲门", lanes: ["fantasy"] },

    "book-002": { level: 0, short: "周四推理俱乐部", lanes: ["mystery"] },
    "book-007": { level: 0, short: "活了两次的男人", lanes: ["mystery"] },
    "book-014": { level: 1, short: "尼罗河上的惨案", lanes: ["mystery"] },
    "book-021": { level: 1, short: "血字的研究", lanes: ["mystery"] },

    "book-006": { level: 0, short: "记忆传授人", lanes: ["scifi"] },
    "book-009": { level: 1, short: "火星救援", lanes: ["scifi"] },
    "book-017": { level: 1, short: "银河系漫游指南", lanes: ["scifi"] },
    "book-037": { level: 2, short: "弗兰肯斯坦", lanes: ["scifi", "classic"] },

    "book-011": { level: 0, short: "傲慢与偏见", lanes: ["classic"] },
    "book-030": { level: 0, short: "蝴蝶梦", lanes: ["classic"] },
    "book-019": { level: 1, short: "爱玛", lanes: ["classic"] },
    "book-012": { level: 1, short: "了不起的盖茨比", lanes: ["classic"] },
    "book-016": { level: 2, short: "呼啸山庄", lanes: ["classic"] },

    "book-034": { level: 0, short: "我妈走后", lanes: ["nonfiction"] },
    "book-033": { level: 1, short: "我存在", lanes: ["nonfiction"] }
  }
};

(function () {
  "use strict";

  var NET = window.BOOK_NETWORK;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildRows(booksById) {
    return NET.lanes.map(function (lane) {
      var cells = [[], [], []];
      Object.keys(NET.books).forEach(function (id) {
        var item = NET.books[id];
        if (item.lanes.indexOf(lane.id) < 0) return;
        var book = booksById[id];
        if (!book) return; // 数据里没有的书直接跳过，不画空心节点
        cells[item.level].push({ id: id, short: item.short, book: book });
      });
      return { lane: lane, cells: cells };
    }).map(function (row) {
      // 同一格里，把「主类型就是这条泳道」的书排在前面，
      // 跨类桥梁书排后面，递进箭头才不会指向一本外来书。
      row.cells.forEach(function (cell) {
        cell.sort(function (a, b) {
          var pa = NET.books[a.id].lanes[0] === row.lane.id ? 0 : 1;
          var pb = NET.books[b.id].lanes[0] === row.lane.id ? 0 : 1;
          return pa - pb;
        });
      });
      return row;
    });
  }

  function renderSvg(rows) {
    var VB_W = 1040;
    var LABEL_W = 150;
    var COL_W = (VB_W - LABEL_W - 16) / 3;
    var colX = [LABEL_W, LABEL_W + COL_W, LABEL_W + COL_W * 2];
    var LINE_H = 38;
    var NODE_TOP = 34;
    var out = [];

    // 节点位置索引：id + lane → y，用于画跨类桥梁
    var pos = {};

    // 列标题
    NET.levels.forEach(function (lv, i) {
      out.push(
        '<text class="net-col-label" x="' + (colX[i] + 22) + '" y="26">' + esc(lv.name) + "</text>"
      );
    });

    var y = 48;
    rows.forEach(function (row) {
      var maxN = 1;
      row.cells.forEach(function (c) { if (c.length > maxN) maxN = c.length; });
      var h = Math.max(104, NODE_TOP + maxN * LINE_H + 16);

      out.push('<line class="net-row-rule" x1="0" y1="' + y + '" x2="' + VB_W + '" y2="' + y + '" />');
      out.push(
        '<text class="net-lane-label" x="0" y="' + (y + 34) + '">' + esc(row.lane.name) + "</text>"
      );

      row.cells.forEach(function (cell, ci) {
        cell.forEach(function (item, i) {
          var ny = y + NODE_TOP + i * LINE_H;
          pos[item.id + "|" + row.lane.id] = { x: colX[ci], y: ny };
          out.push(
            '<a class="net-book" href="book.html?id=' + encodeURIComponent(item.id) + '">' +
              '<circle class="net-dot net-dot--' + NET.levels[ci].id + '" cx="' + colX[ci] + '" cy="' + (ny - 6) + '" r="4.5" />' +
              '<text x="' + (colX[ci] + 20) + '" y="' + ny + '">' + esc(item.short) + "</text>" +
            "</a>"
          );
        });
      });

      // 同类递进：横向箭头落在两档的第一行，避免斜线显得像杂线
      var lineY = y + NODE_TOP;
      var ends = row.cells.map(function (cell) {
        if (!cell.length) return null;
        var maxLen = 0;
        cell.forEach(function (it) { if (it.short.length > maxLen) maxLen = it.short.length; });
        return colX[row.cells.indexOf(cell)] + 20 + maxLen * 19 + 16;
      });
      for (var i = 0; i < 2; i++) {
        if (!row.cells[i].length || !row.cells[i + 1].length) continue;
        var x1 = ends[i];
        var x2 = colX[i + 1] - 7;
        if (x2 - x1 < 12) continue;
        out.push(
          '<path class="net-link" d="M' + x1 + " " + lineY + " L" + x2 + " " + lineY + '" />'
        );
      }

      y += h;
    });

    // 跨类桥梁：同一本书在同档位出现在两条泳道
    Object.keys(NET.books).forEach(function (id) {
      var lanes = NET.books[id].lanes;
      if (lanes.length < 2) return;
      var a = pos[id + "|" + lanes[0]];
      var b = pos[id + "|" + lanes[1]];
      if (!a || !b) return;
      var bend = a.x - 42;
      out.push(
        '<path class="net-bridge" d="M' + a.x + " " + (a.y - 6) +
        " C" + bend + " " + (a.y + 24) + " " + bend + " " + (b.y - 36) +
        " " + b.x + " " + (b.y - 6) + '" />'
      );
    });

    return '<svg class="net-svg" viewBox="0 0 ' + VB_W + " " + (y + 12) + '" role="img" ' +
      'aria-label="按类型与难度排列的书籍网络">' + out.join("") + "</svg>";
  }

  function renderList(rows) {
    var laneName = {};
    NET.lanes.forEach(function (l) { laneName[l.id] = l.name; });

    var html = [];
    rows.forEach(function (row) {
      var hasAny = row.cells.some(function (c) { return c.length; });
      if (!hasAny) return;
      html.push('<section class="mlane"><h3>' + esc(row.lane.name) + "</h3>");
      row.cells.forEach(function (cell, ci) {
        if (!cell.length) return;
        html.push('<div class="mtier mtier--' + NET.levels[ci].id + '">');
        html.push('<div class="mtier-name">' + esc(NET.levels[ci].name) + "</div>");
        cell.forEach(function (item) {
          var meta = NET.books[item.id];
          var href = "book.html?id=" + encodeURIComponent(item.id);
          if (meta.lanes[0] === row.lane.id) {
            html.push(
              '<a class="mbook" data-book="' + item.id + '" href="' + href + '">' +
                "<span>" + esc(item.short) + "</span>" +
                '<span class="mbook-arrow" aria-hidden="true">→</span>' +
              "</a>"
            );
          } else {
            // 手机端不拉长线：同一本书只在主类型出现一次，
            // 另一条类型里放一行引用，点进去还是同一本书。
            html.push(
              '<a class="mbook mbook--ref" data-book="' + item.id + '" href="' + href + '">' +
                "<span>↳ 也属" + esc(laneName[meta.lanes[0]] || "") + " · " + esc(item.short) + "</span>" +
                '<span class="mbook-arrow" aria-hidden="true">→</span>' +
              "</a>"
            );
          }
        });
        html.push("</div>");
      });
      html.push("</section>");
    });
    return html.join("");
  }

  function init() {
    var host = document.getElementById("netRoot");
    if (!host || !window.BOOKS) return;

    var booksById = {};
    window.BOOKS.forEach(function (b) { booksById[b.id] = b; });

    var rows = buildRows(booksById);
    host.innerHTML = renderSvg(rows) + '<div class="net-list">' + renderList(rows) + "</div>";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
