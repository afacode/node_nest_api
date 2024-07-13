## Description
基于 NestJs + TypeScript + TypeORM + Redis + MySql + JWT 一款简单高效的前后端分离的权限管理

- 日志: winston
- API管理工具: knife4+swagger
- socket: websocket

修改配置请在.env文件

默认swagger地址
`/swagger-api`

默认knife地址
`/doc.html`

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

# 启动 gprc
$ pnpm run start gprc_test
gprc_test 项目端口：3002
```

## monorepo
```shell
nest g app morepo_demo
nest g lib libdemo
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

## 部署
```shell
## 部署容器
docker-compose up

## 删除所有容器
docker-compose down --rmi all

# 单独跑 Docker 容器，还是可以结合 pm2-runtime 来提高重启速度


docker run -p 9000:9000 -p 9090:9090      --net=host      --name local-oss      -d --restart=always      -e "MINIO_ACCESS_KEY=afacodeadmin"      -e "MINIO_SECRET_KEY=afacodeadmin"      -v /Users/afacode/code/docker_volume_data//local_oss/data:/data      -v /Users/afacode/code/docker_volume_data/local_oss/config:/root/.minio      minio/minio server   /data --console-address ":9090" -address ":9000"
```


### src 目录介绍
```
.
├── app.module.ts
├── common
│   ├── class   api返回结构
│   ├── contants 常量
│   ├── decorators 
│   ├── dto
│   ├── exceptions 业务异常处理
│   ├── filters 异常处理
│   ├── http.filter.ts
│   ├── interceptors 统一处理返回接口结果
│   ├── middleware 中间件
│   ├── publicUrl.decorator.ts
│   ├── response.interceptor.ts
│   └── swagger  接口文档
├── config   配置
│   └── index.ts
├── entities SQL结构映射
│   ├── admin
│   └── base.model.ts
├── main.ts
├── modules 业务模块
│   ├── admin
│   └── ws
├── plugins
│   ├── core
│   └── upload
├── shared  共享模块
│   ├── redis
│   ├── services
│   ├── shared.module.ts
│   └── utils
└── templates  模版
    └── email
```

`0440051410444`

request -> middleware -> guard -> RequestInterceptor -> pipe ->  handler -> ResponseInterceptor -> filter -> response

## License

Nest is [MIT licensed](LICENSE).
