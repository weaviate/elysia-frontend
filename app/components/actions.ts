"use server";

import { v5 as uuidv5 } from "uuid";

const seconds_since_midnight = () => {
  const now = new Date();
  const midnight = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
  return Math.floor((now.getTime() - midnight.getTime()) / 1000);
};

export const generateAuthKey = async () => {
  const seconds = String(seconds_since_midnight());
  const date = new Date().toISOString().split("T")[0];
  const hash_key = process.env.AUTH_KEY;
  const hash_string = `${date}-${seconds}`;

  if (!hash_key) {
    return "";
  }

  const auth_key = uuidv5(hash_string, hash_key);

  return auth_key;
};
