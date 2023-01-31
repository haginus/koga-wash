export function stringifyDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return d.toLocaleDateString("Ro-ro", options || defaultOptions);
}

export function stringifyTime(date: Date | string | number, options?: Intl.DateTimeFormatOptions) {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric" };
  return d.toLocaleTimeString("RO-ro", options || defaultOptions);
}