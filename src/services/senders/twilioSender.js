import Twilio from "twilio";
import env from "../../config/env.js";

const canInitTwilio = env.twilio.accountSid && env.twilio.authToken;
const twilioClient = canInitTwilio
  ? Twilio(env.twilio.accountSid, env.twilio.authToken)
  : null;

function assertTwilio() {
  if (!twilioClient) {
    throw new Error("Twilio não configurado.");
  }
}

export async function sendWhatsapp(message) {
  assertTwilio();

  await twilioClient.messages.create({
    from: env.twilio.whatsappFrom,
    to: message.phone,
    body: `${message.title}\n\n${message.text}`,
  });
}

export async function sendSms(message) {
  assertTwilio();

  await twilioClient.messages.create({
    from: env.twilio.smsFrom,
    to: message.phone,
    body: `${message.title}\n\n${message.text}`,
  });
}

export async function sendPhoneCall(message) {
  assertTwilio();

  const safeText = `${message.title}. ${message.text}`.replace(/&/g, "and").replace(/</g, "").replace(/>/g, "");

  await twilioClient.calls.create({
    from: env.twilio.callFrom,
    to: message.phone,
    twiml: `<Response><Say language=\"pt-BR\">${safeText}</Say></Response>`,
  });
}
