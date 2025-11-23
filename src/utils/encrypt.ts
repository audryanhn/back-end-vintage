import crypto from "crypto";
import { SECRET } from "./env";

export const encrypt = (password: string): string => {
  // CARA ENCRYPTINGNYA PAKE PBKDF2SYNC,parameternya diapalin
  const encrypted = crypto
    .pbkdf2Sync(password, SECRET, 1000, 64, "sha512")
    .toString("hex");
  return encrypted;
};
