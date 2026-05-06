import type express from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.ts";

export { COOKIE_NAME, ONE_YEAR_MS };

export function registerOAuthRoutes(app: express.Express) {
  app.get("/api/oauth/callback", (_req, res) => {
    res.redirect("/");
  });

  app.get("/app-auth", (_req, res) => {
    res.redirect("/");
  });
}

export const getLoginUrl = () => {
  return "/";
};
