import { OrderStore } from "../order";
import { UserStore } from "../user";

const store = new OrderStore();
const user_store = new UserStore();

describe("Order Model", () => {
  // Create dummy user record
  beforeAll(async () => {
    const result = await user_store.create({
      id: 0,
      firstname: "souaad",
      lastname: "souaad",
      password: "souaad",
    });
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
    const result = await store.create({
      id: 0,
      user_id: 1,
      status: "active",
    });
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: "active",
    });
  });

  it("index method should return a list of orders", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        user_id: 1,
        status: "active",
      },
    ]);
  });

  it("show method should return the correct order", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: "active",
    });
  });

  it("delete method should delete the correct order", async () => {
    const result = await store.delete(1);
    expect(result).toEqual({
      id: 1,
      user_id: 1,
      status: "active",
    });
  });

  // Delete dummy user record
  afterAll(async () => {
    await user_store.delete("1");
  });
});
