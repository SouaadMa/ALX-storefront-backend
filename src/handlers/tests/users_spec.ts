import supertest from "supertest";
import { UserStore, User } from "../../models/user";
import app from "../../server";

const request = supertest(app);
const user_store = new UserStore();
let create_user: User = {
  id: 0,
  firstname: "souaad",
  lastname: "souaad",
  password: "souaad",
};

let dummy_user = {
  id: 0,
  firstname: "souaad",
  lastname: "souaad",
};

let token = "";

describe("POST /users == create new user", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request.post("/users").send(create_user);
    dummy_user.id = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummy_user);
  });
  it("should return a 400 response when params (firstname || lastname || password ) are missing", async () => {
    const response = await request.post("/users").send({});
    expect(response.status).toBe(400);
  });
});

describe("POST /users/login == user authentication", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await await request.post("/users/login").send(create_user);
    dummy_user.id = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    token = response.body.token;
  });
  it("should return a 400 response when params (firstname || lastname || password ) are missing", async () => {
    const response = await request.post("/users/login").send({});
    expect(response.status).toBe(400);
  });
});

describe("GET /users == index", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it("should return a 401 response body when token isnt provided", async () => {
    const response = await request.get("/users");
    expect(response.status).toBe(401);
  });
});

describe("GET /users/:id", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request
      .get(`/users/${dummy_user.id.toString()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummy_user);
  });
  it("should return an empty response body when id doesnt exist", async () => {
    const response = await request
      .get("/users/0")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeFalsy();
  });
  it("should return a 401 response body when token isnt provided", async () => {
    const response = await request.get("/users/0");
    expect(response.status).toBe(401);
  });
});
afterAll(async () => {
  // Delete the dummy user from the users table to not mess up other tests
  // await user_store.delete(dummy_user.id.toString());
});
