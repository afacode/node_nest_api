## Description
基于 NestJs + TypeScript + TypeORM + Redis + MySql 一款简单高效的前后端分离的权限管理

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 安装

```bash
$ pnpm install
```
## redis mysql
`docker run -e MYSQL_ROOT_PASSWORD=123456 -p 3306 3306 -d mysql:8`
`docker run --name redis -d -p 6379:6379 redis:6.0`

## 运行

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 测试

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

`0440051410444`

request -> middleware -> guard -> RequestInterceptor -> pipe ->  handler -> ResponseInterceptor -> filter -> response

## License

Nest is [MIT licensed](LICENSE).
