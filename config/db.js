"use strict";

// How to create ROLES and USER in MySQL => https://www.mysqltutorial.org/mysql-roles/

const mysql = require('mysql2');
const { DB } = require('./config');

const config = {
  user: DB.PGUSER,
  host: DB.PGHOST,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.MYPORT,
  //timezone: The timezone configured on the MySQL server.
  // This is used to type cast server date/time values to JavaScript Date object and vice versa.
  // This can be 'local', 'Z', or an offset in the form +HH:MM or -HH:MM. (Default: 'local')
  // The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10000)
  connectTimeout: 1000, // default
  // The milliseconds before a timeout occurs during the connection acquisition.
  // This is slightly different from connectTimeout, because acquiring a pool connection does not always involve making a connection.
  // If a connection request is queued, the time the request spends in the queue does not count towards this timeout. (Default: 10000)
  // acquireTimeout: 1000, // default
  waitForConnections: true, // default
  // maximum number of clients the pool should contain
  // by default this is set to 10.
  connectionLimit: 20,
  //The maximum number of connection requests the pool will queue before returning an error from getConnection.
  // If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
  queueLimit: 0, // default
  };
  
  const pool  = mysql.createPool(config);

  const promisePool = pool.promise();
   
  // pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  //   if (error) throw error;
  //   console.log('The solution is: ', results[0].solution);
  // });
  
module.exports = {
  query: async (stmt, params, func) => {
    const start = Date.now();
    const [rows] = await promisePool.query(stmt, params, func)
    const duration = Date.now() - start;
    // console.log('Executed query: ', { stmt, duration: `${duration}ms`, rows: rows.length })
    return rows;
  },
  promisePool,

};