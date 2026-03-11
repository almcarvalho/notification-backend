import { Resend } from "resend";
import env from "../../config/env.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export async function sendEmail(message) {
  if (!resend) {
    throw new Error("Resend não configurado.");
  }

  await resend.emails.send({
    from: env.emailFrom,
    to: message.email,
    subject: message.title,
    text: message.text,
  });
}
