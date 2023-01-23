# Storefront Backend Project

This repo contains a Node and Express app to manage the users, products and orders of a storefront. 
To get started, clone this repo and run `yarn` in your terminal at the project root.

## Used Technologies
This application makes use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Get Started
To get started, clone this repo and run `yarn` in your terminal at the project root. Then, follow the next steps.
### 1. Setup database

Start with running a docker container with the appropriate arguments:
```shell
docker run -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user postgres
```
Then, within the running docker container, we create the dev and test databases:
```shell
root@541a8d281f2b:/# su postgres
postgres@541a8d281f2b:/$ psql -U user
user=# CREATE DATABASE db_dev;
CREATE DATABASE
user=# CREATE DATABASE db_test;
CREATE DATABASE
```
Now, both databases are set. We can run our migrations to create the schemas.

### 2. Setup .env and database.json
Follow the structure of `.env-example` to create your `.env` file.
Follow the structure of `database-example.json` to create your `database.json` file.
To run the migrations, 
```shell
db-migrate up -e test
```
Check your test database in `psql`
```shell
user=# \c db_test;
You are now connected to database "db_test" as user "user".
db_test=# \dt
                 List of relations
 Schema |      Name      | Type  |      Owner      
--------+----------------+-------+-----------------
 public | migrations     | table | user
 public | order_products | table | user
 public | orders         | table | user
 public | products       | table | user
 public | users          | table | user
(5 rows)
```
If your relations look similar to this, you're all set.

### 3. Run tests
```shell
npm run test
```

## API requirements
In this repo there is a `REQUIREMENTS.md` document which outlines what this API supplies for the frontend, as well as the agreed upon data shapes to be passed between front and backend. 

