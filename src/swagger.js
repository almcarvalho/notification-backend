import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notification Backend API",
      version: "1.0.0",
      description: "API para enfileirar e processar notificações assíncronas.",
    },
    components: {
      schemas: {
        CreateMessageRequest: {
          type: "object",
          required: ["title", "text", "type"],
          properties: {
            title: { type: "string", example: "Aviso" },
            text: { type: "string", example: "Seu pedido foi aprovado." },
            type: {
              type: "string",
              enum: ["discord", "email", "whatsapp", "sms", "phoneCall"],
              example: "whatsapp",
            },
            phone: { type: "string", example: "whatsapp:+5511999999999" },
            email: { type: "string", example: "user@email.com" },
            discordWebhook: { type: "string", example: "https://discord.com/api/webhooks/..." },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

export function mountSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}
