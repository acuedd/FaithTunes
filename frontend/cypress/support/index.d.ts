// extiende los comandos de Cypress
declare namespace Cypress {
  interface Chainable {
    checkPageTitle(text: string): Chainable<void>
    playFirstSong(): Chainable<void>
    assertAudioIsPlaying(): Chainable<void>
    login(email: string, password: string): Chainable<void>
  }
}