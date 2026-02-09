const { Pool } = require('pg')

const dbConnection = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'intern',
  password: '1234',
  port: 5432,
})

dbConnection.connect()
  .then(() => console.log("Database connected seccessfully"))
  .catch(err => console.error("Error connecting to database:", err))

module.exports = dbConnection
