import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { createAuthRouter } from "./routes/authRoutes.js";
import { createProductRouter } from "./routes/productRoutes.js";
import { createReportRouter } from "./routes/reportRoutes.js";
import { createTransactionRouter } from "./routes/transactionRoutes.js";
import { buildContainer } from "../infrastructure/container.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  const container = buildContainer();

  console.log(" createApp DIPANGGIL");

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../../public")));

  app.use("/api/auth", createAuthRouter(container.authService));
  app.use("/api/products", createProductRouter(container.productService));
  app.use("/api/transactions", createTransactionRouter(container.transactionService));
  app.use("/api/reports", createReportRouter(container.reportService));

  app.use((error, _req, res, _next) => {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Terjadi kesalahan server"
    });
  });

  return app;
}