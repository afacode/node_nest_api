export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
  },
  TEST_ENV: process.env.TEST_ENV,
  jwtSecret: process.env.JWT_SECRET,
});

export const getEnv = () => {
  return process.env.RUN_ENV;
};

export const IS_DEV = getEnv() == 'dev';

export const IS_PROD = getEnv() == 'prod';
