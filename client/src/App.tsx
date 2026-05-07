import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminDiscipline from "./pages/AdminDiscipline";

const ADMIN_SESSION_KEY = "conmebol-admin-auth-v1";

function AdminLoginGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  });

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = () => {
    if (!adminPassword) {
      alert("Senha do admin não configurada. Configure VITE_ADMIN_PASSWORD no Render e faça novo deploy.");
      return;
    }

    if (password === adminPassword) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAuthenticated(true);
      return;
    }

    alert("Senha incorreta.");
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl">
          <div className="border-b border-white/10 bg-slate-950/70 px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-300">
              Área protegida
            </p>
            <h1 className="mt-2 text-2xl font-black uppercase italic tracking-tight text-white">
              Admin Libertadores
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-400">
              Digite a senha para acessar o painel administrativo.
            </p>
          </div>

          <div className="space-y-4 px-6 py-6">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleLogin();
                }}
                placeholder="Digite sua senha"
                className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 text-sm font-bold text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="h-12 w-full rounded-2xl bg-blue-600 text-sm font-black uppercase tracking-widest text-white transition hover:bg-blue-500"
            >
              Entrar
            </button>

            <a
              href="/"
              className="block rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/admin">
        {() => (
          <AdminLoginGate>
            <Admin />
          </AdminLoginGate>
        )}
      </Route>

      <Route path="/admin/cartoes">
        {() => (
          <AdminLoginGate>
            <AdminDiscipline />
          </AdminLoginGate>
        )}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
