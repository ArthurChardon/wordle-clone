CREATE TABLE IF NOT EXISTS verifies (
    verification_ref VARCHAR(255) NOT NULL,
    userId SERIAL REFERENCES users(id)
);