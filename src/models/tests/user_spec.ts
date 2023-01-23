import { UserStore, User } from "../user";

const store = new UserStore();

let create_user: User = {
  id: 0,
  firstname: "souaad",
  lastname: "bhd",
  password: "souaad",
};

let dummy_user = {
  id: 0,
  firstname: "souaad",
  lastname: "bhd",
};

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
    const result = await store.create(create_user);
    if (result) dummy_user.id = result.id;
    expect(result).toEqual(dummy_user);
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result).toContain(dummy_user);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(dummy_user.id);
    expect(result).toEqual(dummy_user);
  });

  it("authenticate method should return the correct user", async () => {
    const result = await store.authenticate("souaad", "bhd", "souaad");
    expect(result).toEqual(dummy_user);
  });
});
