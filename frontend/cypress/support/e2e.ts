import '@cypress/code-coverage/support'/// <reference types="cypress" />

// ✅ Comando personalizado para verificar título de página o sección
Cypress.Commands.add('checkPageTitle', (text: string) => {
  cy.get('[data-testid="home-title"]').should('contain.text', text)
})

// ✅ Comando para reproducir la primera canción disponible
Cypress.Commands.add('playFirstSong', () => {
  cy.get('[data-testid="song-item"]').first().within(() => {
    cy.get('[data-testid="play-button"]').click()
  })
})

// ✅ Comando para verificar que el audio está reproduciendo
Cypress.Commands.add('assertAudioIsPlaying', () => {
  cy.get('[data-testid="audio-element"]')
    .should('have.prop', 'paused', false)
})

// ✅ Comando para simular login (opcional)
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})