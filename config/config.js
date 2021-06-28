module.exports = {
  
  PRODUCTION: process.env.NODE_ENV,

  PORT: process.env.PORT,

  DB: {
    PGUSER: process.env.PGUSER,
    PGHOST: process.env.PGHOST,
    PGPASSWORD: process.env.PGPASSWORD,
    PGDATABASE: process.env.PGDATABASE,
    PGPORT: process.env.PGPORT,
    MYPORT: process.env.MYPORT,
  },

  IZIUSER: process.env.IZIUSER,
  IZIPASSWORD: process.env.IZIPASSWORD,

  SESSION: {
    NAME: process.env.SESSION_NAME,
    SECRET: process.env.SESSION_SECRET,
  },

  ADMIN: {
    ID: process.env.ADMIN_ID,
    USERNAME: process.env.ADMIN_USERNAME,
    PASSWORD: process.env.ADMIN_PASSWORD,
  },

  OUTLOOKUSER: process.env.OUTLOOKUSER,
  OUTLOOKPASSWORD: process.env.OUTLOOKPASSWORD,

};