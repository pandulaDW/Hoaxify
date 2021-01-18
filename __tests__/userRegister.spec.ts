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

const postUser = (user = validUser as NullableUser) => {
  return request(app)
    .post("/api/1.0/users")
    .set("Accept-Language", "tr")
    .send(user);
};

describe("User Registration", () => {
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

  const fieldNull = (field: string) => `${field} cannot be empty`;
  const usernameSize = `username must have min 4 and max 32 characters`;
  const emailInvalid = `email is not valid`;
  const passwordNotEnoughCh = `password must be at least 6 characters`;
  const passwordNotMatching = `password must have at least 1 uppercase, 1 lowercase and 1 number`;
  const emailInUse = `email in use`;

  it.each`
    field         | value              | expected
    ${"username"} | ${null}            | ${fieldNull("username")}
    ${"username"} | ${"usr"}           | ${usernameSize}
    ${"username"} | ${"a".repeat(33)}  | ${usernameSize}
    ${"email"}    | ${null}            | ${fieldNull("email")}
    ${"email"}    | ${"mail.com"}      | ${emailInvalid}
    ${"email"}    | ${"user.mail.com"} | ${emailInvalid}
    ${"email"}    | ${"user@mail"}     | ${emailInvalid}
    ${"password"} | ${null}            | ${fieldNull("password")}
    ${"password"} | ${"P4ssw"}         | ${passwordNotEnoughCh}
    ${"password"} | ${"alllowercase"}  | ${passwordNotMatching}
    ${"password"} | ${"1234334454565"} | ${passwordNotMatching}
    ${"password"} | ${"lowerAndUpper"} | ${passwordNotMatching}
    ${"password"} | ${"lower44300"}    | ${passwordNotMatching}
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

  it(`returns ${emailInUse} when same email is already in use`, async () => {
    await User.create({ ...validUser });
    const response = await postUser();
    const body = response.body as ValidationRes;
    expect(body.validationErrors.email).toBe(emailInUse);
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

describe("Internationalization", () => {
  const fieldNull = (field: string) => `${field} adı boş olamaz`;
  const usernameSize = `En az 4 en fazla 32 karakter olmalı`;
  const emailInvalid = `E-Posta geçerli değil`;
  const passwordNotEnoughCh = `Şifre en az 6 karakter olmalı`;
  const passwordNotMatching = `Şifrede en az 1 büyük, 1 küçük harf ve 1 sayı bulunmalıdır`;
  const emailInUse = "Bu E-Posta kullanılıyor";

  it.each`
    field         | value              | expected
    ${"username"} | ${null}            | ${fieldNull("username")}
    ${"username"} | ${"usr"}           | ${usernameSize}
    ${"username"} | ${"a".repeat(33)}  | ${usernameSize}
    ${"email"}    | ${null}            | ${fieldNull("email")}
    ${"email"}    | ${"mail.com"}      | ${emailInvalid}
    ${"email"}    | ${"user.mail.com"} | ${emailInvalid}
    ${"email"}    | ${"user@mail"}     | ${emailInvalid}
    ${"password"} | ${null}            | ${fieldNull("password")}
    ${"password"} | ${"P4ssw"}         | ${passwordNotEnoughCh}
    ${"password"} | ${"alllowercase"}  | ${passwordNotMatching}
    ${"password"} | ${"1234334454565"} | ${passwordNotMatching}
    ${"password"} | ${"lowerAndUpper"} | ${passwordNotMatching}
    ${"password"} | ${"lower44300"}    | ${passwordNotMatching}
  `(
    "returns $expected when $field is $value when language is set as turkish",
    async ({ field, value, expected }) => {
      const user = { ...validUser } as NullableUser;
      user[field as string] = value as null | string;
      const response = await postUser(user);
      const body = response.body as ValidationRes;
      expect(body.validationErrors[field]).toBe(expected);
    }
  );

  it(`returns ${emailInUse} when same email is already in use when language is set as turkish`, async () => {
    await User.create({ ...validUser });
    const response = await postUser();
    const body = response.body as ValidationRes;
    expect(body.validationErrors.email).toBe(emailInUse);
  });
});
