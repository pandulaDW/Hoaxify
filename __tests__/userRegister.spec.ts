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

const validUser = {
  username: "user1",
  email: "user1@gmail.com",
  password: "PAssword",
};

describe("User Registration", () => {
  const postUser = (user = validUser) => {
    return request(app).post("/api/1.0/users").send(user);
  };

  it("returns 200 OK when signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it("returns success message when signup request is valid", async () => {
    const response = await postUser();
    expect(response.body).toEqual({ message: "user created" });
  });

  it("saves the user to database", async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it("saves the username and email to database", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe("user1");
    expect(savedUser.email).toBe("user1@gmail.com");
  });

  it("hashes the password in database", async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe("PAssword");
  });

  it("returns 400 when username is null", async () => {
    const response = await postUser({
      username: null,
      email: "test@test.com",
      password: "PAssword",
    });
    expect(response.status).toBe(400);
  });

  it("returns validationErrors field in response body when validation error occurs", async () => {
    const response = await postUser({
      username: null,
      email: "test@test.com",
      password: "PAssword",
    });
    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("returns username cannot be null when username is null", async () => {
    const response = await postUser({
      username: null,
      email: "test@test.com",
      password: "PAssword",
    });
    const body = response.body;
    expect(body.validationErrors.username).toBe("username cannot be null");
  });
});
