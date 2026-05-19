import { describe, it, expect } from 'vitest'
import { parseJsonContent } from '../hooks/useSiteContent'

describe('parseJsonContent', () => {
  it('returns parsed JSON when valid', () => {
    const result = parseJsonContent('{"key":"value"}', { key: 'fallback' })
    expect(result).toEqual({ key: 'value' })
  })

  it('returns fallback for invalid JSON', () => {
    const fallback = { key: 'fallback' }
    expect(parseJsonContent('not json', fallback)).toBe(fallback)
  })

  it('returns fallback for undefined', () => {
    const fallback = [1, 2, 3]
    expect(parseJsonContent(undefined, fallback)).toBe(fallback)
  })

  it('returns fallback for empty string', () => {
    const fallback = 'default'
    expect(parseJsonContent('', fallback)).toBe(fallback)
  })

  it('handles arrays', () => {
    const result = parseJsonContent<string[]>('["a","b"]', [])
    expect(result).toEqual(['a', 'b'])
  })

  it('handles nested objects', () => {
    const json = '{"items":[{"id":1},{"id":2}]}'
    const result = parseJsonContent(json, { items: [] })
    expect(result).toEqual({ items: [{ id: 1 }, { id: 2 }] })
  })
})
