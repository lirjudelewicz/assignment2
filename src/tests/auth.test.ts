import request from "supertest";
import app from "../index";

describe("Auth API", () => {
  it(
    "should register and then login successfully",
    async () => {
      const random = Math.floor(Math.random() * 100000);

      const email = `user${random}@test.com`;
      const username = `user${random}`;
      const password = "123456";

      const reg = await request(app)
        .post("/auth/register")
        .send({ email, password, username });

      expect(reg.status).toBe(201);

      const login = await request(app)
        .post("/auth/login")
        .send({ email, password });

      expect(login.status).toBe(200);
      expect(login.body).toHaveProperty("email", email);
    },
    15000
  );
});
