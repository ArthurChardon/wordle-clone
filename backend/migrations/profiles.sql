CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    userId SERIAL REFERENCES users(id),
    successes text[]
);