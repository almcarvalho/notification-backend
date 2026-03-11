const REQUIRED_BY_TYPE = {
  discord: ["discordWebhook"],
  email: ["email"],
  whatsapp: ["phone"],
  sms: ["phone"],
  phoneCall: ["phone"],
};

const ALLOWED_TYPES = new Set(Object.keys(REQUIRED_BY_TYPE));

export function validateMessagePayload(payload) {
  const errors = [];

  if (!payload?.title || typeof payload.title !== "string") {
    errors.push("Campo 'title' é obrigatório.");
  }

  if (!payload?.text || typeof payload.text !== "string") {
    errors.push("Campo 'text' é obrigatório.");
  }

  if (!payload?.type || !ALLOWED_TYPES.has(payload.type)) {
    errors.push("Campo 'type' inválido. Tipos: discord, email, whatsapp, sms, phoneCall.");
  }

  if (payload?.type && REQUIRED_BY_TYPE[payload.type]) {
    for (const field of REQUIRED_BY_TYPE[payload.type]) {
      if (!payload[field]) {
        errors.push(`Campo '${field}' é obrigatório para o tipo '${payload.type}'.`);
      }
    }
  }

  return errors;
}
