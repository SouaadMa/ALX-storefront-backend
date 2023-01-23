import supertest from "supertest";
import { Product } from "../../models/product";
import { User } from "../../models/user";
import { Order, OrderStore } from "../../models/order";
import app from "../../server";

const request = supertest(app);
const dummy_product: Product = {
  id: 0,
  name: "Pc",
  price: 10,
};

const dummy_user: User = {
  id: 0,
  firstname: "souaad",
  lastname: "souaad",
  password: "souaad",
};

const order_store = new OrderStore();
const dummy_order: Order = {
  id: 0,
  user_id: 0,
  status: "",
};

let token = "";

beforeAll(async () => {
  await request.post("/users").send(dummy_user); // Create a dummy user
  const response2 = await request.post("/users/login").send(dummy_user); // Authenticate as dummy user
  dummy_user.id = response2.body.id;
  expect(response2.status).toBe(200);
  expect(dummy_user.id).toBeTruthy();
  token = response2.body.token;

  const response3 = await request
    .post("/products")
    .send(dummy_product)
    .set("Authorization", `Bearer ${token}`); // Create a dummy product
  dummy_product.id = response3.body.id;
  expect(response3.status).toBe(200);
  expect(dummy_product.id).toBeTruthy();
});

describe("GET /orders == index", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request.get("/orders");
    expect(response.status).toBe(200);
  });
});

describe("POST /orders == create new order", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request
      .post("/orders")
      .send({ userid: dummy_user.id })
      .set("Authorization", `Bearer ${token}`);
    dummy_order.id = response.body.id;
    dummy_order.user_id = response.body.user_id;
    dummy_order.status = response.body.status;
    expect(response.status).toBe(200);
    expect(dummy_order.id).not.toBe(0);
    expect(dummy_order.user_id).not.toBe(0);
    expect(dummy_order.status).not.toBe("");
  });
  it("should return a 400 response when params (userid) are missing", async () => {
    const response = await request
      .post("/orders")
      .send({})
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
  it("should return a 401 response body when token isnt provided", async () => {
    const response = await request
      .post("/orders")
      .send({ userid: dummy_user.id });
    expect(response.status).toBe(401);
  });
});

describe("POST /orders/:id/products == add product to order", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request
      .post("/orders/" + dummy_order.id + "/products")
      .send({ productid: dummy_product.id, quantity: 1 })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it("should return a 400 response when params (productid and quantity) are missing", async () => {
    const response = await request
      .post("/orders/" + dummy_order.id + "/products")
      .send({})
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
  it("should return a 401 response body when token isnt provided", async () => {
    const response = await request
      .post("/orders/" + dummy_order.id + "/products")
      .send({ productid: dummy_product.id, quantity: 1 });
    expect(response.status).toBe(401);
  });
});

describe("GET /orders/:userid == Current order by userid", () => {
  it("should return a 200 response when all is well", async () => {
    const route = "/orders/" + dummy_user.id.toString();
    const response = await request
      .get(route)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.product_id).toEqual(dummy_product.id);
    expect(response.body.name).toEqual(dummy_product.name);
    expect(response.body.price).toEqual(dummy_product.price);
  });
  it("should return a 401 response body when token isnt provided", async () => {
    const route = "/orders/" + dummy_user.id.toString();
    const response = await request.get(route);
    expect(response.status).toBe(401);
  });
});

describe("GET /orders/complete/:userid == Closed orders by userid", () => {
  beforeAll(async () => {
    await order_store.closeOrder(dummy_order.id);
  });
  it("should return a 200 response when all is well", async () => {
    const route = "/orders/complete/" + dummy_user.id.toString();
    const response = await request
      .get(route)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body[0].product_id).toEqual(dummy_product.id);
    expect(response.body[0].status).toEqual("closed");
  });
  it("should return a 401 response body when token isnt provided", async () => {
    const route = "/orders/complete/" + dummy_user.id.toString();
    const response = await request.get(route);
    expect(response.status).toBe(401);
  });
});

afterAll(async () => {
  // Delete dummies
  // await order_store.delete(dummy_order.id);
  // await product_store.delete(dummy_product.id.toString());
  // await user_store.delete(dummy_user.id.toString());
});
