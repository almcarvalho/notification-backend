import cron from "node-cron";
import env from "../config/env.js";
import { processPendingMessages } from "../services/messageService.js";

export function startProcessingJob() {
  const expression = `*/${env.processingIntervalMinutes} * * * *`;

  cron.schedule(
    expression,
    async () => {
      try {
        const processed = await processPendingMessages();
        // eslint-disable-next-line no-console
        console.log(`[JOB] processamento executado. mensagens_lidas=${processed}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[JOB] erro no processamento", error.message);
      }
    },
    { timezone: env.jobTimezone },
  );

  // eslint-disable-next-line no-console
  console.log(`[JOB] processamento agendado com expressão: ${expression}`);
}
