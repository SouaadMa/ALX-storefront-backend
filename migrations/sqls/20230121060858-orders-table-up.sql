CREATE TABLE orders (
    id SERIAL PRIMARY  KEY,
    status VARCHAR,
    user_id bigint REFERENCES users(id)
);
