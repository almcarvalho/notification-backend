import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  isManagerOn: String(process.env.IS_MANAGER_ON).toLowerCase() === "true",
  apiKeyHeader: process.env.API_KEY_HEADER || "x-api-key",
  processingIntervalMinutes: Number(process.env.PROCESSING_INTERVAL_MINUTES || 2),
  cronDailySummary: process.env.CRON_DAILY_SUMMARY || "0 20 * * *",
  jobTimezone: process.env.JOB_TIMEZONE || "America/Sao_Paulo",

  whatsappApi: {
    url: process.env.WHATSAPP_API_URL,
    apiKey: process.env.WHATSAPP_API_KEY,
  },

  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  adminWhatsappTo: process.env.ADMIN_WHATSAPP_TO,
};

export default env;
