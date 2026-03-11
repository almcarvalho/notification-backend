import crypto from "node:crypto";
import prisma from "../config/prisma.js";
import { hashApiKey } from "../utils/crypto.js";

export async function createApiKey({ name, limitPerMinute }) {
  const rawKey = crypto.randomUUID();
  const keyHash = await hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      keyHash,
      limitPerMinute,
    },
    select: {
      id: true,
      name: true,
      limitPerMinute: true,
      totalMessages: true,
      createdAt: true,
    },
  });

  return {
    ...apiKey,
    key: rawKey,
  };
}

export async function removeApiKey(id) {
  return prisma.apiKey.delete({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });
}
