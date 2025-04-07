import dotenv from "dotenv";
import pgPromise from "pg-promise";

const pgp = pgPromise({});
dotenv.config();

const db = pgp({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: true,
});

export function getAllUsers() {
  return db.any("SELECT * FROM users");
}

export function getUserById(id) {
  return db.one("SELECT * FROM users WHERE id = $1", [id]);
}

export function getUserByEmail(email) {
  return db.one("SELECT * FROM users WHERE email = $1", [email]);
}

export function getUserByUsername(username) {
  return db.one("SELECT * FROM users WHERE username = $1", [username]);
}

export function createUser(email, username, password, salt) {
  return db.none(
    "INSERT INTO users(email, username, hashed_pwd, salt) VALUES($1, $2, $3, $4)",
    [email, username, password, salt]
  );
}

export function updateUser(id, email, username, password) {
  return db.none(
    "UPDATE users SET email = $1, username = $2, hashed_pwd = $3 WHERE id = $4",
    [email, username, password, id]
  );
}

export function deleteUser(id) {
  return db.none("DELETE FROM users WHERE id = $1", [id]);
}
