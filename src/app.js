import express from "express";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import { mountSwagger } from "./swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(messageRoutes);
app.use(managerRoutes);
mountSwagger(app);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("[HTTP_ERROR]", err);
  res.status(500).json({ status: "Erro", message: "Erro interno." });
});

export default app;
