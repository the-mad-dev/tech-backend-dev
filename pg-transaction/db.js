//basic pg connection

const pgp = require("pg-promise")();

const cn = {
    connectionString: "postgres://username:password@localhost:5432/demo", 
    max: 10 //connection pool limit
}

module.exports = pgp(cn);