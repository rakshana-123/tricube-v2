/**
 * Add N working days (Mon–Fri) to a date. Public holidays out of scope.
 */
export function addWorkingDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

export function formatExpectedRange(from = new Date()): string {
  const min = addWorkingDays(from, 3);
  const max = addWorkingDays(from, 4);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(min)} – ${fmt(max)}`;
}