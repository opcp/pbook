const mysql = require('mysql')
const bluebird = require('bluebird')
const db = mysql.createConnection({
    host: "localhost",
    user: "opcp",
    password: "opcp2428",
    database: "pbook"

})
db.connect();
bluebird.promisifyAll(db)

function sqlQuery(sql) {
    let data
    try {
        data = db.queryAsync(sql)
    } catch (err) {
        console.log('in connecting db',err);
    }
    return data
}

module.exports = { db, sqlQuery }