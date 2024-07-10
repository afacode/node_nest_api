export const getConfiguration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  wsPort: parseInt(process.env.WS_PORT, 10) || 3000,
  TEST_ENV: process.env.TEST_ENV,
  jwtSecret: process.env.JWT_SECRET,

  // jwt sign secret
  jwt: {
    secret: process.env.JWT_SECRET || '123456',
  },
  rootRoleId: parseInt(process.env.ROOT_ROLE_ID || '1'),
  mysql: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number.parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USERNAME,
      password:
        process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      migrations: ['dist/src/migrations/**/*.js'],
      autoLoadEntities: true,
      /** https://typeorm.io/migrations */
      synchronize: true, // 生产环境 关闭
      logging: ['error'],
      maxQueryExecutionTime: 1000, // 记录长时间运行的查询
      timezone: '+08:00', // 东八区
      cli: {
        migrationsDir: 'src/migrations',
      },
  },
  redis: {
    host: process.env.REDIS_HOST, // default value
    port: parseInt(process.env.REDIS_PORT, 10), // default value
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  // swagger
  swagger: {
    enable: process.env.SWAGGER_ENABLE === 'true',
    path: process.env.SWAGGER_PATH,
    title: process.env.SWAGGER_TITLE,
    desc: process.env.SWAGGER_DESC,
    version: process.env.SWAGGER_VERSION,
  },
  // logger config
  logger: {
    timestamp: false,
    dir: process.env.LOGGER_DIR,
    maxFileSize: process.env.LOGGER_MAX_SIZE,
    maxFiles: process.env.LOGGER_MAX_FILES,
    errorLogName: process.env.LOGGER_ERROR_FILENAME,
    appLogName: process.env.LOGGER_APP_FILENAME,
  },

});

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export const getEnv = () => {
  return process.env.RUN_ENV;
};

export const IS_DEV = getEnv() == 'dev';

export const IS_PROD = getEnv() == 'prod';

export type ConfigurationType = ReturnType<typeof getConfiguration>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type ConfigurationKeyPaths = Record<NestedKeyOf<ConfigurationType>, any>;