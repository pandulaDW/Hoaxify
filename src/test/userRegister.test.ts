import request from "supertest";
import app from "../app/app";

describe("User Registration", () => {
  test("returns 200 OK when signup request is valid", (done) => {
    request(app)
      .post("/api/v1/user")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssword",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });

  test("returns success message when signup request is valid", (done) => {
    request(app)
      .post("/api/v1/user")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssword",
      })
      .then((response) => {
        expect(response.body.message).toBe("User created");
        done();
      });
  });
});
