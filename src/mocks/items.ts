import { rest } from 'msw'

const apiPath = '/api/items'

export const itemsHandler = rest.post(apiPath, async (req, res, ctx) => {
  const body = await req.json()
  return res(
    ctx.json(body)
  )
})

export const sampleServerHandler = rest.post(apiPath, async (req, res, ctx) => {
  return res(
    ctx.json({
      value: 'Hi from Server/Cypress'
    })
  )
})