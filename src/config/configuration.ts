export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10) || 1025,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
    from: process.env.MAIL_FROM,
  },
  captcha: {
    secret: process.env.CAPTCHA_SECRET,
  },
  gateway: {
    url: process.env.GATEWAY_URL,
    secret: process.env.GATEWAY_SECRET,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  }
});