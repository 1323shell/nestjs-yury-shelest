<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Installation

```bash
npm install
npm run prisma:generate
npm run migrate
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## GraphQL

```bash
# playground
http://localhost:3000/graphql
```

## Prisma

```bash
# Once you've updated your data model (schema.prisma file),
# you can execute the changes against your database with the following command:
npm run add-migration
