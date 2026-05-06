// Dados completos da Copa Libertadores 2025
// Fonte: Wikipedia / CONMEBOL

export interface GroupTeam {
  pos: number;
  name: string;
  country: string;
  flag: string;
  logo: string;
  pld: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  qualified: 'round16' | 'sudamericana' | 'eliminated';
}

export interface Group {
  name: string;
  teams: GroupTeam[];
}

export interface KnockoutMatch {
  team1: string;
  team1Logo: string;
  team1Flag: string;
  team2: string;
  team2Logo: string;
  team2Flag: string;
  agg: string;
  leg1: string;
  leg2: string;
  winner: string;
  penalties?: string;
}

// Logos dos times (Wikimedia Commons)
const logos: Record<string, string> = {
  'Estudiantes': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Estudiantes_de_La_Plata.png',
  'Botafogo': 'https://upload.wikimedia.org/wikipedia/pt/b/b0/Botafogo_de_Futebol_e_Regatas.png',
  'Universidad de Chile': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Universidad_de_Chile.png',
  'Carabobo': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Carabobo_FC.png',
  'River Plate': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/River_Plate.png',
  'Universitario': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Universitario_de_Deportes.png',
  'Independiente del Valle': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Independiente_del_Valle.png',
  'Barcelona': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Barcelona_SC.png',
  'LDU Quito': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/LDU_Quito.png',
  'Flamengo': 'https://upload.wikimedia.org/wikipedia/pt/0/0b/Flamengo_braz.png',
  'Central Córdoba': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Central_Cordoba.png',
  'Deportivo Táchira': 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Deportivo_T%C3%A1chira.png',
  'São Paulo': 'https://upload.wikimedia.org/wikipedia/pt/7/7f/S%C3%A3o_Paulo_FC.png',
  'Libertad': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Club_Libertad.png',
  'Alianza Lima': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Alianza_Lima.png',
  'Talleres': 'https://upload.wikimedia.org/wikipedia/commons/5/53/Talleres_de_C%C3%B3rdoba.png',
  'Racing': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Racing_Club.png',
  'Fortaleza': 'https://upload.wikimedia.org/wikipedia/commons/9/92/Fortaleza_Esporte_Clube.png',
  'Atlético Bucaramanga': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Atletico_Bucaramanga.png',
  'Colo-Colo': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Colo-Colo.png',
  'Internacional': 'https://upload.wikimedia.org/wikipedia/pt/c/cb/Sport_Club_Internacional.png',
  'Atlético Nacional': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Atletico_Nacional.png',
  'Bahia': 'https://upload.wikimedia.org/wikipedia/commons/7/74/EC_Bahia.png',
  'Nacional (URU)': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Club_Nacional_de_Football.png',
  'Palmeiras': 'https://upload.wikimedia.org/wikipedia/pt/3/3c/Palmeiras.png',
  'Cerro Porteño': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Cerro_Porteno.png',
  'Bolívar': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Club_Bolivar.png',
  'Sporting Cristal': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Sporting_Cristal.png',
  'Vélez Sarsfield': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Velez_Sarsfield.png',
  'Peñarol': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Penarol.png',
  'San Antonio Bulo Bulo': 'https://upload.wikimedia.org/wikipedia/commons/8/8f/San_Antonio_Bulo_Bulo.png',
  'Olimpia': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Club_Olimpia.png',
};

const flags: Record<string, string> = {
  'ARG': '🇦🇷', 'BRA': '🇧🇷', 'CHI': '🇨🇱', 'COL': '🇨🇴',
  'ECU': '🇪🇨', 'PAR': '🇵🇾', 'PER': '🇵🇪', 'URU': '🇺🇾',
  'VEN': '🇻🇪', 'BOL': '🇧🇴',
};

