describe('Reproducción de canciones', () => {
  beforeEach(() => {
    cy.visit('/')

    cy.visit('/login')

    cy.get('input[name="email"]').type('acued89@gmail.com')
    cy.get('input[name="password"]').type('test0210')
    cy.get('button[type="submit"]').click()
  })

  it('Debería reproducir una canción correctamente', () => {
    cy.playFirstSong()
    cy.assertAudioIsPlaying()
  })
})