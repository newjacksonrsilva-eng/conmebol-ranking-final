/**
 * Mapeamento de nomes de clubes para nomes de arquivos de escudos
 * 
 * Instruções para adicionar logos:
 * 1. Baixe as logos dos clubes em formato PNG
 * 2. Coloque os arquivos na pasta: client/public/escudos/
 * 3. Nomeie os arquivos exatamente como indicado abaixo (ex: palmeiras.png, flamengo.png)
 * 4. O código carregará automaticamente as imagens
 * 
 * Exemplo de estrutura de pastas:
 * client/public/escudos/
 * ├── palmeiras.png
 * ├── flamengo.png
 * ├── ldu-quito.png
 * ├── racing-club.png
 * └── ... (todos os outros clubes)
 */

export const escudosMap: Record<string, string> = {
  'Palmeiras': 'palmeiras.png',
  'Flamengo': 'flamengo.png',
  'LDU Quito': 'ldu-quito.png',
  'Racing Club': 'racing-club.png',
  'Estudiantes': 'estudiantes.png',
  'São Paulo': 'sao-paulo.png',
  'Vélez Sarsfield': 'velez-sarsfield.png',
  'River Plate': 'river-plate.png',
  'Botafogo': 'botafogo.png',
  'Peñarol': 'penarol.png',
  'Libertad': 'libertad.png',
  'Atlético Nacional': 'atletico-nacional.png',
  'Independiente del Valle': 'independiente-del-valle.png',
  'Universitário': 'universitario.png',
  'Internacional': 'internacional.png',
  'Fortaleza': 'fortaleza.png',
  'Boca Juniors': 'boca-juniors.png',
  'Cerro Porteño': 'cerro-porteno.png',
  'Nacional': 'nacional.png',
  'Ind. Rivadavia': 'ind-rivadavia.png',
  'Bahia': 'bahia.png',
  'Universidad de Chile': 'universidad-de-chile.png',
  'Corinthians': 'corinthians.png',
  'Bolívar': 'bolivar.png',
  'Rosário Central': 'rosario-central.png',
  'Colo-Colo': 'colo-colo.png',
  'Alianza Lima': 'alianza-lima.png',
  'Olimpia': 'olimpia.png',
  'Atlético Mineiro': 'atletico-mineiro.png',
  'Independiente': 'independiente.png',
  'Talleres': 'talleres.png',
  'Barcelona Guayaquil': 'barcelona-guayaquil.png',
  'Cruzeiro': 'cruzeiro.png',
  'Argentinos Juniors': 'argentinos-juniors.png',
  'Lanús': 'lanus.png',
  'The Strongest': 'the-strongest.png',
  'Sporting Cristal': 'sporting-cristal.png',
  'Atlético PR': 'atletico-pr.png',
  'Coquimbo Unido': 'coquimbo-unido.png',
  'Grêmio': 'gremio.png',
  'Mirassol': 'mirassol.png',
  'Universidad Católica': 'universidad-catolica.png',
  'Fluminense': 'fluminense.png',
  'Vitória': 'vitoria.png',
  'San Lorenzo': 'san-lorenzo.png',
  'Carabobo': 'carabobo.png',
  'Huracán': 'huracan.png',
  'Deportivo Táchira': 'deportivo-tachira.png',
  'Platense': 'platense.png',
  'Cuiabá': 'cuiaba.png',
  // Clubes da Libertadores 2025
  'Central Córdoba': 'central-cordoba.png',
  'Atlético Bucaramanga': 'atletico-bucaramanga.png',
  'Barcelona': 'barcelona-guayaquil.png',
};

/**
 * Função para obter a URL da logo do escudo
 * Se o arquivo não existir, retorna undefined
 */
export function getEscudoUrl(clubName: string): string | undefined {
  const fileName = escudosMap[clubName];
  if (!fileName) return undefined;
  
  // Retorna o caminho relativo para a pasta public/escudos
  return `/escudos/${fileName}`;
}

/**
 * Função para verificar se o escudo existe
 * Útil para debugging
 */
export function escudoExists(clubName: string): boolean {
  return escudosMap[clubName] !== undefined;
}




