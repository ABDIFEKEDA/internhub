const { Pool } = require('pg')
require('dotenv').config()

const dbConnection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

  // use SSL only when deploying to Render
  ssl: process.env.DB_HOST.includes("render.com")
    ? { rejectUnauthorized: false }
    : false
})

dbConnection.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Error connecting to database:", err))

module.exports = dbConnection