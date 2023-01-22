CREATE TABLE orders (
    id SERIAL PRIMARY  KEY,
    status VARCHAR,
    user_id int REFERENCES users(id)
);
