import request from "supertest";
import app from "../app/app";

describe("sign up", () => {
  test("returns 200 OK when signup request is valid", () => {
    request(app)
      .post("/api/v1/user")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssword",
      })
      .expect(200);
  });
});
