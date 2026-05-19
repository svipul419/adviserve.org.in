import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { rateLimit, rateLimitWithInfo } from '../../api/_db';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests up to the limit', () => {
    const key = `t1:${Math.random()}`;
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
  });

  it('blocks the next request after the limit is exhausted', () => {
    const key = `t2:${Math.random()}`;
    expect(rateLimit(key, 2, 60_000)).toBe(true);
    expect(rateLimit(key, 2, 60_000)).toBe(true);
    expect(rateLimit(key, 2, 60_000)).toBe(false);
  });

  it('resets after the window elapses', () => {
    const key = `t3:${Math.random()}`;
    expect(rateLimit(key, 1, 60_000)).toBe(true);
    expect(rateLimit(key, 1, 60_000)).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(rateLimit(key, 1, 60_000)).toBe(true);
  });

  it('rateLimitWithInfo reports remaining and resetAt', () => {
    const key = `t4:${Math.random()}`;
    const r1 = rateLimitWithInfo(key, 3, 60_000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r1.resetAt).toBeGreaterThan(Date.now());

    const r2 = rateLimitWithInfo(key, 3, 60_000);
    expect(r2.remaining).toBe(1);

    rateLimitWithInfo(key, 3, 60_000);
    const r4 = rateLimitWithInfo(key, 3, 60_000);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it('separates keys so one IP being blocked does not affect another', () => {
    const a = `t5a:${Math.random()}`;
    const b = `t5b:${Math.random()}`;
    expect(rateLimit(a, 1, 60_000)).toBe(true);
    expect(rateLimit(a, 1, 60_000)).toBe(false);
    expect(rateLimit(b, 1, 60_000)).toBe(true);
  });
});
