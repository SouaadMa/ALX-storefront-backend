import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("GET /five-most-expensive", () => {
  it("should return a 200 response when all is well", async () => {
    const response = await request.get("/five-most-expensive");
    expect(response.status).toBe(200);
  });
});
