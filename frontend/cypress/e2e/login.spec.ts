describe('Login', () => {
  it('Debería iniciar sesión con credenciales válidas', () => {
    cy.visit('/login')

    cy.get('input[name="email"]').type('acued89@gmail.com')
    cy.get('input[name="password"]').type('test0210')
    cy.get('button[type="submit"]').click()

    // Asegúrate de que redirige o muestra algo que indique que el login fue exitoso
    cy.url().should('not.include', '/login')
    cy.contains('MusicApp').should('be.visible') // Ajusta según tu app
  })
})