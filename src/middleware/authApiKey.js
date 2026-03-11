import prisma from "../config/prisma.js";
import env from "../config/env.js";
import { compareApiKey } from "../utils/crypto.js";

export async function authApiKey(req, res, next) {
  const keyHeaderName = env.apiKeyHeader.toLowerCase();
  const rawKey = req.headers[keyHeaderName];

  if (!rawKey || typeof rawKey !== "string") {
    return res.status(401).json({ status: "Erro", message: "API key ausente." });
  }

  const apiKeys = await prisma.apiKey.findMany();

  let matchedKey = null;
  for (const apiKey of apiKeys) {
    const isMatch = await compareApiKey(rawKey, apiKey.keyHash);
    if (isMatch) {
      matchedKey = apiKey;
      break;
    }
  }

  if (!matchedKey) {
    return res.status(401).json({ status: "Erro", message: "Falha de autenticação da API key." });
  }

  const now = new Date();
  const minuteAgo = new Date(now.getTime() - 60 * 1000);

  const sentInLastMinute = await prisma.message.count({
    where: {
      apiKeyId: matchedKey.id,
      createdAt: { gte: minuteAgo, lte: now },
    },
  });

  if (sentInLastMinute >= matchedKey.limitPerMinute) {
    return res.status(429).json({ status: "Erro", message: "Limite de mensagens por minuto excedido." });
  }

  req.apiKey = matchedKey;
  return next();
}
