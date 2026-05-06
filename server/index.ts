import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // 🔥 ROTA DE TESTE (ANTES DO FRONT)
  app.get("/api/debug/ranking", (_req, res) => {
    console.log("🔥 ROTA /api/debug/ranking FOI CHAMADA"); // 👈 DEBUG
    res.json({
      season: 2029,
      updatedAt: new Date().toISOString(),
      data: [
        {
          rank: 1,
          teamId: 4,
          name: "Flamengo",
          points: 52,
          status: "Classificado",
        },
        {
          rank: 2,
          teamId: 22,
          name: "Palmeiras",
          points: 49,
          status: "Pontuando na Libertadores 2026",
        },
        {
          rank: 3,
          teamId: 11,
          name: "Independiente Rivadavia",
          points: 31,
          status: "Não pontua em 2026",
        },
      ],
    });
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // 🛑 BLOQUEIA O FRONT DE PEGAR ROTAS /api
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API route not found" });
    }

    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);