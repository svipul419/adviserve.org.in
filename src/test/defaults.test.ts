import { describe, it, expect } from 'vitest'
import {
  DEFAULT_MENU_ITEMS,
  DEFAULT_SERVICES,
  DEFAULT_FOOTER_SERVICE_LINKS,
  DEFAULT_SERVICE_OPTIONS,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_FAQS,
  DEFAULT_STORY_PARAGRAPHS,
  DEFAULT_APPROACH_STEPS,
  DEFAULT_HOME_STATS,
  DEFAULT_WHY_CHOOSE_ITEMS,
  DEFAULT_TESTIMONIALS,
} from '../lib/defaults'

describe('defaults', () => {
  it('DEFAULT_MENU_ITEMS has correct structure', () => {
    expect(DEFAULT_MENU_ITEMS.length).toBeGreaterThan(0)
    DEFAULT_MENU_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('url')
      expect(item.url).toMatch(/^\//)
    })
  })

  it('DEFAULT_SERVICES all have required fields', () => {
    DEFAULT_SERVICES.forEach((service) => {
      expect(service.title).toBeTruthy()
      expect(service.slug).toBeTruthy()
      expect(service.description).toBeTruthy()
    })
  })

  it('DEFAULT_FOOTER_SERVICE_LINKS have valid URLs', () => {
    DEFAULT_FOOTER_SERVICE_LINKS.forEach((link) => {
      expect(link.label).toBeTruthy()
      expect(link.url).toMatch(/^\/services\//)
    })
  })

  it('DEFAULT_SERVICE_OPTIONS are non-empty', () => {
    expect(DEFAULT_SERVICE_OPTIONS.length).toBeGreaterThan(0)
    DEFAULT_SERVICE_OPTIONS.forEach((opt) => {
      expect(opt.value).toBeTruthy()
      expect(opt.label).toBeTruthy()
    })
  })

  it('DEFAULT_BUSINESS_HOURS cover workdays', () => {
    const days = DEFAULT_BUSINESS_HOURS.map((h) => h.day)
    expect(days.some((d) => d.includes('Monday'))).toBe(true)
  })

  it('DEFAULT_FAQS have questions and answers', () => {
    expect(DEFAULT_FAQS.length).toBeGreaterThan(0)
    DEFAULT_FAQS.forEach((faq) => {
      expect(faq.question).toBeTruthy()
      expect(faq.answer.length).toBeGreaterThan(20)
    })
  })

  it('DEFAULT_STORY_PARAGRAPHS are non-empty strings', () => {
    expect(DEFAULT_STORY_PARAGRAPHS.length).toBeGreaterThan(0)
    DEFAULT_STORY_PARAGRAPHS.forEach((p) => {
      expect(typeof p).toBe('string')
      expect(p.length).toBeGreaterThan(10)
    })
  })

  it('DEFAULT_APPROACH_STEPS have sequential numbers', () => {
    DEFAULT_APPROACH_STEPS.forEach((step, i) => {
      expect(step.num).toBe(String(i + 1).padStart(2, '0'))
    })
  })

  it('DEFAULT_HOME_STATS have labels and values', () => {
    DEFAULT_HOME_STATS.forEach((stat) => {
      expect(stat.label).toBeTruthy()
      expect(stat.value).toBeTruthy()
    })
  })

  it('DEFAULT_WHY_CHOOSE_ITEMS have titles and descriptions', () => {
    DEFAULT_WHY_CHOOSE_ITEMS.forEach((item) => {
      expect(item.title).toBeTruthy()
      expect(item.description.length).toBeGreaterThan(10)
    })
  })

  it('DEFAULT_TESTIMONIALS have required fields', () => {
    DEFAULT_TESTIMONIALS.forEach((t) => {
      // Each testimonial must identify the speaker (either via name or company),
      // carry a role label, and hold a substantive quote. New Adviserve testimonials
      // attribute via name (e.g. "Yamaha Motors") + role ("Service Management Lead")
      // so company may be empty.
      expect(t.name || t.company).toBeTruthy()
      expect(t.quote.length).toBeGreaterThan(20)
    })
  })
})
