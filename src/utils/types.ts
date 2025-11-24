// ------------------- AUTH CONTROLLER START -------------------------
export type TRegister = {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};

export type TLogin = {
  identifier: string;
  password: string;
};

// ------------------- AUTH CONTROLLER END -------------------------

export type TGetProducts = {
  identifier: string;
};
