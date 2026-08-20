/**
 * Copying a signature means putting *rendered* HTML on the clipboard, not the
 * source text. Paste the source into Gmail and the recipient sees markup.
 */
export async function copyRichHtml(html: string, plain: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && "ClipboardItem" in window) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      return true;
    } catch {
      // Safari rejects writes that are not directly inside a user gesture, and
      // Firefox has only recently allowed text/html. Fall through.
    }
  }
  return copyViaSelection(html);
}

/** Legacy path: render into a live element, select it, and let the browser copy. */
function copyViaSelection(html: string): boolean {
  if (typeof document === "undefined") return false;
  const holder = document.createElement("div");
  holder.setAttribute("contenteditable", "true");
  holder.innerHTML = html;
  Object.assign(holder.style, {
    position: "fixed",
    top: "0",
    left: "-9999px",
    opacity: "0",
    whiteSpace: "pre-wrap",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(holder);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(holder);
  selection?.removeAllRanges();
  selection?.addRange(range);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  selection?.removeAllRanges();
  document.body.removeChild(holder);
  return ok;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadFile(name: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
