import { describe, it, expect } from 'vitest';
import { sanitizeHTML, safeJsonParse } from '../lib/sanitize';

describe('sanitizeHTML', () => {
  it('preserves allowed tags and attributes', () => {
    const out = sanitizeHTML('<h1 class="t">Hi</h1><p>Body <a href="https://example.com">link</a></p>');
    expect(out).toContain('<h1');
    expect(out).toContain('Hi');
    expect(out).toContain('<a');
    expect(out).toContain('href="https://example.com"');
  });

  it('strips <script> tags', () => {
    const out = sanitizeHTML('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('alert(1)');
    expect(out).toContain('<p>ok</p>');
  });

  it('strips inline event handlers', () => {
    const out = sanitizeHTML('<a href="/x" onclick="alert(1)">x</a>');
    expect(out).not.toContain('onclick');
  });

  it('enforces rel="noopener noreferrer" on target="_blank" links', () => {
    const out = sanitizeHTML('<a href="https://example.com" target="_blank">x</a>');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it('drops disallowed tags like <iframe>', () => {
    const out = sanitizeHTML('<iframe src="https://evil.example"></iframe><p>safe</p>');
    expect(out).not.toContain('<iframe');
    expect(out).toContain('<p>safe</p>');
  });
});

describe('safeJsonParse', () => {
  it('parses a valid JSON string', () => {
    expect(safeJsonParse('{"a":1}', null)).toEqual({ a: 1 });
  });

  it('returns the fallback when the string is not valid JSON', () => {
    expect(safeJsonParse('not json', { fallback: true })).toEqual({ fallback: true });
  });

  it('passes through non-string values', () => {
    expect(safeJsonParse({ a: 1 }, null)).toEqual({ a: 1 });
  });

  it('returns the fallback for null/undefined input', () => {
    expect(safeJsonParse(null, [])).toEqual([]);
    expect(safeJsonParse(undefined, 'fallback')).toBe('fallback');
  });
});
