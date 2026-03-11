import { Router } from "express";
import { authApiKey } from "../middleware/authApiKey.js";
import { validateMessagePayload } from "../utils/validators.js";
import { createMessage, getMessageById } from "../services/messageService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Recebe uma mensagem para processamento assíncrono
 *     tags: [Messages]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMessageRequest'
 *     responses:
 *       202:
 *         description: Mensagem recebida e enfileirada
 *       400:
 *         description: Payload inválido
 *       401:
 *         description: API key inválida
 *       429:
 *         description: Limite excedido
 */
router.post("/message", authApiKey, asyncHandler(async (req, res) => {
  const errors = validateMessagePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ status: "Erro", errors });
  }

  const message = await createMessage(req.body, req.apiKey);

  return res.status(202).json({
    status: "Sucesso",
    message: "Mensagem recebida e enviada para fila de processamento.",
    id: message.id,
  });
}));

/**
 * @swagger
 * /message:
 *   get:
 *     summary: Consulta status de mensagem por id
 *     tags: [Messages]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados da mensagem
 *       401:
 *         description: API key inválida
 *       404:
 *         description: Mensagem não encontrada
 */
router.get("/message", authApiKey, asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ status: "Erro", message: "Parâmetro 'id' é obrigatório." });
  }

  const message = await getMessageById(id);

  if (!message) {
    return res.status(404).json({ status: "Erro", message: "Mensagem não encontrada." });
  }

  return res.status(200).json(message);
}));

export default router;
