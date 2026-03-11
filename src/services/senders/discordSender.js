import axios from "axios";

export async function sendDiscord(message) {
  await axios.post(message.discordWebhook, {
    content: `**${message.title}**\n${message.text}`,
  });
}
