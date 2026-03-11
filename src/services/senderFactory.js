import { sendDiscord } from "./senders/discordSender.js";
import { sendEmail } from "./senders/emailSender.js";
import { sendPhoneCall, sendSms, sendWhatsapp } from "./senders/twilioSender.js";

const senders = {
  discord: sendDiscord,
  email: sendEmail,
  whatsapp: sendWhatsapp,
  sms: sendSms,
  phoneCall: sendPhoneCall,
};

export function getSenderByType(type) {
  const sender = senders[type];
  if (!sender) {
    throw new Error(`Tipo de envio não suportado: ${type}`);
  }

  return sender;
}
