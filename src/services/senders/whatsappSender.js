import axios from "axios";
import env from "../../config/env.js";

function assertWhatsappApi() {
  if (!env.whatsappApi.url || !env.whatsappApi.apiKey) {
    throw new Error("API de WhatsApp não configurada.");
  }
}

function normalizeWhatsappNumber(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function buildWhatsappText(message) {
  return [message.title, message.text].filter(Boolean).join("\n\n");
}

export async function sendWhatsapp(message) {
  assertWhatsappApi();

  const numero = normalizeWhatsappNumber(message.phone);

  if (!numero) {
    throw new Error("Número de WhatsApp inválido.");
  }

  await axios.post(
    env.whatsappApi.url,
    {
      numero,
      texto: buildWhatsappText(message),
    },
    {
      headers: {
        accept: "*/*",
        "x-api-key": env.whatsappApi.apiKey,
        "Content-Type": "application/json",
      },
    },
  );
}
