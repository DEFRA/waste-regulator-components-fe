import { renderComponent } from '#test-helpers/component-helpers.js'

describe('Heading Component', () => {
  let $heading

  describe('With caption', () => {
    beforeEach(() => {
      $heading = renderComponent('heading', {
        text: 'Services',
        caption: 'A page showing available services'
      })
    })

    test('Should render wrc heading component', () => {
      expect($heading('[data-testid="wrc-heading"]')).toHaveLength(1)
    })

    test('Should contain expected heading', () => {
      expect($heading('[data-testid="wrc-heading-title"]').text().trim()).toBe(
        'Services'
      )
    })

    test('Should have expected heading caption', () => {
      expect(
        $heading('[data-testid="wrc-heading-caption"]').text().trim()
      ).toBe('A page showing available services')
    })

    test('Should render the caption before the heading', () => {
      expect(
        $heading('[data-testid="wrc-heading-caption"] + h1').attr('data-testid')
      ).toBe('wrc-heading-title')
    })
  })

  describe('Without caption', () => {
    test('Should not render caption when caption is omitted', () => {
      const $ = renderComponent('heading', {
        text: 'Heading without caption'
      })

      expect($('[data-testid="wrc-heading"]')).toHaveLength(1)
      expect($('[data-testid="wrc-heading-title"]').text().trim()).toBe(
        'Heading without caption'
      )
      expect($('[data-testid="wrc-heading-caption"]')).toHaveLength(0)
    })
  })
})
