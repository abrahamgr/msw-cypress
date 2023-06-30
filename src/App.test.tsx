import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('Render app', async () => {
  render(<App />)
  const title = await screen.findByText(/vite \+ react/i)
  expect(title).toBeDefined()
})

test('click counter', () => {
  render(<App />)
  const button = screen.getByRole('button', { name: 'count is 0' })
  fireEvent.click(button)
  expect(button.textContent).toBe('count is 1')
  fireEvent.click(button)
  expect(button.textContent).toBe('count is 2')
})
