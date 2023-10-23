## Description
基于 NestJs + TypeScript + TypeORM + Redis + MySql 一款简单高效的前后端分离的权限管理 demo

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```
## redis mysql
`docker run -e MYSQL_ROOT_PASSWORD=123456 -p 3306 3306 -d mysql:8`
`docker run --name redis -d -p 6379:6379 redis:6.0`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

request -> middleware -> guard -> RequestInterceptor -> pipe ->  handler -> ResponseInterceptor -> filter -> response

## License

Nest is [MIT licensed](LICENSE).
