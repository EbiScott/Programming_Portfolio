export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Format a "YYYY-MM" value as "Mon YYYY". Anything else is returned unchanged.
 * @param {string} value
 * @returns {string}
 */
export function fmtMonth(value) {
  const m = /^(\d{4})-(\d{2})$/.exec(value ?? "");
  return m ? `${MONTHS[+m[2] - 1] ?? m[2]} ${m[1]}` : value ?? "";
}

/**
 * Format an experience date range. Ongoing roles end with the "now" word.
 * @param {{ start: string, end: string, current: boolean }} entry
 * @param {string} [sep]
 * @param {string} [nowWord]
 * @returns {string}
 */
export function range(entry, sep = "–", nowWord = "present") {
  const start = fmtMonth(entry.start);
  const divider = String(sep).trim();
  return entry.current
    ? `${start} ${divider} ${nowWord}`
    : `${start} ${divider} ${fmtMonth(entry.end)}`;
}
