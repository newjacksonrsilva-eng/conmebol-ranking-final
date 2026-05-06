import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import * as db from "../db";
import { buildRanking2029 } from "../ranking2029";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.close(() => resolve(true));
    });

    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/debug/ranking", (_req, res) => {
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

  app.get("/api/ranking/2029", async (_req, res) => {
    try {
      const data = await buildRanking2029();

      return res.json({
        season: 2029,
        updatedAt: new Date().toISOString(),
        criteria: {
          victory: 3,
          draw: 1,
          phaseBonus: 3,
        },
        total: data.length,
        data,
      });
    } catch (error) {
      console.error("Erro ao gerar ranking 2029:", error);

      return res.status(500).json({
        error: "Erro ao gerar ranking 2029",
      });
    }
  });

  app.get("/api/debug/matches/:season", async (req, res) => {
    const season = Number(req.params.season);

    if (!Number.isFinite(season)) {
      return res.status(400).json({ error: "Temporada inválida" });
    }

    const data = await db.getMatchesBySeason(season);

    return res.json({
      season,
      total: data.length,
      data,
    });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = Number.parseInt(process.env.PORT || "3000", 10);
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);