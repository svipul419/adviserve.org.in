import DOMPurify from 'dompurify';

// Register the rel="noopener noreferrer" hook lazily on first use.
// At module-load time `window` may not exist (e.g. when sanitize.ts is
// pulled into a Node build of seed scripts via a transitive import), and
// jsdom-DOMPurify in tests creates a separate instance that needs its own
// hook registration if this module is loaded before jsdom is ready.
let hookRegistered = false;
function ensureHooks() {
  if (hookRegistered) return;
  if (typeof window === 'undefined') return;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  hookRegistered = true;
}

// Strict sanitizer — only allow safe HTML tags and attributes
export function sanitizeHTML(dirty: string): string {
  ensureHooks();
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li',
      'strong', 'em', 'b', 'i', 'br', 'hr', 'img', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'td', 'th', 'span', 'div', 'figure', 'figcaption',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'class', 'target', 'rel', 'id', 'width', 'height', 'loading',
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/** Safely parse JSON with fallback — prevents page crash on malformed data */
export function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return (value as T) ?? fallback;
}
