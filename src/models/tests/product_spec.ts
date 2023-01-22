import { ProductStore, Product } from "../product";

const store = new ProductStore();

let dummy_product: Product = {
  id: 0,
  name: "Pc",
  price: 2500,
};

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
    const result = await store.create(dummy_product);
    dummy_product.id = result.id;
    expect(result).toEqual(dummy_product);
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result).toContain(dummy_product);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show(dummy_product.id.toString());
    expect(result).toEqual(dummy_product);
  });

  it("delete method should delete the correct product", async () => {
    const result = await store.delete(dummy_product.id.toString());
    expect(result).toEqual(dummy_product);
  });
});
