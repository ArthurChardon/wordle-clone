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

// users

export function getUserById(id) {
  return db.one("SELECT * FROM users WHERE id = $1", [id]);
}

export function getUserByEmail(email) {
  return db.one("SELECT * FROM users WHERE email = $1", [email]);
}

export function getUserByUsername(username) {
  return db.one("SELECT * FROM users WHERE username = $1", [username]);
}

export function clearedUsername(username) {
  return db.none("SELECT username FROM users WHERE username = $1", [username]);
}

export function createUser(email, username, password, salt) {
  return db.tx(async (t) => {
    const user = await t.one(
      "INSERT INTO users(email, username, hashed_pwd, salt) VALUES($1, $2, $3, $4) RETURNING id",
      [email, username, password, salt]
    );
    const profile = await t.none(
      "INSERT INTO profiles(userId, successes) VALUES($1, $2)",
      [user.id, []]
    );
  });
}

export function updateUserUsername(username, newUsername) {
  return db.one(
    "UPDATE users SET username = $1 WHERE username = $2 RETURNING username, email",
    [newUsername, username]
  );
}

export function updateUserPassword(username, password) {
  return db.none("UPDATE users SET password = $2 WHERE username = $1", [
    username,
    password,
  ]);
}

export function deleteUser(id) {
  return db.none("DELETE FROM users WHERE id = $1", [id]);
}

// words

export function getWordByDate(date) {
  return db.one("SELECT * FROM words WHERE date = $1", [date]);
}

export function createWord(word, date) {
  return db.none("INSERT INTO words (date, word) VALUES($1, $2)", [date, word]);
}

// profiles

export function getProfileByUserId(id) {
  return db.one("SELECT * FROM profiles WHERE user = $1", [id]);
}

export function getProfileByUserName(username) {
  return db.one(
    "SELECT profiles.successes FROM profiles INNER JOIN users ON users.id=profiles.userId WHERE users.username = $1",
    [username]
  );
}
