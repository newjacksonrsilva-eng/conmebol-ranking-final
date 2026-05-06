import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export async function setupVite(app: Express, server: Server) {
  const clientRoot = path.resolve(process.cwd(), "client");
  const clientSrc = path.resolve(clientRoot, "src");
  const sharedRoot = path.resolve(process.cwd(), "shared");

  const vite = await createViteServer({
    root: clientRoot,
    configFile: false,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": clientSrc,
        "@shared": sharedRoot,
        "@components": path.resolve(clientSrc, "components"),
        "@hooks": path.resolve(clientSrc, "hooks"),
        "@lib": path.resolve(clientSrc, "lib"),
        "@pages": path.resolve(clientSrc, "pages"),
        "@data": path.resolve(clientSrc, "data"),
        "@assets": path.resolve(clientSrc, "assets"),
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const clientTemplate = path.resolve(clientRoot, "index.html");

      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}