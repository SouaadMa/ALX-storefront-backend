import supertest from "supertest";
import { Product, ProductStore } from "../../models/product";
import { User, UserStore } from "../../models/user";
import app from "../../server";

const request = supertest(app);
const product_store = new ProductStore();
let dummy_product: Product = {
  id: 0,
  name: "Pc",
  price: 10,
};

const user_store = new UserStore();
let dummy_user: User = {
  id: 0,
  firstname: "souaad",
  lastname: "souaad",
  password: "souaad",
};

let token = "";

beforeAll(async () => {
  await request.post("/users").send(dummy_user); // Create a dummy user
  const response2 = await request.post("/users/login").send(dummy_user); // Authenticate as dummy user
  dummy_user.id = response2.body.id;
  expect(response2.status).toBe(200);
  expect(response2.body).toBeTruthy();
  token = response2.body.token;
});

describe("GET /products == index", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
  });
});

describe("POST /products == create new product", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request
      .post("/products")
      .send(dummy_product)
      .set("Authorization", `Bearer ${token}`);
    dummy_product.id = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummy_product);
  });
  it("should return a 400 response when params (name & price) are missing", async () => {
    const response = await request
      .post("/products")
      .send({})
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
  it("should return a 401 response body when token isnt provided", async () => {
    const response = await request.post("/products").send(dummy_product);
    expect(response.status).toBe(401);
  });
});

describe("GET /products/:id", () => {
  it("should return a 200 response when all is well", async () => {
    const route = "/products/" + dummy_product.id.toString();
    const response = await request.get(route);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummy_product);
  });
  it("should return an empty response body when id doesnt exist", async () => {
    const response = await request.get("/products/0");
    expect(response.status).toBe(200);
    expect(response.body).toBeFalsy();
  });
});

afterAll(async () => {
  // Delete the dummy product from the products table to not mess up other tests
  await product_store.delete(dummy_product.id.toString());
  // await user_store.delete(dummy_user.id.toString());
});
