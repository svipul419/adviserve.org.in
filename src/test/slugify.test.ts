import { describe, it, expect } from 'vitest';
import { generateSlug } from '../lib/slugify';

describe('generateSlug', () => {
  it('lowercases input', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('replaces whitespace runs with a single hyphen', () => {
    expect(generateSlug('one   two\tthree')).toBe('one-two-three');
  });

  it('strips punctuation and non-alphanumerics', () => {
    expect(generateSlug("What's New: 2026!")).toBe('whats-new-2026');
  });

  it('collapses consecutive hyphens', () => {
    expect(generateSlug('a -- b --- c')).toBe('a-b-c');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('--leading and trailing--')).toBe('leading-and-trailing');
  });

  it('preserves digits', () => {
    expect(generateSlug('Post 42 / Edition 7')).toBe('post-42-edition-7');
  });

  it('returns empty string for input with no slug-safe characters', () => {
    expect(generateSlug('!!!')).toBe('');
  });

  it('handles an empty string', () => {
    expect(generateSlug('')).toBe('');
  });
});
