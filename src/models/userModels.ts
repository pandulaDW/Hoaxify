export interface UserAttributes {
  username: string;
  email: string;
  password: string;
}

export type UserSignUpRequest = UserAttributes;

export interface AuthResponse {
  message: string;
}

export interface ValidationRes {
  validationErrors: {
    [key: string]: string;
  };
}
