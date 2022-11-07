const config = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: null,
  DB: "easy_compta",
  dialect: "mysql",
  PORT: 3308,
  pool: {
    // maximum number of connection in pool
    max: 5,
    // minimum number of connection in pool
    min: 0,
    // maximum time, in milliseconds, that pool
    // will try to get connection before
    // throwing error
    acquire: 3000,
    // maximum time, in milliseconds, that
    // a connection can be idle before being
    // released
    idle: 10000,
  },
};

export default config;
