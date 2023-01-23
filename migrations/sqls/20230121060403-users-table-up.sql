DROP TABLE IF EXISTS order_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
CREATE TABLE users (
    id SERIAL PRIMARY  KEY,
    firstname VARCHAR,
    lastname VARCHAR,
    password VARCHAR
);
