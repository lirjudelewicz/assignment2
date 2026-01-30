import request from "supertest";
import app from "../index";

describe("Comments API", () => {
  it("GET /comment/post/:postId should not be 404 (route exists)", async () => {
    const fakePostId = "000000000000000000000000";
    const res = await request(app).get(`/comment/post/${fakePostId}`);

    // אם אין תגובות זה יכול להיות 200 עם מערך ריק, או 200 בכלל, או 500/400 תלוי מימוש
    // אבל העיקר שזה לא 404 של 'route לא קיים'
    expect(res.status).not.toBe(404);
  });

  it("POST /comment without token should return 401", async () => {
    const res = await request(app).post("/comment").send({
      postId: "000000000000000000000000",
      senderId: "000000000000000000000000",
      message: "Test comment",
    });

    expect(res.status).toBe(401);
  });
});
