describe('Carga de la app', () => {
  it('Debería mostrar el título y renderizar la página principal', () => {
    cy.visit('/')
    cy.contains('MyBeats').should('be.visible')
    cy.get('[data-testid="home-title"]').should('contain.text', 'TrendingNow')
  })
})