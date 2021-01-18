import request from "supertest";
import app from "../src/app";
import User from "../src/user/User";
import sequelize from "../src/config/database";
import { AuthResponse, ValidationRes } from "../src/models/userModels";

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

type NullableUser = {
  [key: string]: string | null;
};

const validUser = {
  username: "user1",
  email: "user1@gmail.com",
  password: "P4ssword",
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
    field         | value              | expected
    ${"username"} | ${null}            | ${"username cannot be empty"}
    ${"username"} | ${"usr"}           | ${"username must have min 4 and max 32 characters"}
    ${"username"} | ${"a".repeat(33)}  | ${"username must have min 4 and max 32 characters"}
    ${"email"}    | ${null}            | ${"email cannot be empty"}
    ${"email"}    | ${"mail.com"}      | ${"email is not valid"}
    ${"email"}    | ${"user.mail.com"} | ${"email is not valid"}
    ${"email"}    | ${"user@mail"}     | ${"email is not valid"}
    ${"password"} | ${null}            | ${"password cannot be empty"}
    ${"password"} | ${"P4ssw"}         | ${"password must be at least 6 characters"}
    ${"password"} | ${"alllowercase"}  | ${"password must have at least 1 uppercase, 1 lowercase and 1 number"}
    ${"password"} | ${"1234334454565"} | ${"password must have at least 1 uppercase, 1 lowercase and 1 number"}
    ${"password"} | ${"lowerAndUpper"} | ${"password must have at least 1 uppercase, 1 lowercase and 1 number"}
    ${"password"} | ${"lower44300"}    | ${"password must have at least 1 uppercase, 1 lowercase and 1 number"}
  `(
    "returns $expected when $field is $value",
    async ({ field, value, expected }) => {
      const user = { ...validUser } as NullableUser;
      user[field as string] = value as null | string;
      const response = await postUser(user);
      const body = response.body as ValidationRes;
      expect(body.validationErrors[field]).toBe(expected);
    }
  );

  it.each([["username"], ["email"], ["password"]])(
    "returns 400 when %s is null",
    async (field) => {
      const user = { ...validUser } as NullableUser;
      user[field as string] = null;
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
    expect(Object.keys(body.validationErrors)).toEqual(
      expect.arrayContaining(["username", "email"])
    );
  });

  it("returns email in use when same email is already in use", async () => {
    await User.create({ ...validUser });
    const response = await postUser();
    const body = response.body as ValidationRes;
    expect(body.validationErrors.email).toBe("email in use");
  });

  it("returns errors for both username is null and email in use", async () => {
    await User.create({ ...validUser });
    const response = await postUser({
      username: null,
      email: validUser.email,
      password: "P4ssword",
    });
    const body = response.body as ValidationRes;
    expect(Object.keys(body.validationErrors)).toEqual(
      expect.arrayContaining(["username", "email"])
    );
  });
});
