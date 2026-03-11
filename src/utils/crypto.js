import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashApiKey(rawKey) {
  return bcrypt.hash(rawKey, SALT_ROUNDS);
}

export async function compareApiKey(rawKey, hash) {
  return bcrypt.compare(rawKey, hash);
}
