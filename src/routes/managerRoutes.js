import { Router } from "express";
import { managerFlagGuard } from "../middleware/managerFlag.js";
import { createApiKey, removeApiKey } from "../services/apiKeyService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * /manager/key:
 *   post:
 *     summary: Cadastra uma nova API key
 *     description: |
 *       Cria uma chave de acesso para autenticação das rotas protegidas por API key.
 *       Esta rota só funciona quando a variável de ambiente `IS_MANAGER_ON=true`.
 *       Quando `IS_MANAGER_ON=false`, retorna `401`.
 *     tags: [Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, limit]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da integração/cliente dono da chave.
 *                 example: "cliente-a"
 *               limit:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantidade máxima de mensagens por minuto para essa key.
 *                 example: 10
 *           examples:
 *             default:
 *               summary: Exemplo de criação
 *               value:
 *                 name: "cliente-a"
 *                 limit: 10
 *     responses:
 *       201:
 *         description: API key criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Sucesso"
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "cliente-a"
 *                 limitPerMinute:
 *                   type: integer
 *                   example: 10
 *                 totalMessages:
 *                   type: integer
 *                   example: 0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 key:
 *                   type: string
 *                   description: Chave gerada (exibida apenas na criação).
 *                   example: "4b6eb0f2-0672-4b9a-b056-f0ffba8f1f7d"
 *       400:
 *         description: Dados inválidos no corpo da requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Erro"
 *                 message:
 *                   type: string
 *                   example: "Campo 'limit' deve ser inteiro maior que 0."
 *       401:
 *         description: Rota desabilitada por configuração (`IS_MANAGER_ON=false`)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Erro"
 *                 message:
 *                   type: string
 *                   example: "Não autorizado. IS_MANAGER_ON=false."
 */
router.post("/manager/key", managerFlagGuard, asyncHandler(async (req, res) => {
  const { name, limit } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ status: "Erro", message: "Campo 'name' é obrigatório." });
  }

  const limitPerMinute = Number(limit);
  if (!Number.isInteger(limitPerMinute) || limitPerMinute <= 0) {
    return res.status(400).json({ status: "Erro", message: "Campo 'limit' deve ser inteiro maior que 0." });
  }

  const apiKey = await createApiKey({ name, limitPerMinute });
  return res.status(201).json({ status: "Sucesso", ...apiKey });
}));

/**
 * @swagger
 * /manager/key/{id}:
 *   delete:
 *     summary: Remove API key por id (habilitado por IS_MANAGER_ON=true)
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: API key removida
 *       401:
 *         description: Não autorizado
 */
router.delete("/manager/key/:id", managerFlagGuard, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ status: "Erro", message: "Id inválido." });
  }

  try {
    const removed = await removeApiKey(id);
    return res.status(200).json({ status: "Sucesso", removed });
  } catch {
    return res.status(404).json({ status: "Erro", message: "API key não encontrada." });
  }
}));

export default router;
