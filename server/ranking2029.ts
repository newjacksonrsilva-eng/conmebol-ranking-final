import { rankingData } from "../client/src/data/ranking";
import * as db from "./db";

type RankingStatus =
  | "Classificado"
  | "Pontuando na Libertadores 2026"
  | "Não pontua em 2026";

const normalizeTeamName = (name: string) => {
  const map: Record<string, string> = {
    "Ind. Rivadavia": "Independiente Rivadavia",
    Universitario: "Universitário",
    Bolivar: "Bolívar",
    Barcelona: "Barcelona Guayaquil",
    "Rosario Central": "Rosário Central",
    "Atletico Mineiro": "Atlético Mineiro",
    "Atletico Nacional": "Atlético Nacional",
    "Sao Paulo": "São Paulo",
    Gremio: "Grêmio",
    "Velez Sarsfield": "Vélez Sarsfield",
    Penarol: "Peñarol",
    "Ind. del Valle": "Independiente del Valle",
    "Independiente DV": "Independiente del Valle",
    "Athletico-PR": "Atlético PR",
    "Athletico Paranaense": "Atlético PR",
    LDU: "LDU Quito",
  };

  return map[name] || name;
};

const teamIdByName: Record<string, number> = {
  "Independiente Medellín": 1,
  Estudiantes: 2,
  Cusco: 3,
  Flamengo: 4,
  Tolima: 5,
  Universitário: 6,
  Universitario: 6,
  "Coquimbo Unido": 7,
  Nacional: 8,
  "Deportivo La Guaira": 9,
  Fluminense: 10,
  "Independiente Rivadavia": 11,
  "Ind. Rivadavia": 11,
  Bolívar: 12,
  Bolivar: 12,
  "Barcelona Guayaquil": 13,
  Barcelona: 13,
  Cruzeiro: 14,
  "Universidad Católica": 15,
  "Boca Juniors": 16,
  Platense: 17,
  Corinthians: 18,
  "Santa Fe": 19,
  Peñarol: 20,
  Penarol: 20,
  "Junior Barranquilla": 21,
  Palmeiras: 22,
  "Sporting Cristal": 23,
  "Cerro Porteño": 24,
  "Always Ready": 25,
  "LDU Quito": 26,
  LDU: 26,
  Mirassol: 27,
  Lanús: 28,
  "Rosário Central": 29,
  "Rosario Central": 29,
  "Independiente del Valle": 30,
  "Universidad Central": 31,
  Libertad: 32,
  "River Plate": 33,
  "Racing Club": 34,
  Racing: 34,
  Talleres: 35,
  "San Lorenzo": 36,
  "Atlético Mineiro": 37,
  "São Paulo": 38,
  Botafogo: 39,
  Grêmio: 40,
  Internacional: 41,
  "Atlético PR": 42,
  Fortaleza: 43,
  Bahia: 44,
  "Colo-Colo": 45,
  "Atlético Bucaramanga": 46,
  "Atlético Nacional": 47,
  Olimpia: 48,
  "The Strongest": 49,
  Carabobo: 50,
  "Deportivo Táchira": 51,
  "San Antonio Bulo Bulo": 52,
};

const teamNameById = Object.fromEntries(
  Object.entries(teamIdByName).map(([name, id]) => [id, normalizeTeamName(name)])
) as Record<number, string>;

export async function buildRanking2029() {
  const matches2026 = await db.getMatchesBySeason(2026);

  const rankingMap = new Map<
    string,
    {
      name: string;
      teamId?: number;
      basePoints: number;
      newPoints: number;
      phases: Set<string>;
      played2026: boolean;
    }
  >();

  rankingData.forEach((team) => {
    const name = normalizeTeamName(team.name);

    rankingMap.set(name, {
      name,
      teamId: teamIdByName[name],
      basePoints: team.points,
      newPoints: 0,
      phases: new Set<string>(),
      played2026: false,
    });
  });

  matches2026.forEach((match: any) => {
    if (match.status !== "completed") return;
    if (match.homeScore === null || match.homeScore === undefined) return;
    if (match.awayScore === null || match.awayScore === undefined) return;

    const homeName = teamNameById[match.homeTeamId];
    const awayName = teamNameById[match.awayTeamId];

    const home = rankingMap.get(homeName);
    const away = rankingMap.get(awayName);

    if (home) {
      home.teamId = match.homeTeamId;
      home.played2026 = true;
      home.phases.add(match.phase);

      if (match.homeScore > match.awayScore) home.newPoints += 3;
      else if (match.homeScore === match.awayScore) home.newPoints += 1;
    }

    if (away) {
      away.teamId = match.awayTeamId;
      away.played2026 = true;
      away.phases.add(match.phase);

      if (match.awayScore > match.homeScore) away.newPoints += 3;
      else if (match.awayScore === match.homeScore) away.newPoints += 1;
    }
  });

  return Array.from(rankingMap.values())
    .map((team) => {
      let status: RankingStatus = "Não pontua em 2026";

      if (team.name === "Flamengo") {
        status = "Classificado";
      } else if (team.played2026) {
        status = "Pontuando na Libertadores 2026";
      }

      return {
        rank: 0,
        teamId: team.teamId,
        name: team.name,
        points: team.basePoints + team.newPoints + team.phases.size * 3,
        basePoints: team.basePoints,
        points2026: team.newPoints,
        phaseBonus2026: team.phases.size * 3,
        phases2026: Array.from(team.phases),
        status,
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((team, index) => ({
      ...team,
      rank: index + 1,
    }));
}