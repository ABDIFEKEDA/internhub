const db = require("../config/dbConnection");

exports.createUser = async ({ id, email, password, role }) => {
  const result = await db.query(
    `INSERT INTO users (id, email, password, role, first_login, is_active)
     VALUES ($1, $2, $3, $4, true, true)
     RETURNING id, email, role, first_login, is_active`,
    [id, email, password, role] // use "password" key
  );
  return result.rows[0];
}

exports.findByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email=$1 AND is_active=true",
    [email]
  );
  return result.rows[0];
};

exports.updatePassword = async (id, password) => {
  await db.query(
    "UPDATE users SET password=$1, first_login=false, updated_at=NOW() WHERE id=$2",
    [password, id]
  );
};
