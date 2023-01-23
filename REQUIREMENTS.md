# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index : '/products' [GET]
- Show : '/products/:id' [GET]
- Create [token required] : '/products' [POST]
- [OPTIONAL] Top 5 most popular products : '/five-most-expensive' [GET]
- [OPTIONAL] Products by category (args: product category) 

#### Users
- Index [token required] : '/users' [GET]
- Show [token required] : '/users/:id' [GET]
- Create N[token required] : '/users' [post]

#### Orders
- Current Order by user (args: user id)[token required] : '/orders/:userid' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] 'orders/complete/:userid'

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstname
- lastname
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Schema
### Table products
(id: varchar, name: varchar, price: number)
### Table users
(id: varchar, firstname: varchar, lastname: varchar, password: varchar)
### Table orders
(id: varchar, status: varchar, user_id: varchar[foreign key to table users])
### Table order_products
(id: varchar, quantity: number, order_id: varchar [foreign key to table orders], product_id: varchar [foreign key to table products])