import request from "supertest";
import app from "../src/app";
import User from "../src/user/User";
import sequelize from "../src/config/database";
import {
  UserAttributes,
  AuthResponse,
  ValidationRes,
} from "../src/models/userModels";

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

type NullableUser = Partial<UserAttributes>;

const validUser = {
  username: "user1",
  email: "user1@gmail.com",
  password: "PAssword",
};

describe("User Registration", () => {
  const postUser = (user = validUser as NullableUser) => {
    return request(app).post("/api/1.0/users").send(user);
  };

  it("returns 200 OK when signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  it("returns success message when signup request is valid", async () => {
    const response = await postUser();
    expect(response.body as AuthResponse).toEqual({ message: "user created" });
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

  it.each`
    field         | expected
    ${"username"} | ${"username cannot be empty"}
    ${"email"}    | ${"email cannot be empty"}
    ${"password"} | ${"password cannot be empty"}
  `("returns $expected when $field is null", async ({ field, expected }) => {
    const user = { ...validUser } as NullableUser;
    user[field] = null;
    const response = await postUser(user);
    const body = response.body as ValidationRes;
    expect(body.validationErrors[field]).toBe(expected);
  });

  it.each([["username"], ["email"], ["password"]])(
    "returns 400 when %s is null",
    async (field) => {
      const user = { ...validUser } as NullableUser;
      user[field] = null;
      const response = await postUser(user);
      expect(response.status).toBe(400);
    }
  );

  it("returns validationErrors field in response body when validation error occurs", async () => {
    const response = await postUser({
      username: null,
      email: "test@test.com",
      password: "PAssword",
    });
    const body = response.body as ValidationRes;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("returns errors for both when username and email is null", async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: "PAssword",
    });
    const body = response.body as ValidationRes;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });

  it("returns size validation error when username is less than 4 characters", async () => {
    const response = await postUser({
      username: "use",
      email: "test@test.com",
      password: "PAssword",
    });
    const body = response.body as ValidationRes;
    expect(body.validationErrors.username).toBe(
      "username must have min 4 and max 32 characters"
    );
  });
});
