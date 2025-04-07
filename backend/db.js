import dotenv from "dotenv";

const pgp = pgPromise({});

export default db = pgp({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

function getAllUsers() {
  return db.any("SELECT * FROM users");
}

function getUserById(id) {
  return db.one("SELECT * FROM users WHERE id = $1", [id]);
}

function getUserByEmail(email) {
  return db.one("SELECT * FROM users WHERE email = $1", [email]);
}

function createUser(email, password) {
  return db.none("INSERT INTO users(email, password) VALUES($1, $2)", [
    email,
    password,
  ]);
}

function updateUser(id, email, password) {
  return db.none("UPDATE users SET email = $1, password = $2 WHERE id = $3", [
    email,
    password,
    id,
  ]);
}

function deleteUser(id) {
  return db.none("DELETE FROM users WHERE id = $1", [id]);
}
