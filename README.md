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

## Swagger

```bash
To see the Swagger UI you have to run the application (npm run start:dev),
open your browser and navigate to http://localhost:3000/api

@ApiBody() decorator may not work correctly for some endpoints
because of some validation decorators in DTO.
Instead, try to use @ApiProperty() in DTO to avoid this issue
```
