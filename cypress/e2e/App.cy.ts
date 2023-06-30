/// <reference types="cypress" />

import { itemsHandler, sampleServerHandler } from '../../src/mocks/items'

it('No MSW', () => {
  cy.visit('/')
  cy.get('button[type="button"]').click()
  const pre = cy.get('pre')
  pre.should('have.text', 'Unexpected end of JSON input')
})

it('Use itemsHandler', () => {
  cy.interceptRequest(itemsHandler)
  cy.visit('/')
  cy.get('button[type="button"]').click()
  const pre = cy.get('pre')
  pre.should('have.text', JSON.stringify({ value: 'Hi from client' }))
})

it('Use sampleServerHandler', () => {
  cy.interceptRequest(sampleServerHandler)
  cy.visit('/')
  cy.get('button[type="button"]').click()
  const pre = cy.get('pre')
  pre.should('have.text', JSON.stringify({ value: 'Hi from Server/Cypress' }))
})