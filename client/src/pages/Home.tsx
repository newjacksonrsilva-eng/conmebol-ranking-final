import { useState } from 'react';
import RankingTable from '@/components/RankingTable';
import { Info, Instagram, GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle'; 
import { useAuth } from '@/_core/hooks/useAuth';

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [leaderScore, setLeaderScore] = useState<number>(0);
  
  // Estado para o Modo Noturno


  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Botão de Modo Noturno Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
        <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663038981559/BxHjH2JbegU4QsSagKrbpz/pattern-abstract-Ae7PK5EWqLbG9aBUqhcqgU.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-4">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663038981559/BxHjH2JbegU4QsSagKrbpz/trophy-accent-WAMnUhaLJbRzpMpVLpWNYj.webp" 
                alt="Trophy" 
                className="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg dark:brightness-90"
              />
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Ranking FIFA<br />
                <span className="text-primary">Mundial de Clubes 2029</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Acompanhe o desempenho dos clubes da América do Sul no ciclo 2025–2028 da Copa Libertadores. Conheça quem está na disputa e quem já garantiu sua vaga para o torneio global. 
              </p>
              
              <div className="flex justify-center pt-4">
                <a 
                  href="https://www.instagram.com/srsly.jackson" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <Instagram className="w-5 h-5" />
                  Falar com o Desenvolvedor
                </a>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary">30</p>
                <p className="text-sm text-muted-foreground">Clubes Ranqueados</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary">10</p>
                <p className="text-sm text-muted-foreground">Países</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary">{leaderScore || '...'}</p>
                <p className="text-sm text-muted-foreground">Pontos (Líder)</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary">2025-28</p>
                <p className="text-sm text-muted-foreground">Ciclo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 p-4 md:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-4">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-blue-900 dark:text-blue-100">Como funciona o ranking?</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                A pontuação é baseada no desempenho dos clubes na Copa Libertadores (2025–2028). Vitórias valem 3 pontos, empates 1 ponto, e há bônus de 3 pontos por cada fase avançada. Apenas 2 clubes por país podem se classificar via ranking (exceto múltiplos campeões). 
              </p>
            </div>
          </div>

          <RankingTable onLeaderScoreChange={setLeaderScore} />

{/* Footer Info com Bio Profissional */}
<div className="mt-12 pt-8 border-t border-border grid md:grid-cols-2 gap-8">
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-foreground">Observações Importantes</h2>

    <ul className="space-y-3 text-muted-foreground">
      <li className="flex gap-3">
        <span className="text-primary font-bold">•</span>
        <span>
          <strong>Grandes Ausências:</strong> Clubes tradicionais como River Plate, São Paulo e Botafogo não se classificaram para a Libertadores 2026.
        </span>
      </li>

      <li className="flex gap-3">
        <span className="text-primary font-bold">•</span>
        <span>
          <strong>Critério de Pontuação:</strong> Apenas jogos da Copa Libertadores contam para o Mundial.
        </span>
      </li>
    </ul>
  </div>

            <div className="bg-accent/5 p-6 rounded-xl border border-border space-y-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Desenvolvedor</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Jackson Ribeiro Silva • Estudante de <strong>Engenharia de Produção (UniBH)</strong>. Desenvolvedor entusiasta de sistemas, hardware e análise de dados esportivos. 
              </p>
              <div className="pt-2">
                <a 
                  href="https://www.instagram.com/srsly.jackson" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary font-bold hover:underline flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  @srsly.jackson
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent/5 border-t border-border py-12 mt-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Ranking FIFA Mundial de Clubes 2029 • Dados atualizados via Railway & Render
          </p>
          <p className="text-xs text-muted-foreground/60 mt-4">© 2026 Jackson Ribeiro Silva • Engenharia de Produção UniBh</p>
        </div>
      </footer>
    </div>
  );
}
