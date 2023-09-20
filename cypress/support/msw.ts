import { setupWorker, type SetupWorker, type RequestHandler } from 'msw'

declare global {
  namespace Cypress {
    interface Chainable {
      interceptRequest(...handlers: RequestHandler[]): void
    }
  }
}

let worker: SetupWorker

before(() => {
  worker = setupWorker()
  cy.wrap(worker.start({ onUnhandledRequest: 'bypass' }), { log: false })
})

Cypress.on('test:before:run', () => {
  if (!worker) return
  worker.resetHandlers()
})

Cypress.Commands.add('interceptRequest', (...handlers: RequestHandler[]) => {
  if (!worker) return
  worker.use(...handlers)
})