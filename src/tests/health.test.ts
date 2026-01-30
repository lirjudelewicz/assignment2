import request from "supertest";
import app from "../index";

describe("Health", () => {
  it("should return 200 on /api-docs/", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.status).toBe(200);
  });
});
