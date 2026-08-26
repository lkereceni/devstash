const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Jan 15" — stored dates are UTC ISO strings, so format them as UTC. */
export function formatShortDate(isoDate: string): string {
  return SHORT_DATE.format(new Date(isoDate));
}
