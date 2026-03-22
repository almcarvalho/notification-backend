import cron from "node-cron";
import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";
import prisma from "../config/prisma.js";
import env from "../config/env.js";
import { sendWhatsapp } from "../services/senders/whatsappSender.js";

dayjs.locale("pt-br");

export function startDailySummaryJob() {
  cron.schedule(
    env.cronDailySummary,
    async () => {
      const now = dayjs();
      const yesterdayStart = now.subtract(1, "day").startOf("day").toDate();
      const yesterdayEnd = now.subtract(1, "day").endOf("day").toDate();

      const [total, success, failure, withSendDate] = await Promise.all([
        prisma.message.count({
          where: {
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.message.count({
          where: {
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
            status: "sent",
          },
        }),
        prisma.message.count({
          where: {
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
            status: "failure",
          },
        }),
        prisma.message.count({
          where: {
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
            sendDate: { not: null },
          },
        }),
      ]);

      const dayLabel = dayjs(yesterdayStart).format("dddd DD/MM");
      const body = `Processamentos de ${dayLabel}. Mensagens enviadas: ${total}. Sucesso: ${success}. Erro: ${failure}. Com data de envio: ${withSendDate}.`;

      if (!env.adminWhatsappTo) {
        // eslint-disable-next-line no-console
        console.warn("[JOB] ADMIN_WHATSAPP_TO não configurado. Resumo diário não enviado.");
        return;
      }

      try {
        await sendWhatsapp({
          title: "Resumo diário",
          text: body,
          phone: env.adminWhatsappTo,
        });
        // eslint-disable-next-line no-console
        console.log("[JOB] resumo diário enviado.");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[JOB] erro ao enviar resumo diário", error.message);
      }
    },
    { timezone: env.jobTimezone },
  );

  // eslint-disable-next-line no-console
  console.log(`[JOB] resumo diário agendado com expressão: ${env.cronDailySummary}`);
}
