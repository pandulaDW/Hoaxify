import request from "supertest";
import app from "../src/app";
import User from "../src/user/User";
import sequelize from "../src/config/database";

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe("User Registration", () => {
  it("returns 200 OK when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@gmail.com",
        password: "PAssword",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });

  it("returns success message when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@gmail.com",
        password: "PAssword",
      })
      .then((response) => {
        expect(response.body).toEqual({ message: "user created" });
        done();
      });
  });

  it("saves the user to database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@gmail.com",
        password: "PAssword",
      })
      .then(() => {
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        });
      });
  });

  it("saves the username and email to database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@gmail.com",
        password: "PAssword",
      })
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser: any = userList[0];
          expect(savedUser.username).toBe("user1");
          expect(savedUser.email).toBe("user1@gmail.com");
          done();
        });
      });
  });
});
