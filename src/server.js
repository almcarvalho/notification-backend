import app from "./app.js";
import env from "./config/env.js";
import prisma from "./config/prisma.js";
import { startProcessingJob } from "./jobs/processingJob.js";
import { startDailySummaryJob } from "./jobs/dailySummaryJob.js";

async function bootstrap() {
  try {
    await prisma.$connect();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Servidor iniciado na porta ${env.port}`);
      // eslint-disable-next-line no-console
      console.log(`Swagger em http://localhost:${env.port}/docs`);
    });

    startProcessingJob();
    startDailySummaryJob();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Falha ao iniciar aplicação", error);
    process.exit(1);
  }
}

bootstrap();
