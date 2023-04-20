const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DB,
    port: process.env.DB_PORT
});

console.log("SUCCESS");
console.log(process.env.USER, process.env.PASSWORD, process.env.HOST, process.env.DB, process.env.PORT);

module.exports = pool;