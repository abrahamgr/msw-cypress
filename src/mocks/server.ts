import { setupServer } from 'msw/node'
import { itemsHandler } from './items'

// This configures a request mocking server with the given request handlers.
export const server = setupServer(itemsHandler)