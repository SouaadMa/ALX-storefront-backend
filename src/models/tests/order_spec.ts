import { OrderStore } from "../order";
import { UserStore } from "../user";

const user_store = new UserStore();
let dummy_user = {
  id: 0,
  firstname: "souaad",
  lastname: "souaad",
  password: "souaad",
}

const store = new OrderStore();
let dummy_order = {
  id: 0,
  user_id: 1,
  status: "active",
}

describe("Order Model", () => {
  // Create dummy user record
  beforeAll(async () => {
    const result = await user_store.create(dummy_user);
    if(result) dummy_order.user_id = result.id;
    else console.log("Error creating dummy user record in Order Model test");
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("create method should add an order", async () => {
    const result = await store.create(dummy_order);
    dummy_order.id = result.id;
    expect(result).toEqual(dummy_order);
  });

  it("index method should return a list of orders", async () => {
    const result = await store.index();
    expect(result).toContain(dummy_order);
  });

  it("show method should return the correct order", async () => {
    const result = await store.show(dummy_order.id);
    expect(result).toEqual(dummy_order);
  });

  it("delete method should delete the correct order", async () => {
    const result = await store.delete(dummy_order.id);
    expect(result).toEqual(dummy_order);
  });

  // Delete dummy user record
  afterAll(async () => {
    await user_store.delete(dummy_order.user_id.toString());
  });
});
