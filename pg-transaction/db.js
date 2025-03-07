const pgp = require("pg-promise")();

const cn = {
    connectionString: "postgres://username:password@localhost:5432/orders", 
    max: 10
}

const db = pgp(cn);

module.exports = db;