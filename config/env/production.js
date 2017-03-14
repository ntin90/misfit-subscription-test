module.exports = {
    log: { level: "debug"},
    self_host: process.env.DOMAIN,
    app_key: process.env.APP_KEY,
    app_secret: process.env.APP_SECRET,
    connection: {
        localDiskDb: {
            adapter: 'sails-postgresql',
            url: process.env.DATABASE_URL
            // host: process.env.POSTGRES_HOST,
            // user: process.env.POSTGRES_USER,
            // password: process.env.POSTGRES_PASS,
            // database: process.env.POSTGRES_DB
        }
    }
};
