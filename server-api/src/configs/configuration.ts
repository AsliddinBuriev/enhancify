export const configuration = () => ({
  port: process.env.PORT,
  jwt: {
    atSecret: process.env.JWT_AT_SECRET,
    rtSecret: process.env.JWT_RT_SECRET,
    atExpiresIn: process.env.JWT_AT_EXPIRES_IN,
    rtExpiresIn: process.env.JWT_RT_EXPIRES_IN,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_REDIRECT_URL,
    callBackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callBackUrl: process.env.GITHUB_CALLBACK_URL,
  },
  database: {
    type: process.env.DB_TYPE as 'postgres' | 'sqlite',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: Boolean(process.env.DB_AUTO_LOAD_ENTITIES),
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  },
});
