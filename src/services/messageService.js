import prisma from "../config/prisma.js";
import { getSenderByType } from "./senderFactory.js";

const PROCESS_BATCH_SIZE = 50;

export async function createMessage(data, apiKey) {
  const message = await prisma.message.create({
    data: {
      title: data.title,
      text: data.text,
      type: data.type,
      phone: data.phone || null,
      email: data.email || null,
      discordWebhook: data.discordWebhook || null,
      apiKeyId: apiKey.id,
      status: "pending",
    },
  });

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: {
      lastSend: new Date(),
      totalMessages: { increment: 1 },
    },
  });

  return message;
}

export async function getMessageById(id) {
  return prisma.message.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      type: true,
      sendDate: true,
    },
  });
}

export async function processPendingMessages() {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ status: "pending" }, { status: "failure" }],
    },
    orderBy: { createdAt: "asc" },
    take: PROCESS_BATCH_SIZE,
  });

  for (const message of messages) {
    try {
      const sender = getSenderByType(message.type);
      await sender(message);

      await prisma.message.update({
        where: { id: message.id },
        data: {
          status: "sent",
          sendDate: new Date(),
        },
      });
    } catch (error) {
      await prisma.message.update({
        where: { id: message.id },
        data: {
          status: "failure",
        },
      });

      // eslint-disable-next-line no-console
      console.error(`[PROCESSING_ERROR] messageId=${message.id}`, error.message);
    }
  }

  return messages.length;
}
