const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Jan 15" — stored dates are UTC ISO strings, so format them as UTC. */
export function formatShortDate(isoDate: string): string {
  return SHORT_DATE.format(new Date(isoDate));
}

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "January 15, 2026" — stored dates are UTC ISO strings, so format them as UTC. */
export function formatLongDate(isoDate: string): string {
  return LONG_DATE.format(new Date(isoDate));
}
