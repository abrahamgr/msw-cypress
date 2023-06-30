import { render, screen, fireEvent } from '@testing-library/react'
import { server } from './mocks/server'
import { sampleServerHandler } from './mocks/items'
import { Request, getItems } from './Request'

test('getItems',  async () => {
  const data = await getItems()
  expect(data).toEqual({ value: 'Hi from client' })
})

test('getItems',  async () => {
  //overwrite default handlers
  server.use(sampleServerHandler)
  const data = await getItems()
  expect(data).toEqual({ value: 'Hi from Server/Cypress' })
})

test('Render component', async () => {
  render(<Request />)
  const button = await screen.findByRole('button', { name: 'Make a request' })
  expect(button).toBeDefined()
  fireEvent.click(button)
  const pre = await screen.findByTestId('response-value')
  // value defined on POST data sent from client
  expect(pre.textContent).toEqual(JSON.stringify({ value: 'Hi from client' }))
})