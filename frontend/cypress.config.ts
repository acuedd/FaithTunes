import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.spec.{js,ts,jsx,tsx}',
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts', // o déjalo por defecto
  }
})