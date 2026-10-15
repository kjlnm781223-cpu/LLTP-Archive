/**
 * LLTP ARCHIVE · 阅读标记存储模块（stage-4 · 仅预留接口，前端暂无按钮）
 * ============================================================================
 * 设计原则
 * 1. **个人数据与公共档案完全分离**：本模块只读写 localStorage，
 *    绝不会把阅读状态写进 books.js / movies.js / episodes.js。
 * 2. **按稳定作品 ID 关联**：只用 `workId`（即 books.js 的 id，如 "book-011"），
 *    不依赖书名，译名变化不会造成重复条目。
 * 3. **可升级**：存储内带 `version` 字段，未来改结构时按版本迁移，不猜测旧数据。
 * 4. **不自动覆盖**：只在你明确调用 set / remove 时写盘；读取永远只读。
 * 5. **失败安全**：浏览器禁用存储、数据损坏、状态名非法时一律降级为「读不到」，
 *    不抛异常、不写坏数据。
 *
 * 当前阶段**没有接入任何前端按钮**，模块只提供接口。
 * 作品级标记为默认；`scope` 参数预留给未来「某个版本」级别的标记。
 * 未来是否需要跨设备同步，再决定要不要引入后端/登录。
 * ============================================================================
 */
window.ReadingStatus = (function () {
  "use strict";

  var STORAGE_KEY = "lltp.reading.status";
  var STORAGE_VERSION = 1;

  /** 允许的状态值。未来新增状态时，同步提升 STORAGE_VERSION 并写迁移逻辑。 */
  var STATUSES = ["want_to_read", "reading", "read"];
  var STATUS_LABEL = { want_to_read: "想读", reading: "在读", read: "读完" };

  function isKnownStatus(s) {
    return STATUSES.indexOf(s) !== -1;
  }

  /* ---------- 存储可用性 ---------- */

  function storageAvailable() {
    // 只探测读取权限，不通过临时 set/remove 让「读取」产生写入副作用。
    try {
      void window.localStorage.getItem(STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- 读写（全部走校验，坏数据不落盘、不返回） ---------- */

  // 返回 { version, items: { workId: { status, updatedAt, scope } } }
  function loadRaw() {
    var empty = { version: STORAGE_VERSION, items: {}, writable: true, futureVersion: false };
    if (!storageAvailable()) { empty.writable = false; return empty; }
    var raw;
    try { raw = window.localStorage.getItem(STORAGE_KEY); } catch (e) { empty.writable = false; return empty; }
    if (!raw) return empty;

    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { empty.writable = false; return empty; } // 损坏 → 可读作空，但禁止覆盖原始数据
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) { empty.writable = false; return empty; }
    var storedVersion = typeof parsed.version === "number" ? parsed.version : STORAGE_VERSION;
    // 新版数据不由旧版代码解释或覆盖；等迁移代码就绪后再读写。
    if (storedVersion > STORAGE_VERSION) {
      return { version: storedVersion, items: {}, writable: false, futureVersion: true };
    }

    var items = parsed.items;
    if (!items || typeof items !== "object" || Array.isArray(items)) { empty.writable = false; return empty; }

    var clean = {};
    Object.keys(items).forEach(function (workId) {
      var rec = items[workId];
      if (!rec || typeof rec !== "object") return;
      if (typeof workId !== "string" || !workId) return;      // 作品 ID 必须是非空字符串
      if (!isKnownStatus(rec.status)) return;                  // 未知状态 → 丢弃
      clean[workId] = {
        status: rec.status,
        updatedAt: typeof rec.updatedAt === "string" ? rec.updatedAt : "",
        scope: typeof rec.scope === "string" ? rec.scope : ""  // 未来版本级标记预留
      };
    });

    return {
      version: storedVersion,
      items: clean,
      writable: true,
      futureVersion: false
    };
  }

  function saveRaw(state) {
    if (!state || state.writable === false || state.futureVersion) return false;
    if (!storageAvailable()) return false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: STORAGE_VERSION,
        items: state.items
      }));
      return true;
    } catch (e) {
      return false; // 配额满 / 隐私模式 → 静默失败
    }
  }

  function nowISO() {
    try { return new Date().toISOString(); } catch (e) { return ""; }
  }

  /* ---------- 对外接口 ---------- */

  /**
   * 读取某个作品的阅读状态。
   * @param {string} workId 例如 "book-011"
   * @returns {{status:string, updatedAt:string, scope:string}|null}
   */
  function getReadingStatus(workId) {
    if (!workId || typeof workId !== "string") return null;
    var state = loadRaw();
    return state.items[workId] || null;
  }

  /**
   * 设置阅读状态。只在用户动作中调用。
   * @param {string} workId
   * @param {"want_to_read"|"reading"|"read"} status
   * @param {{scope?:string}} [opts]
   * @returns {boolean} 是否写入成功
   */
  function setReadingStatus(workId, status, opts) {
    if (!workId || typeof workId !== "string") return false;
    if (!isKnownStatus(status)) return false;   // 非法状态直接拒绝
    var state = loadRaw();                      // 先读，保留其它条目
    if (!state.writable || state.futureVersion) return false;
    state.items[workId] = {
      status: status,
      updatedAt: nowISO(),
      scope: (opts && typeof opts.scope === "string") ? opts.scope : ""
    };
    return saveRaw(state);
  }

  /**
   * 删除某个作品的阅读状态。
   * @param {string} workId
   * @returns {boolean}
   */
  function removeReadingStatus(workId) {
    if (!workId || typeof workId !== "string") return false;
    var state = loadRaw();
    if (!state.writable || state.futureVersion) return false;
    if (!state.items[workId]) return true;      // 本来就没有，视为成功
    delete state.items[workId];
    return saveRaw(state);
  }

  /**
   * 列出全部阅读状态。
   * @returns {Array<{workId:string,status:string,updatedAt:string,scope:string}>}
   */
  function getReadingList() {
    var state = loadRaw();
    if (state.futureVersion) return [];
    return Object.keys(state.items).map(function (workId) {
      var r = state.items[workId];
      return { workId: workId, status: r.status, updatedAt: r.updatedAt, scope: r.scope };
    });
  }

  /** 清空全部阅读状态（危险操作，需显式调用）。 */
  function clearAll() {
    var state = loadRaw();
    // 不允许旧版模块清除未来版本的数据，避免破坏尚未支持的格式。
    if (state.futureVersion) return false;
    if (!storageAvailable()) return false;
    try { window.localStorage.removeItem(STORAGE_KEY); return true; } catch (e) { return false; }
  }

  return {
    storageKey: STORAGE_KEY,
    version: STORAGE_VERSION,
    statuses: STATUSES.slice(),
    statusLabel: function (s) { return STATUS_LABEL[s] || ""; },
    available: storageAvailable,
    getReadingStatus: getReadingStatus,
    setReadingStatus: setReadingStatus,
    removeReadingStatus: removeReadingStatus,
    getReadingList: getReadingList,
    clearAll: clearAll
  };
})();
