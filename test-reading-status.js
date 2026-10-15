#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function createHarness(initialValue, opts = {}) {
  const data = new Map();
  if (initialValue !== undefined) data.set("lltp.reading.status", initialValue);
  const calls = { set: 0, remove: 0 };
  const storage = {
    getItem(key) { if (opts.blockRead) throw new Error("blocked"); return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { if (opts.blockWrite) throw new Error("blocked"); calls.set++; data.set(key, String(value)); },
    removeItem(key) { if (opts.blockWrite) throw new Error("blocked"); calls.remove++; data.delete(key); }
  };
  const window = { localStorage: storage };
  vm.runInNewContext(fs.readFileSync(require.resolve("./reading-status.js"), "utf8"), { window, Date });
  return { api: window.ReadingStatus, data, calls };
}

let t = createHarness();
assert.equal(t.api.available(), true);
assert.equal(t.calls.set, 0, "available() must not write a probe key");
assert.equal(t.api.setReadingStatus("book-011", "want_to_read"), true);
assert.equal(t.api.getReadingStatus("book-011").status, "want_to_read");
assert.equal(t.api.setReadingStatus("book-011", "invalid"), false);
assert.equal(t.api.getReadingList().length, 1);
assert.equal(t.api.removeReadingStatus("book-011"), true);
assert.equal(t.api.getReadingList().length, 0);

const corrupt = "{ definitely not json";
t = createHarness(corrupt);
assert.equal(t.api.getReadingList().length, 0);
assert.equal(t.api.setReadingStatus("book-011", "read"), false);
assert.equal(t.data.get("lltp.reading.status"), corrupt, "corrupt storage must not be overwritten");

const future = JSON.stringify({ version: 99, items: { "book-011": { status: "read" } }, futureField: "preserve" });
t = createHarness(future);
assert.equal(t.api.version, 1);
assert.equal(t.api.getReadingStatus("book-011"), null);
assert.equal(t.api.setReadingStatus("book-012", "read"), false);
assert.equal(t.api.removeReadingStatus("book-011"), false);
assert.equal(t.api.clearAll(), false);
assert.equal(t.data.get("lltp.reading.status"), future, "future-version data must remain byte-for-byte intact");

t = createHarness(undefined, { blockRead: true });
assert.equal(t.api.available(), false);
assert.equal(t.api.setReadingStatus("book-011", "read"), false);

console.log("阅读状态模块测试通过：正常读写、非法状态、只读探测、损坏数据保护、未来版本保护、存储禁用降级。");
