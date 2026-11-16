import test from "node:test";
import assert from "node:assert/strict";
import { fmtMonth, range } from "../app/content/format.mjs";

test("fmtMonth formats a YYYY-MM value", () => {
  assert.equal(fmtMonth("2025-09"), "Sep 2025");
  assert.equal(fmtMonth("2024-01"), "Jan 2024");
});

test("fmtMonth leaves non-month values alone", () => {
  assert.equal(fmtMonth("2025"), "2025");
  assert.equal(fmtMonth(""), "");
  assert.equal(fmtMonth(undefined), "");
});

test("range renders an ongoing role with the now word", () => {
  assert.equal(
    range({ start: "2025-09", end: "", current: true }),
    "Sep 2025 – present",
  );
});

test("range renders a closed role with its end month", () => {
  assert.equal(
    range({ start: "2023-01", end: "2024-06", current: false }, " / ", "NOW"),
    "Jan 2023 / Jun 2024",
  );
});
