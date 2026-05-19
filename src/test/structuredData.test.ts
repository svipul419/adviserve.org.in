import { describe, it, expect } from 'vitest'
import {
  generateOrganizationSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateBlogPostSchema,
  generateWebPageSchema,
} from '../lib/structuredData'

describe('structuredData', () => {
  it('generateOrganizationSchema returns valid schema', () => {
    const schema = generateOrganizationSchema({
      business_name: 'Test Co',
      website: 'https://test.com',
    })
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('ProfessionalService')
    expect(schema.name).toBe('Test Co')
    expect(schema.url).toBe('https://test.com')
  })

  it('generateOrganizationSchema falls back to Adviserve', () => {
    const schema = generateOrganizationSchema({})
    expect(schema.name).toBe('Adviserve')
  })

  it('generateFAQSchema creates FAQ page schema', () => {
    const faqs = [
      { question: 'Q1?', answer: 'A1' },
      { question: 'Q2?', answer: 'A2' },
    ]
    const schema = generateFAQSchema(faqs)
    expect(schema).not.toBeNull()
    expect(schema!['@type']).toBe('FAQPage')
    expect(schema!.mainEntity).toHaveLength(2)
    expect(schema!.mainEntity[0].name).toBe('Q1?')
    expect(schema!.mainEntity[0].acceptedAnswer.text).toBe('A1')
  })

  it('generateFAQSchema returns null for empty array', () => {
    expect(generateFAQSchema([])).toBeNull()
  })

  it('generateBreadcrumbSchema creates breadcrumb list', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
    ]
    const schema = generateBreadcrumbSchema(items)
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement).toHaveLength(2)
    expect(schema.itemListElement[0].position).toBe(1)
    expect(schema.itemListElement[1].position).toBe(2)
  })

  it('generateServiceSchema creates service schema', () => {
    const schema = generateServiceSchema(
      { title: 'HR Consulting', description: 'Full HR services', slug: 'hr' },
      'https://test.com'
    )
    expect(schema['@type']).toBe('Service')
    expect(schema.name).toBe('HR Consulting')
    expect(schema.url).toBe('https://test.com/services/hr')
    expect(schema.provider.name).toBe('Adviserve')
  })

  it('generateBlogPostSchema creates article schema', () => {
    const schema = generateBlogPostSchema(
      { title: 'Test Post', excerpt: 'A test', slug: 'test', author: 'Author', published_at: '2024-01-01' },
      'https://test.com'
    )
    expect(schema['@type']).toBe('BlogPosting')
    expect(schema.headline).toBe('Test Post')
    expect(schema.url).toBe('https://test.com/blog/test')
    expect(schema.author).toEqual({ '@type': 'Person', name: 'Author' })
  })

  it('generateWebPageSchema creates webpage schema', () => {
    const schema = generateWebPageSchema({
      title: 'About',
      description: 'About page',
      url: 'https://test.com/about',
    })
    expect(schema['@type']).toBe('WebPage')
    expect(schema.name).toBe('About')
  })
})
