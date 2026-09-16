export function safeNext(next: string | undefined): string {
  if (!next) return "/editor";
  // The URL parser strips tab/LF/CR before parsing, so a value that looks
  // path-relative here can still resolve to another origin. Strip first,
  // then require a single leading slash.
  const clean = next.replace(/[\t\n\r]/g, "");
  if (!/^\/(?!\/|\\)/.test(clean)) return "/editor";
  return clean;
}
