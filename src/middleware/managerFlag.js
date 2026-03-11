import env from "../config/env.js";

export function managerFlagGuard(req, res, next) {
  if (!env.isManagerOn) {
    return res.status(401).json({ status: "Erro", message: "Não autorizado. IS_MANAGER_ON=false." });
  }

  return next();
}
