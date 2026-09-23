export type User = {
  id: string;
  email: string;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  email: string;
  password: string;
  name: string;
};
