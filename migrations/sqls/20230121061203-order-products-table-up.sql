CREATE TABLE order_products (
    id SERIAL PRIMARY  KEY,
    quantity integer,
    order_id int REFERENCES orders(id),
    product_id int REFERENCES products(id)
);
