export interface UserAttributes {
  username: string;
  email: string;
  password: string;
}

export type UserSignUpRequest = UserAttributes;

export interface ValidationObj {
  validationErrors: {
    [key: string]: string;
  };
}
