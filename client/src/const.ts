export { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.ts";

export const getLoginUrl = () => {
  // Definindo valores fixos para evitar o erro de "Invalid URL"
  const oauthPortalUrl = "http://localhost:3000"; 
  const appId = "1";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (e) {
    console.error("Erro ao gerar URL:", e);
    return "#";
  }
};



