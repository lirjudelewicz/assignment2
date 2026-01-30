import request from "supertest";
import app from "../index";

describe("Posts API", () => {
  it("GET /post should return 200 (or 204 if empty)", async () => {
    const res = await request(app).get("/post");
    expect([200, 204]).toContain(res.status);
  });

  it("POST /post without token should return 401", async () => {
    const res = await request(app).post("/post").send({
      title: "Test post",
      content: "Hello",
    });
    expect(res.status).toBe(401);
  });
});
