import supertest from "supertest";
import { Product, ProductStore } from "../../models/product";
import app from "../../server";

const request = supertest(app);
const product_store = new ProductStore();
let dummy_product: Product = {
  id: 0,
  name: "Pc",
  price: 10,
};

describe("GET /products == index", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
  });
});

describe("POST /products == create new product", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request.post("/products").send(dummy_product);
    dummy_product.id = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummy_product);
  });
  it("should return a 400 response when params (name & price) are missing", async () => {
    const response = await request.post("/products").send({});
    expect(response.status).toBe(400);
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
});
