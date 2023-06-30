# msw-cypress

Example of using MSW within Cypress

## Tools

- vite + React + Typescript
- vitest
- MSW
- Cypress

## Advantage

Recently I had the requirement to re-use handlers we already have created for unit testing, I tried many approaches exposing `worker` and `rest` from MSW but i did't have luck so I just pick what I need from [cypress-msw-interceptor](https://github.com/deshiknaves/cypress-msw-interceptor) to make it compatible with my existing handlers and this is the result.
