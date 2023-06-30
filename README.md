# msw-cypress

Example of using MSW within Cypress

## Tools

- [vite + React + Typescript](https://vitejs.dev/guide/)
- [vitest](https://vitest.dev/)
- [MSW](https://mswjs.io/)
- [Cypress](https://www.cypress.io/)

## Advantage

Recently I had the requirement to re-use handlers we already have created for unit testing, I tried many approaches exposing `worker` and `rest` from MSW but i did't have luck so I just pick what I need from [cypress-msw-interceptor](https://github.com/deshiknaves/cypress-msw-interceptor) to make it compatible with my existing handlers and this is the result.

## MSW

Install [msw](https://mswjs.io/docs/getting-started/install) and the thing is that we will configure for browser but we wont start worker from client instead we will do in Cypress, only add the `mockServiceWorker.js` file by running:

```bash
npm add -D msw
npx msw init public/ --save
```

Add a simple component to make a POST (this API does not exists) and we will cover this for unit testing.

```tsx
// Request.tsx
import { useState } from 'react';

export const getItems = async () => {
  // use full URL for unit testing
  const data = await fetch('http://localhost:3000/api/items', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      value: 'Hi from client',
    }),
  }).then((res) => res.json());
  console.warn('data', data);
  return data;
};

export const Request = () => {
  const [response, setResponse] = useState('');

  const handleRequest = async () => {
    try {
      const data = await getItems();
      setResponse(JSON.stringify(data));
    } catch (error) {
      setResponse((error as { message: string }).message);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleRequest}>
        Make a request
      </button>
      <pre data-testid="response-value">{response}</pre>
    </div>
  );
};
```

Add a [mock](https://mswjs.io/docs/getting-started/mocks) and setup MSW for node, here is the [guide](https://mswjs.io/docs/getting-started/integrate/node)

```ts
// mocks/items.ts
import { rest } from 'msw';

const apiPath = '/api/items';

export const itemsHandler = rest.post(apiPath, async (req, res, ctx) => {
  const body = await req.json();
  return res(ctx.json(body));
});

export const sampleServerHandler = rest.post(apiPath, async (req, res, ctx) => {
  return res(
    ctx.json({
      value: 'Hi from Server/Cypress',
    })
  );
});
```

Setup server for tests:

```ts
// mocks/server.ts
import { setupServer } from 'msw/node';
import { itemsHandler } from './items';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(itemsHandler);
```

Setup config for all tests to use MSW:

```typescript
// src/setupTests.ts
import { server } from './mocks/server';

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
```

Make reference to this setup file:

```typescript
// vite.config.ts under test
setupFiles: 'src/setupTests.ts',
```

Add our unit testing:

```tsx
// Request.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { server } from './mocks/server';
import { sampleServerHandler } from './mocks/items';
import { Request, getItems } from './Request';

test('getItems', async () => {
  const data = await getItems();
  expect(data).toEqual({ value: 'Hi from client' });
});

test('getItems', async () => {
  //overwrite default handlers
  server.use(sampleServerHandler);
  const data = await getItems();
  expect(data).toEqual({ value: 'Hi from Server/Cypress' });
});

test('Render component', async () => {
  render(<Request />);
  const button = await screen.findByRole('button', { name: 'Make a request' });
  expect(button).toBeDefined();
  fireEvent.click(button);
  const pre = await screen.findByTestId('response-value');
  // value defined on POST data sent from client
  expect(pre.textContent).toEqual(JSON.stringify({ value: 'Hi from client' }));
});
```

## Cypress

Install Cypress

```bash
npm add -D cypress
```

Add scripts to package.json and run cypress

```json
"cypress": "cypress open"
```

Setup E2E after open Cypress and add the following test:

```typescript
// cypress/e2e/App.cy.ts

/// <reference types="cypress" />

import { itemsHandler, sampleServerHandler } from '../../src/mocks/items';

it('No MSW', () => {
  cy.visit('/');
  cy.get('button[type="button"]').click();
  const pre = cy.get('pre');
  pre.should('have.text', 'Unexpected end of JSON input');
});
it('Use itemsHandler', () => {
  cy.interceptRequest(itemsHandler);
  cy.visit('/');
  cy.get('button[type="button"]').click();
  const pre = cy.get('pre');
  pre.should('have.text', JSON.stringify({ value: 'Hi from client' }));
});

it('Use sampleServerHandler', () => {
  cy.interceptRequest(sampleServerHandler);
  cy.visit('/');
  cy.get('button[type="button"]').click();
  const pre = cy.get('pre');
  pre.should('have.text', JSON.stringify({ value: 'Hi from Server/Cypress' }));
});
```

Now you can can run unit testing by `npm run test` and for Cypress you need to keep running the app by `npm run dev` and open second terminal and run `npm run cypress`.
You will see that requests are mocked by MSW only in Cypress, if you hit the button on a browser it will fail.

I hope it helps!