function logo(name: string) { return logos[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=64&background=1a1a2e&color=fff`; }
function flag(code: string) { return flags[code] || '🌎'; }

export const grupos2025: Group[] = [
  {
    name: 'Grupo A',
    teams: [
      { pos: 1, name: 'Estudiantes', country: 'Argentina', flag: flag('ARG'), logo: logo('Estudiantes'), pld: 6, w: 4, d: 0, l: 2, gf: 11, ga: 5, gd: 6, pts: 12, qualified: 'round16' },
      { pos: 2, name: 'Botafogo', country: 'Brasil', flag: flag('BRA'), logo: logo('Botafogo'), pld: 6, w: 4, d: 0, l: 2, gf: 8, ga: 5, gd: 3, pts: 12, qualified: 'round16' },
      { pos: 3, name: 'Universidad de Chile', country: 'Chile', flag: flag('CHI'), logo: logo('Universidad de Chile'), pld: 6, w: 3, d: 1, l: 2, gf: 8, ga: 6, gd: 2, pts: 10, qualified: 'sudamericana' },
      { pos: 4, name: 'Carabobo', country: 'Venezuela', flag: flag('VEN'), logo: logo('Carabobo'), pld: 6, w: 0, d: 1, l: 5, gf: 2, ga: 13, gd: -11, pts: 1, qualified: 'eliminated' },
    ],
  },
  {
    name: 'Grupo B',
    teams: [
      { pos: 1, name: 'River Plate', country: 'Argentina', flag: flag('ARG'), logo: logo('River Plate'), pld: 6, w: 3, d: 3, l: 0, gf: 13, ga: 7, gd: 6, pts: 12, qualified: 'round16' },
      { pos: 2, name: 'Universitario', country: 'Peru', flag: flag('PER'), logo: logo('Universitario'), pld: 6, w: 2, d: 2, l: 2, gf: 4, ga: 4, gd: 0, pts: 8, qualified: 'round16' },
      { pos: 3, name: 'Independiente del Valle', country: 'Equador', flag: flag('ECU'), logo: logo('Independiente del Valle'), pld: 6, w: 2, d: 2, l: 2, gf: 8, ga: 11, gd: -3, pts: 8, qualified: 'sudamericana' },
      { pos: 4, name: 'Barcelona', country: 'Equador', flag: flag('ECU'), logo: logo('Barcelona'), pld: 6, w: 1, d: 1, l: 4, gf: 4, ga: 7, gd: -3, pts: 4, qualified: 'eliminated' },
    ],
  },
  {
    name: 'Grupo C',
    teams: [
      { pos: 1, name: 'LDU Quito', country: 'Equador', flag: flag('ECU'), logo: logo('LDU Quito'), pld: 6, w: 3, d: 2, l: 1, gf: 8, ga: 4, gd: 4, pts: 11, qualified: 'round16' },
      { pos: 2, name: 'Flamengo', country: 'Brasil', flag: flag('BRA'), logo: logo('Flamengo'), pld: 6, w: 3, d: 2, l: 1, gf: 6, ga: 3, gd: 3, pts: 11, qualified: 'round16' },
      { pos: 3, name: 'Central Córdoba', country: 'Argentina', flag: flag('ARG'), logo: logo('Central Córdoba'), pld: 6, w: 3, d: 2, l: 1, gf: 7, ga: 7, gd: 0, pts: 11, qualified: 'sudamericana' },
      { pos: 4, name: 'Deportivo Táchira', country: 'Venezuela', flag: flag('VEN'), logo: logo('Deportivo Táchira'), pld: 6, w: 0, d: 0, l: 6, gf: 4, ga: 11, gd: -7, pts: 0, qualified: 'eliminated' },
    ],
  },
  {
    name: 'Grupo D',
    teams: [
      { pos: 1, name: 'São Paulo', country: 'Brasil', flag: flag('BRA'), logo: logo('São Paulo'), pld: 6, w: 4, d: 2, l: 0, gf: 10, ga: 4, gd: 6, pts: 14, qualified: 'round16' },
      { pos: 2, name: 'Libertad', country: 'Paraguai', flag: flag('PAR'), logo: logo('Libertad'), pld: 6, w: 2, d: 3, l: 1, gf: 6, ga: 5, gd: 1, pts: 9, qualified: 'round16' },
      { pos: 3, name: 'Alianza Lima', country: 'Peru', flag: flag('PER'), logo: logo('Alianza Lima'), pld: 6, w: 1, d: 2, l: 3, gf: 7, ga: 11, gd: -4, pts: 5, qualified: 'sudamericana' },
      { pos: 4, name: 'Talleres', country: 'Argentina', flag: flag('ARG'), logo: logo('Talleres'), pld: 6, w: 1, d: 1, l: 4, gf: 5, ga: 8, gd: -3, pts: 4, qualified: 'eliminated' },
    ],
  },
  {
    name: 'Grupo E',
    teams: [
      { pos: 1, name: 'Racing', country: 'Argentina', flag: flag('ARG'), logo: logo('Racing'), pld: 6, w: 4, d: 1, l: 1, gf: 14, ga: 3, gd: 11, pts: 13, qualified: 'round16' },
      { pos: 2, name: 'Fortaleza', country: 'Brasil', flag: flag('BRA'), logo: logo('Fortaleza'), pld: 6, w: 2, d: 2, l: 2, gf: 8, ga: 5, gd: 3, pts: 8, qualified: 'round16' },
      { pos: 3, name: 'Atlético Bucaramanga', country: 'Colômbia', flag: flag('COL'), logo: logo('Atlético Bucaramanga'), pld: 6, w: 1, d: 3, l: 2, gf: 6, ga: 10, gd: -4, pts: 6, qualified: 'sudamericana' },
      { pos: 4, name: 'Colo-Colo', country: 'Chile', flag: flag('CHI'), logo: logo('Colo-Colo'), pld: 6, w: 1, d: 2, l: 3, gf: 5, ga: 15, gd: -10, pts: 5, qualified: 'eliminated' },
    ],
  },
  {
    name: 'Grupo F',
    teams: [
      { pos: 1, name: 'Internacional', country: 'Brasil', flag: flag('BRA'), logo: logo('Internacional'), pld: 6, w: 3, d: 2, l: 1, gf: 12, ga: 8, gd: 4, pts: 11, qualified: 'round16' },
      { pos: 2, name: 'Atlético Nacional', country: 'Colômbia', flag: flag('COL'), logo: logo('Atlético Nacional'), pld: 6, w: 3, d: 0, l: 3, gf: 7, ga: 6, gd: 1, pts: 9, qualified: 'round16' },
      { pos: 3, name: 'Bahia', country: 'Brasil', flag: flag('BRA'), logo: logo('Bahia'), pld: 6, w: 2, d: 1, l: 3, gf: 5, ga: 7, gd: -2, pts: 7, qualified: 'sudamericana' },
      { pos: 4, name: 'Nacional (URU)', country: 'Uruguai', flag: flag('URU'), logo: logo('Nacional (URU)'), pld: 6, w: 2, d: 1, l: 3, gf: 7, ga: 10, gd: -3, pts: 7, qualified: 'eliminated' },
    ],
  },
  {
    name: 'Grupo G',
    teams: [
      { pos: 1, name: 'Palmeiras', country: 'Brasil', flag: flag('BRA'), logo: logo('Palmeiras'), pld: 6, w: 6, d: 0, l: 0, gf: 17, ga: 4, gd: 13, pts: 18, qualified: 'round16' },
      { pos: 2, name: 'Cerro Porteño', country: 'Paraguai', flag: flag('PAR'), logo: logo('Cerro Porteño'), pld: 6, w: 2, d: 1, l: 3, gf: 7, ga: 11, gd: -4, pts: 7, qualified: 'round16' },
      { pos: 3, name: 'Bolívar', country: 'Bolívia', flag: flag('BOL'), logo: logo('Bolívar'), pld: 6, w: 2, d: 0, l: 4, gf: 12, ga: 11, gd: 1, pts: 6, qualified: 'sudamericana' },
      { pos: 4, name: 'Sporting Cristal', country: 'Peru', flag: flag('PER'), logo: logo('Sporting Cristal'), pld: 6, w: 1, d: 1, l: 4, gf: 6, ga: 16, gd: -10, pts: 4, qualified: 'eliminated' },
    ],
  },
  {
    name: 'Grupo H',
    teams: [
      { pos: 1, name: 'Vélez Sarsfield', country: 'Argentina', flag: flag('ARG'), logo: logo('Vélez Sarsfield'), pld: 6, w: 3, d: 2, l: 1, gf: 11, ga: 4, gd: 7, pts: 11, qualified: 'round16' },
      { pos: 2, name: 'Peñarol', country: 'Uruguai', flag: flag('URU'), logo: logo('Peñarol'), pld: 6, w: 3, d: 2, l: 1, gf: 9, ga: 4, gd: 5, pts: 11, qualified: 'round16' },
      { pos: 3, name: 'San Antonio Bulo Bulo', country: 'Bolívia', flag: flag('BOL'), logo: logo('San Antonio Bulo Bulo'), pld: 6, w: 2, d: 0, l: 4, gf: 5, ga: 15, gd: -10, pts: 6, qualified: 'sudamericana' },
      { pos: 4, name: 'Olimpia', country: 'Paraguai', flag: flag('PAR'), logo: logo('Olimpia'), pld: 6, w: 1, d: 2, l: 3, gf: 9, ga: 11, gd: -2, pts: 5, qualified: 'eliminated' },
    ],
  },
];

export const oitavas2025: KnockoutMatch[] = [
  { team1: 'Atlético Nacional', team1Logo: logo('Atlético Nacional'), team1Flag: flag('COL'), team2: 'São Paulo', team2Logo: logo('São Paulo'), team2Flag: flag('BRA'), agg: '1–1 (3–4 p)', leg1: '0–0', leg2: '1–1', winner: 'São Paulo', penalties: '3–4' },
  { team1: 'Fortaleza', team1Logo: logo('Fortaleza'), team1Flag: flag('BRA'), team2: 'Vélez Sarsfield', team2Logo: logo('Vélez Sarsfield'), team2Flag: flag('ARG'), agg: '0–2', leg1: '0–0', leg2: '0–2', winner: 'Vélez Sarsfield' },
  { team1: 'Flamengo', team1Logo: logo('Flamengo'), team1Flag: flag('BRA'), team2: 'Internacional', team2Logo: logo('Internacional'), team2Flag: flag('BRA'), agg: '3–0', leg1: '1–0', leg2: '2–0', winner: 'Flamengo' },
  { team1: 'Universitario', team1Logo: logo('Universitario'), team1Flag: flag('PER'), team2: 'Palmeiras', team2Logo: logo('Palmeiras'), team2Flag: flag('BRA'), agg: '0–4', leg1: '0–4', leg2: '0–0', winner: 'Palmeiras' },
  { team1: 'Libertad', team1Logo: logo('Libertad'), team1Flag: flag('PAR'), team2: 'River Plate', team2Logo: logo('River Plate'), team2Flag: flag('ARG'), agg: '1–1 (1–3 p)', leg1: '0–0', leg2: '1–1', winner: 'River Plate', penalties: '1–3' },
  { team1: 'Cerro Porteño', team1Logo: logo('Cerro Porteño'), team1Flag: flag('PAR'), team2: 'Estudiantes', team2Logo: logo('Estudiantes'), team2Flag: flag('ARG'), agg: '0–1', leg1: '0–1', leg2: '0–0', winner: 'Estudiantes' },
  { team1: 'Peñarol', team1Logo: logo('Peñarol'), team1Flag: flag('URU'), team2: 'Racing', team2Logo: logo('Racing'), team2Flag: flag('ARG'), agg: '2–3', leg1: '1–0', leg2: '1–3', winner: 'Racing' },
  { team1: 'Botafogo', team1Logo: logo('Botafogo'), team1Flag: flag('BRA'), team2: 'LDU Quito', team2Logo: logo('LDU Quito'), team2Flag: flag('ECU'), agg: '1–2', leg1: '1–0', leg2: '0–2', winner: 'LDU Quito' },
];

export const quartas2025: KnockoutMatch[] = [
  { team1: 'LDU Quito', team1Logo: logo('LDU Quito'), team1Flag: flag('ECU'), team2: 'São Paulo', team2Logo: logo('São Paulo'), team2Flag: flag('BRA'), agg: '3–0', leg1: '2–0', leg2: '1–0', winner: 'LDU Quito' },
  { team1: 'Vélez Sarsfield', team1Logo: logo('Vélez Sarsfield'), team1Flag: flag('ARG'), team2: 'Racing', team2Logo: logo('Racing'), team2Flag: flag('ARG'), agg: '0–2', leg1: '0–1', leg2: '0–1', winner: 'Racing' },
  { team1: 'Flamengo', team1Logo: logo('Flamengo'), team1Flag: flag('BRA'), team2: 'Estudiantes', team2Logo: logo('Estudiantes'), team2Flag: flag('ARG'), agg: '2–2 (4–2 p)', leg1: '2–1', leg2: '0–1', winner: 'Flamengo', penalties: '4–2' },
  { team1: 'River Plate', team1Logo: logo('River Plate'), team1Flag: flag('ARG'), team2: 'Palmeiras', team2Logo: logo('Palmeiras'), team2Flag: flag('BRA'), agg: '2–5', leg1: '1–2', leg2: '1–3', winner: 'Palmeiras' },
];

export const semis2025: KnockoutMatch[] = [
  { team1: 'LDU Quito', team1Logo: logo('LDU Quito'), team1Flag: flag('ECU'), team2: 'Palmeiras', team2Logo: logo('Palmeiras'), team2Flag: flag('BRA'), agg: '3–4', leg1: '3–0', leg2: '0–4', winner: 'Palmeiras' },
  { team1: 'Flamengo', team1Logo: logo('Flamengo'), team1Flag: flag('BRA'), team2: 'Racing', team2Logo: logo('Racing'), team2Flag: flag('ARG'), agg: '1–0', leg1: '1–0', leg2: '0–0', winner: 'Flamengo' },
];

export const final2025: KnockoutMatch = {
  team1: 'Palmeiras', team1Logo: logo('Palmeiras'), team1Flag: flag('BRA'),
  team2: 'Flamengo', team2Logo: logo('Flamengo'), team2Flag: flag('BRA'),
  agg: '0–1', leg1: '0–1', leg2: '', winner: 'Flamengo',
};




