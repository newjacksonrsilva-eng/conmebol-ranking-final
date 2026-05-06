// Cores oficiais dos clubes para badges profissionais
export const clubColors: Record<string, { primary: string; secondary: string; initials: string }> = {
  'Palmeiras': { primary: '#27AE60', secondary: '#FFFFFF', initials: 'PA' },
  'Flamengo': { primary: '#CE1126', secondary: '#FFFFFF', initials: 'FL' },
  'LDU Quito': { primary: '#FFCC00', secondary: '#000000', initials: 'LQ' },
  'Racing Club': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'RC' },
  'Estudiantes': { primary: '#FF0000', secondary: '#FFFFFF', initials: 'ES' },
  'São Paulo': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'SP' },
  'Vélez Sarsfield': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'VS' },
  'River Plate': { primary: '#FFFFFF', secondary: '#C41E3A', initials: 'RP' },
  'Botafogo': { primary: '#000000', secondary: '#FFFFFF', initials: 'BO' },
  'Peñarol': { primary: '#000000', secondary: '#FFCC00', initials: 'PE' },
  'Libertad': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'LI' },
  'Atlético Nacional': { primary: '#FFD700', secondary: '#000000', initials: 'AN' },
  'Independiente del Valle': { primary: '#FF6600', secondary: '#FFFFFF', initials: 'IV' },
  'Universitário': { primary: '#8B0000', secondary: '#FFFFFF', initials: 'UN' },
  'Internacional': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'IN' },
  'Fortaleza': { primary: '#0066CC', secondary: '#FF6600', initials: 'FO' },
  'Boca Juniors': { primary: '#0066CC', secondary: '#FFD700', initials: 'BJ' },
  'Cerro Porteño': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'CP' },
  'Nacional': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'NA' },
  'Ind. Rivadavia': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'IR' },
  'Bahia': { primary: '#0066CC', secondary: '#FF0000', initials: 'BA' },
  'Universidad de Chile': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'UC' },
  'Corinthians': { primary: '#000000', secondary: '#FFFFFF', initials: 'CO' },
  'Bolívar': { primary: '#FFD700', secondary: '#000000', initials: 'BO' },
  'Rosário Central': { primary: '#0066CC', secondary: '#FF0000', initials: 'RC' },
  'Colo-Colo': { primary: '#FFFFFF', secondary: '#000000', initials: 'CC' },
  'Alianza Lima': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'AL' },
  'Olimpia': { primary: '#FFD700', secondary: '#000000', initials: 'OL' },
  'Atlético Mineiro': { primary: '#000000', secondary: '#FFFFFF', initials: 'AM' },
  'Independiente': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'ID' },
  'Talleres': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'TA' },
  'Barcelona Guayaquil': { primary: '#FFD700', secondary: '#000000', initials: 'BG' },
  'Cruzeiro': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'CR' },
  'Argentinos Juniors': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'AJ' },
  'Lanús': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'LA' },
  'The Strongest': { primary: '#FFD700', secondary: '#000000', initials: 'TS' },
  'Sporting Cristal': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'SC' },
  'Atlético PR': { primary: '#000000', secondary: '#C41E3A', initials: 'AP' },
  'Coquimbo Unido': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'CU' },
  'Grêmio': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'GR' },
  'Mirassol': { primary: '#FFD700', secondary: '#000000', initials: 'MI' },
  'Universidad Católica': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'UC' },
  'Fluminense': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'FL' },
  'Vitória': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'VI' },
  'San Lorenzo': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'SL' },
  'Carabobo': { primary: '#FFD700', secondary: '#000000', initials: 'CA' },
  'Huracán': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'HU' },
  'Deportivo Táchira': { primary: '#C41E3A', secondary: '#FFFFFF', initials: 'DT' },
  'Platense': { primary: '#0066CC', secondary: '#FFFFFF', initials: 'PL' },
  'Cuiabá': { primary: '#FFD700', secondary: '#000000', initials: 'CU' },
};

export function getClubColor(clubName: string) {
  const colors = clubColors[clubName];
  if (!colors) {
    return { primary: '#1a1a2e', secondary: '#ffffff', initials: clubName.substring(0, 2).toUpperCase() };
  }
  return colors;
}




