describe('home page', () => {
  it('verify the content of the homepage', () => {
    cy.visit('/')
    cy.get('[data-testid=mainSliderTitle]').first().contains('Luma Yoga')
    cy.get('.VueCarousel-dot-button').eq(1).click()
    cy.get('[data-testid=mainSliderTitle]').eq(1).contains('Luma Fitness')
    cy.get('.VueCarousel-dot-button').eq(2).click()
    cy.get('[data-testid=mainSliderSubtitle]').eq(2).contains("What's new")
    cy.get('[data-testid=closeCookieButton]').click()
    cy.get('[data-testid=bottomLinks').should('be.visible')
    cy.get('[data-testid=openNewsletterButton').click().contains('Subscribe')
    cy.get('[data-testid=subscribeSubmit]').contains('Subscribe')
    cy.get('[data-testid=closeModalButton]').click()
    cy.get('[data-testid=mainSliderTitle]').first().contains('Luma Yoga')
    cy.get('.new-collection').should('be.visible')
  })
})
