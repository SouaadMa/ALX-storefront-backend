import { ProductStore } from "../product";

const store = new ProductStore();

describe("Product Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("create method should add a product", async () => {
    const result = await store.create({
      id: 0,
      name: "Pc",
      price: 2500,
    });
    expect(result).toEqual({
      id: 1,
      name: "Pc",
      price: 2500,
    });
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: "Pc",
        price: 2500,
      },
    ]);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show("1");
    expect(result).toEqual({
      id: 1,
      name: "Pc",
      price: 2500,
    });
  });

  it("delete method should delete the correct product", async () => {
    const result = await store.delete("1");
    expect(result).toEqual({
      id: 1,
      name: "Pc",
      price: 2500,
    });
  });
});
