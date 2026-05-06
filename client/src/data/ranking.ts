export interface RankingClub {
  position: number;
  name: string;
  country: string;
  countryCode: string;
  points: number;
  status: 'active' | 'inactive' | 'qualified';
  statusLabel: string;
}

export const rankingData: RankingClub[] = [
  { position: 1, name: 'Palmeiras', country: 'Brasil', countryCode: 'BRA', points: 53, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 2, name: 'Flamengo', country: 'Brasil', countryCode: 'BRA', points: 51, status: 'qualified', statusLabel: 'Classificado 2029 / Em disputa ✅' },
  { position: 3, name: 'LDU Quito', country: 'Equador', countryCode: 'ECU', points: 44, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 4, name: 'Racing Club', country: 'Argentina', countryCode: 'ARG', points: 35, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 5, name: 'Estudiantes', country: 'Argentina', countryCode: 'ARG', points: 35, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 6, name: 'São Paulo', country: 'Brasil', countryCode: 'BRA', points: 34, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 7, name: 'Vélez Sarsfield', country: 'Argentina', countryCode: 'ARG', points: 31, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 8, name: 'River Plate', country: 'Argentina', countryCode: 'ARG', points: 30, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 9, name: 'Botafogo', country: 'Brasil', countryCode: 'BRA', points: 28, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 10, name: 'Peñarol', country: 'Uruguai', countryCode: 'URU', points: 27, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 11, name: 'Libertad', country: 'Paraguai', countryCode: 'PAR', points: 26, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 12, name: 'Atlético Nacional', country: 'Colômbia', countryCode: 'COL', points: 25, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 13, name: 'Independiente del Valle', country: 'Equador', countryCode: 'ECU', points: 24, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 14, name: 'Universitário', country: 'Peru', countryCode: 'PER', points: 24, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 15, name: 'Internacional', country: 'Brasil', countryCode: 'BRA', points: 23, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 16, name: 'Fortaleza', country: 'Brasil', countryCode: 'BRA', points: 22, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 17, name: 'Boca Juniors', country: 'Argentina', countryCode: 'ARG', points: 21, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 18, name: 'Cerro Porteño', country: 'Paraguai', countryCode: 'PAR', points: 20, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 19, name: 'Nacional', country: 'Uruguai', countryCode: 'URU', points: 19, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 20, name: 'Ind. Rivadavia', country: 'Argentina', countryCode: 'ARG', points: 18, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 21, name: 'Bahia', country: 'Brasil', countryCode: 'BRA', points: 17, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 22, name: 'Universidad de Chile', country: 'Chile', countryCode: 'CHI', points: 16, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 23, name: 'Corinthians', country: 'Brasil', countryCode: 'BRA', points: 15, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 24, name: 'Bolívar', country: 'Bolívia', countryCode: 'BOL', points: 15, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 25, name: 'Rosário Central', country: 'Argentina', countryCode: 'ARG', points: 14, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 26, name: 'Colo-Colo', country: 'Chile', countryCode: 'CHI', points: 14, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 27, name: 'Alianza Lima', country: 'Peru', countryCode: 'PER', points: 13, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 28, name: 'Olimpia', country: 'Paraguai', countryCode: 'PAR', points: 13, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 29, name: 'Atlético Mineiro', country: 'Brasil', countryCode: 'BRA', points: 12, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 30, name: 'Independiente', country: 'Argentina', countryCode: 'ARG', points: 12, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 31, name: 'Talleres', country: 'Argentina', countryCode: 'ARG', points: 11, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 32, name: 'Barcelona Guayaquil', country: 'Equador', countryCode: 'ECU', points: 11, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 33, name: 'Cruzeiro', country: 'Brasil', countryCode: 'BRA', points: 10, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 34, name: 'Argentinos Juniors', country: 'Argentina', countryCode: 'ARG', points: 10, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 35, name: 'Lanús', country: 'Argentina', countryCode: 'ARG', points: 9, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 36, name: 'The Strongest', country: 'Bolívia', countryCode: 'BOL', points: 9, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 37, name: 'Sporting Cristal', country: 'Peru', countryCode: 'PER', points: 8, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 38, name: 'Atlético PR', country: 'Brasil', countryCode: 'BRA', points: 8, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 39, name: 'Coquimbo Unido', country: 'Chile', countryCode: 'CHI', points: 7, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 40, name: 'Grêmio', country: 'Brasil', countryCode: 'BRA', points: 7, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 41, name: 'Mirassol', country: 'Brasil', countryCode: 'BRA', points: 6, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 42, name: 'Universidad Católica', country: 'Equador', countryCode: 'ECU', points: 6, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 43, name: 'Fluminense', country: 'Brasil', countryCode: 'BRA', points: 5, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 44, name: 'Vitória', country: 'Brasil', countryCode: 'BRA', points: 5, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 45, name: 'San Lorenzo', country: 'Argentina', countryCode: 'ARG', points: 4, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 46, name: 'Carabobo', country: 'Venezuela', countryCode: 'VEN', points: 4, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 47, name: 'Huracán', country: 'Argentina', countryCode: 'ARG', points: 3, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 48, name: 'Deportivo Táchira', country: 'Venezuela', countryCode: 'VEN', points: 3, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
  { position: 49, name: 'Platense', country: 'Argentina', countryCode: 'ARG', points: 2, status: 'active', statusLabel: 'Em disputa ✅' },
  { position: 50, name: 'Cuiabá', country: 'Brasil', countryCode: 'BRA', points: 2, status: 'inactive', statusLabel: '❌ Fora da Libertadores 2026' },
];

export const countries = Array.from(new Set(rankingData.map(club => club.country))).sort();




