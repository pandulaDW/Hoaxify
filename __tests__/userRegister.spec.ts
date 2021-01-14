import request from "supertest";
import app from "../src/app";

it("returns 200 OK when signup request is valid", () => {
  request(app)
    .post("/api/1.0/users")
    .send({
      username: "user1",
      email: "user1@gmail.com",
      password: "PAssword",
    })
    .expect(200);
});
