import request from "supertest";
import app from "../app/app";
import User from "../app/user/User";
import sequelize from "../app/config/database";

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe("User Registration", () => {
  test("returns 201 OK when signup request is valid", (done) => {
    request(app)
      .post("/api/v1/user")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssword",
      })
      .then((response) => {
        expect(response.status).toBe(201);
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

  test("saves the user to database", (done) => {
    request(app)
      .post("/api/v1/user")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssword",
      })
      .then(() => {
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        });
      });
  });

  test("saves the username and email to database", (done) => {
    request(app)
      .post("/api/v1/user")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssword",
      })
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.username).toBe("user1");
          expect(savedUser.email).toBe("user1@email.com");
          done();
        });
      });
  });
});
