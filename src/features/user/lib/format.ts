const JOIN_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "January 15, 2026" — stored dates are UTC ISO strings, so format them as UTC. */
export function formatJoinDate(isoDate: string): string {
  return JOIN_DATE.format(new Date(isoDate));
}
