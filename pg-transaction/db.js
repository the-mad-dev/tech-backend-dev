const pgp = require("pg-promise")();

// const cn = {
//     host: 'localhost',
//     port: 5432,
//     database: 'order_management'
// }

const db = pgp("postgres://username:password@localhost:5432/orders")

module.exports = db;