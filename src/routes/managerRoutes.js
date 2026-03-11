import { Router } from "express";
import { managerFlagGuard } from "../middleware/managerFlag.js";
import { createApiKey, removeApiKey } from "../services/apiKeyService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * /manager/key:
 *   post:
 *     summary: Cadastra nova API key (habilitado por IS_MANAGER_ON=true)
 *     tags: [Manager]
 *     responses:
 *       201:
 *         description: API key criada
 *       401:
 *         description: Não autorizado
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
