import { UserStore } from "../user";

const store = new UserStore();

describe("User Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });

  it("create method should add a user", async () => {
    const result = await store.create({
      id: 0,
      firstName: "souaad",
      lastName: "souaad",
      password: "souaad",
    });
    expect(result).toEqual({
      id: 1,
      firstName: "souaad",
      lastName: "souaad",
    });
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        firstname: "souaad",
        lastname: "souaad",
      },
    ]);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      firstname: "souaad",
      lastname: "souaad",
    });
  });

  it("authenticate method should return the correct user", async () => {
    const result = await store.authenticate("souaad", "souaad", "souaad");
    expect(result).toEqual({
      id: 1,
      firstname: "souaad",
      lastname: "souaad",
    });
  });
});
