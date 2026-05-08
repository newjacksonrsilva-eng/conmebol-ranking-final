import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronUp, Trophy, X } from "lucide-react";
import { rankingData } from "@/data/ranking";
import {
  grupos2025,
  oitavas2025,
  quartas2025,
  semis2025,
  final2025,
  type KnockoutMatch,
} from "@/data/libertadores2025";
import { getTeamLogoById } from "@/data/teamLogos";
import { trpc } from "@/lib/trpc";

type Aba = "mundial" | "2025" | "2026";
type SubAba2025 = "grupos" | "mata-mata";

interface RankingTableProps {
  onLeaderScoreChange?: (score: number) => void;
}

const normalizeTeamName = (name: string) => {
  const map: Record<string, string> = {
    "Nacional (URU)": "Nacional",
    "Central Cordoba": "Central Córdoba",
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

const fallbackTeamIdByName: Record<string, number> = {
  "Independiente Medellín": 1,
  Estudiantes: 2,
  Cusco: 3,
  Flamengo: 4,
  Tolima: 5,
  Universitário: 6,
  Universitario: 6,
  "Coquimbo Unido": 7,
  Nacional: 8,
  "Nacional (URU)": 8,
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
  Junior: 21,
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
  "Ind. del Valle": 30,
  "Universidad Central": 31,
  Libertad: 32,
  "River Plate": 33,
  "Racing Club": 34,
  Racing: 34,
  Talleres: 35,
  "San Lorenzo": 36,
  "Atlético Mineiro": 37,
  "Atletico Mineiro": 37,
  "São Paulo": 38,
  "Sao Paulo": 38,
  Botafogo: 39,
  Grêmio: 40,
  Gremio: 40,
  Internacional: 41,
  "Atlético PR": 42,
  "Athletico-PR": 42,
  "Athletico Paranaense": 42,
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

const localLogoByName: Record<string, string> = {
  Palmeiras: "/logos/palmeiras.png",
  Flamengo: "/logos/flamengo.png",
  "LDU Quito": "/logos/ldu-quito.png",
  "Racing Club": "/logos/racing-club.png",
  Racing: "/logos/racing-club.png",
  Estudiantes: "/logos/estudiantes.png",
  "São Paulo": "/logos/sao-paulo.png",
  "Vélez Sarsfield": "/logos/velez-sarsfield.png",
  "River Plate": "/logos/river-plate.png",
  Botafogo: "/logos/botafogo.png",
  Peñarol: "/logos/penarol.png",
  Libertad: "/logos/libertad.png",
  "Atlético Nacional": "/logos/atletico-nacional.png",
  "Independiente del Valle": "/logos/independiente-del-valle.png",
  Universitário: "/logos/universitario.png",
  Internacional: "/logos/internacional.png",
  Fortaleza: "/logos/fortaleza.png",
  "Boca Juniors": "/logos/boca-juniors.png",
  "Cerro Porteño": "/logos/cerro-porteno.png",
  Nacional: "/logos/nacional.png",
  "Nacional (URU)": "/logos/nacional.png",
  "Independiente Rivadavia": "/logos/independiente-rivadavia.png",
  Bahia: "/logos/bahia.png",
  "Universidad de Chile": "/logos/universidad-de-chile.png",
  Corinthians: "/logos/corinthians.png",
  Bolívar: "/logos/bolivar.png",
  "Rosário Central": "/logos/rosario-central.png",
  "Colo-Colo": "/logos/colo-colo.png",
  "Alianza Lima": "/logos/alianza-lima.png",
  Olimpia: "/logos/olimpia.png",
  "Atlético Mineiro": "/logos/atletico-mg.png",
  Independiente: "/logos/independiente.png",
  Talleres: "/logos/talleres.png",
  "Barcelona Guayaquil": "/logos/barcelona-sc.png",
  Cruzeiro: "/logos/cruzeiro.png",
  "Argentinos Juniors": "/logos/argentinos-juniors.png",
  Lanús: "/logos/lanus.png",
  "The Strongest": "/logos/the-strongest.png",
  "Sporting Cristal": "/logos/sporting-cristal.png",
  "Atlético PR": "/logos/athletico-pr.png",
  "Coquimbo Unido": "/logos/coquimbo-unido.png",
  Grêmio: "/logos/gremio.png",
  Mirassol: "/logos/mirassol.png",
  "Universidad Católica": "/logos/universidad-catolica.png",
  Fluminense: "/logos/fluminense.png",
  Vitória: "/logos/vitoria.png",
  "San Lorenzo": "/logos/san-lorenzo.png",
  Carabobo: "/logos/carabobo.png",
  Huracán: "/logos/huracan.png",
  "Deportivo Táchira": "/logos/deportivo-tachira.png",
  Platense: "/logos/platense.png",
  Cuiabá: "/logos/cuiaba.png",
  Tolima: "/logos/tolima.png",
  Cusco: "/logos/cusco.png",
  "Independiente Medellín": "/logos/independiente-medellin.png",
  "Deportivo La Guaira": "/logos/deportivo-la-guaira.png",
  "Santa Fe": "/logos/santa-fe.png",
  "Junior Barranquilla": "/logos/junior.png",
  Junior: "/logos/junior.png",
  "Always Ready": "/logos/always-ready.png",
  "Universidad Central": "/logos/universidad-central.png",
  "Central Córdoba": "/logos/central-cordoba.png",
  "Atlético Bucaramanga": "/logos/atletico-bucaramanga.png",
  "San Antonio Bulo Bulo": "/logos/san-antonio-bulo-bulo.png",
};

const teamCountryByName: Record<string, { code: string; country: string }> = {
  // BRASIL
  Flamengo: { code: "br", country: "Brasil" },
  Palmeiras: { code: "br", country: "Brasil" },
  "São Paulo": { code: "br", country: "Brasil" },
  "Sao Paulo": { code: "br", country: "Brasil" },
  Botafogo: { code: "br", country: "Brasil" },
  Fortaleza: { code: "br", country: "Brasil" },
  Internacional: { code: "br", country: "Brasil" },
  Fluminense: { code: "br", country: "Brasil" },
  Cruzeiro: { code: "br", country: "Brasil" },
  Corinthians: { code: "br", country: "Brasil" },
  "Atlético Mineiro": { code: "br", country: "Brasil" },
  "Atletico Mineiro": { code: "br", country: "Brasil" },
  Grêmio: { code: "br", country: "Brasil" },
  Gremio: { code: "br", country: "Brasil" },
  Bahia: { code: "br", country: "Brasil" },
  "Athletico-PR": { code: "br", country: "Brasil" },

  // ARGENTINA
  "Central Córdoba": { code: "ar", country: "Argentina" },
  "River Plate": { code: "ar", country: "Argentina" },
  "Racing Club": { code: "ar", country: "Argentina" },
  Racing: { code: "ar", country: "Argentina" },
  "Boca Juniors": { code: "ar", country: "Argentina" },
  Estudiantes: { code: "ar", country: "Argentina" },
  "Vélez Sarsfield": { code: "ar", country: "Argentina" },
  "Velez Sarsfield": { code: "ar", country: "Argentina" },
  "San Lorenzo": { code: "ar", country: "Argentina" },
  Lanús: { code: "ar", country: "Argentina" },
  Lanus: { code: "ar", country: "Argentina" },
  Talleres: { code: "ar", country: "Argentina" },

  // URUGUAI
  Peñarol: { code: "uy", country: "Uruguai" },
  Penarol: { code: "uy", country: "Uruguai" },
  Nacional: { code: "uy", country: "Uruguai" },

  // EQUADOR
  "LDU Quito": { code: "ec", country: "Equador" },
  LDU: { code: "ec", country: "Equador" },
  "Independiente del Valle": { code: "ec", country: "Equador" },
  Barcelona: { code: "ec", country: "Equador" },

  // PARAGUAI
  Libertad: { code: "py", country: "Paraguai" },
  "Cerro Porteño": { code: "py", country: "Paraguai" },
  Olimpia: { code: "py", country: "Paraguai" },

  // PERU
  Universitario: { code: "pe", country: "Peru" },
  Universitário: { code: "pe", country: "Peru" },
  "Sporting Cristal": { code: "pe", country: "Peru" },

  // COLÔMBIA
  "Atlético Nacional": { code: "co", country: "Colômbia" },
  "Atletico Nacional": { code: "co", country: "Colômbia" },

  // BOLÍVIA
  Bolívar: { code: "bo", country: "Bolívia" },
  Bolivar: { code: "bo", country: "Bolívia" },

  // CHILE
  "Colo-Colo": { code: "cl", country: "Chile" },
  "Universidad de Chile": { code: "cl", country: "Chile" },
  "Universidad Católica": { code: "cl", country: "Chile" },
  "Coquimbo Unido": { code: "cl", country: "Chile" },

  // VENEZUELA
  "Deportivo Táchira": { code: "ve", country: "Venezuela" },
  Carabobo: { code: "ve", country: "Venezuela" },
};

const countryCodeByCountryName: Record<string, string> = {
  brasil: "br",
  brazil: "br",
  argentina: "ar",
  uruguai: "uy",
  uruguay: "uy",
  equador: "ec",
  ecuador: "ec",
  paraguai: "py",
  paraguay: "py",
  peru: "pe",
  colômbia: "co",
  colombia: "co",
  colombia: "co",
  bolívia: "bo",
  bolivia: "bo",
  chile: "cl",
  venezuela: "ve",
};

function normalizeCountryCode(value?: string | null) {
  if (!value) return null;

  const cleanValue = String(value).trim();

  if (!cleanValue) return null;

  if (cleanValue.length === 2) {
    return cleanValue.toLowerCase();
  }

  const normalizedCountry = cleanValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return countryCodeByCountryName[normalizedCountry] || null;
}

function getBackendTeamCountry(team: any) {
  if (!team) return null;

  const countryName =
    team.country ||
    team.countryName ||
    team.country_name ||
    team.nation ||
    team.nationality ||
    null;

  const countryCode =
    normalizeCountryCode(team.countryCode) ||
    normalizeCountryCode(team.country_code) ||
    normalizeCountryCode(team.countryIso2) ||
    normalizeCountryCode(team.country_iso2) ||
    normalizeCountryCode(countryName);

  if (!countryCode || !countryName) return null;

  return {
    code: countryCode,
    country: String(countryName),
  };
}

function getTeamCountryLabel(
  teamName: string,
  backendCountry?: { code: string; country: string } | null,
) {
  if (backendCountry) return backendCountry;

  const normalizedName = normalizeTeamName(teamName);

  return (
    teamCountryByName[normalizedName] ||
    teamCountryByName[teamName] || { code: "un", country: "CONMEBOL" }
  );
}

function ClubBadge({
  clubName,
  teamId,
  size = "md",
}: {
  clubName: string;
  teamId?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const normalizedName = normalizeTeamName(clubName);

  const escudoUrl =
    getTeamLogoById(teamId) ||
    localLogoByName[normalizedName] ||
    "/logos/default.png";

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg shadow-sm border border-border flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800 transition-colors`}
    >
      <img
        src={escudoUrl}
        alt={normalizedName}
        className="w-full h-full object-contain p-1"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/logos/default.png";
        }}
      />
    </div>
  );
}

function makeDisplayMatch(
  base: KnockoutMatch,
  team1: string,
  team2: string,
  agg: string,
  winner: string,
  penalties?: string,
): KnockoutMatch {
  return {
    ...base,
    team1,
    team2,
    agg,
    winner,
    penalties,
  };
}

function BracketTeamRow({
  name,
  winner,
  championTeam,
  hoveredTeam,
  onHoverTeam,
}: {
  name: string;
  winner: boolean;
  championTeam: string;
  hoveredTeam?: string | null;
  onHoverTeam?: (teamName: string | null) => void;
}) {
  const normalizedName = normalizeTeamName(name);
  const teamId =
    fallbackTeamIdByName[normalizedName] || fallbackTeamIdByName[name];
  const isChampion = normalizedName === championTeam;
  const isEliminated = !winner;
  const isHoveredTeam = hoveredTeam === normalizedName;

  return (
    <div
      onMouseEnter={() => onHoverTeam?.(normalizedName)}
      onMouseLeave={() => onHoverTeam?.(null)}
      className={`bracket-team-row flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 border transition-all duration-300 ${
        winner
          ? "bg-slate-900 border-slate-500 text-white hover:border-slate-300"
          : "bg-slate-900/70 border-slate-700 text-slate-300"
      } ${
        isEliminated
          ? "hover:border-red-500 hover:shadow-[0_0_16px_rgba(239,68,68,0.65)] hover:text-red-100"
          : ""
      } ${
        isChampion
          ? "border-green-500/80 hover:border-green-300 hover:shadow-[0_0_18px_rgba(34,197,94,0.75)]"
          : ""
      } ${
        isHoveredTeam && winner
          ? "border-green-300 shadow-[0_0_18px_rgba(34,197,94,0.75)]"
          : ""
      } ${
        isHoveredTeam && isEliminated
          ? "border-red-400 text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.78)]"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ClubBadge clubName={name} teamId={teamId} size="sm" />
        <span className="font-black text-[10px] truncate">
          {normalizedName}
        </span>
      </div>

      {winner && (
        <span className="text-green-400 text-[10px] font-black">✓</span>
      )}
    </div>
  );
}

function BracketMatch({
  match,
  championTeam,
  hoveredTeam,
  onHoverTeam,
}: {
  match: KnockoutMatch;
  championTeam: string;
  hoveredTeam?: string | null;
  onHoverTeam?: (teamName: string | null) => void;
}) {
  const isWinner1 = match.winner === match.team1;
  const isWinner2 = match.winner === match.team2;

  return (
    <div className="relative w-[150px] bracket-match">
      <div className="space-y-1.5">
        <BracketTeamRow
          name={match.team1}
          winner={isWinner1}
          championTeam={championTeam}
          hoveredTeam={hoveredTeam}
          onHoverTeam={onHoverTeam}
        />
        <BracketTeamRow
          name={match.team2}
          winner={isWinner2}
          championTeam={championTeam}
          hoveredTeam={hoveredTeam}
          onHoverTeam={onHoverTeam}
        />

        <div className="text-center text-[8px] font-black text-slate-400 pt-0.5">
          AGG: {match.agg}
        </div>

        {match.penalties && (
          <div className="text-center text-[8px] font-black text-yellow-400">
            Pênaltis: {match.penalties}
          </div>
        )}
      </div>
    </div>
  );
}

function SvgConnector({
  d,
  isHighlighted = false,
  isEliminated = false,
}: {
  d: string;
  isHighlighted?: boolean;
  isEliminated?: boolean;
}) {
  const pathClass = isHighlighted
    ? "highlighted-path"
    : isEliminated
      ? "eliminated-path"
      : "bracket-path";

  return <path d={d} pathLength={1} className={pathClass} />;
}

function Bracket2025() {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
  const championTeam = normalizeTeamName(final2025.winner);

  const leftRound16: KnockoutMatch[] = [
    oitavas2025[0],
    makeDisplayMatch(
      oitavas2025[7],
      "LDU Quito",
      "Botafogo",
      "2–1",
      "LDU Quito",
    ),
    oitavas2025[4],
    oitavas2025[3],
  ];

  const leftQuarters: KnockoutMatch[] = [
    makeDisplayMatch(
      quartas2025[0],
      "São Paulo",
      "LDU Quito",
      "0–3",
      "LDU Quito",
    ),
    makeDisplayMatch(
      quartas2025[3],
      "River Plate",
      "Palmeiras",
      "2–5",
      "Palmeiras",
    ),
  ];

  const leftSemi: KnockoutMatch = makeDisplayMatch(
    semis2025[0],
    "LDU Quito",
    "Palmeiras",
    "3–4",
    "Palmeiras",
  );

  const rightRound16: KnockoutMatch[] = [
    oitavas2025[1],
    oitavas2025[6],
    oitavas2025[5],
    oitavas2025[2],
  ];

  const rightQuarters: KnockoutMatch[] = [
    quartas2025[1],
    makeDisplayMatch(
      quartas2025[2],
      "Estudiantes",
      "Flamengo",
      "2–2",
      "Flamengo",
      "2–4",
    ),
  ];

  const rightSemi: KnockoutMatch = makeDisplayMatch(
    semis2025[1],
    "Racing",
    "Flamengo",
    "0–1",
    "Flamengo",
  );

  const finalMatch: KnockoutMatch = makeDisplayMatch(
    final2025,
    "Palmeiras",
    "Flamengo",
    "0–1",
    "Flamengo",
  );

  const matchWidth = 150;
  const matchCenterY = 44;

  const x = {
    leftR16: 0,
    leftQF: 185,
    leftSF: 370,
    final: 555,
    rightSF: 740,
    rightQF: 925,
    rightR16: 1110,
  };

  const y = {
    r16: [0, 150, 300, 450],
    qf: [75, 375],
    sf: 225,
    final: 225,
  };

  const cx = {
    leftR16Out: x.leftR16 + matchWidth,
    leftQFIn: x.leftQF,
    leftQFOut: x.leftQF + matchWidth,
    leftSFIn: x.leftSF,
    leftSFOut: x.leftSF + matchWidth,
    finalInLeft: x.final,
    finalInRight: x.final + matchWidth,
    rightSFIn: x.rightSF + matchWidth,
    rightSFOut: x.rightSF,
    rightQFIn: x.rightQF + matchWidth,
    rightQFOut: x.rightQF,
    rightR16Out: x.rightR16,
  };

  const cy = {
    leftR16: y.r16.map((value) => value + matchCenterY),
    leftQF: y.qf.map((value) => value + matchCenterY),
    leftSF: y.sf + matchCenterY,
    final: y.final + matchCenterY,
    rightSF: y.sf + matchCenterY,
    rightQF: y.qf.map((value) => value + matchCenterY),
    rightR16: y.r16.map((value) => value + matchCenterY),
  };

  const leftBracket = (
    fromA: number,
    fromB: number,
    to: number,
    fromX: number,
    toX: number,
  ) => {
    const midX = fromX + (toX - fromX) / 2;
    return `M ${fromX} ${fromA} H ${midX} V ${to} H ${toX} M ${fromX} ${fromB} H ${midX} V ${to}`;
  };

  const rightBracket = (
    fromA: number,
    fromB: number,
    to: number,
    fromX: number,
    toX: number,
  ) => {
    const midX = fromX + (toX - fromX) / 2;
    return `M ${fromX} ${fromA} H ${midX} V ${to} H ${toX} M ${fromX} ${fromB} H ${midX} V ${to}`;
  };

  const simple = (fromX: number, fromY: number, toX: number) =>
    `M ${fromX} ${fromY} H ${toX}`;

  const leftSingleBracket = (
    fromY: number,
    toY: number,
    fromX: number,
    toX: number,
  ) => {
    const midX = fromX + (toX - fromX) / 2;
    return `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX}`;
  };

  const rightSingleBracket = (
    fromY: number,
    toY: number,
    fromX: number,
    toX: number,
  ) => {
    const midX = fromX + (toX - fromX) / 2;
    return `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX}`;
  };

  const includesTeam = (match: KnockoutMatch, team: string | null) => {
    if (!team) return false;
    return (
      normalizeTeamName(match.team1) === team ||
      normalizeTeamName(match.team2) === team
    );
  };

  const winnerIsTeam = (match: KnockoutMatch, team: string | null) => {
    if (!team) return false;
    return normalizeTeamName(match.winner) === team;
  };

  const highlightFromMatch = (match: KnockoutMatch) =>
    includesTeam(match, hoveredTeam) && winnerIsTeam(match, hoveredTeam);

  const eliminatedInMatch = (match: KnockoutMatch) =>
    includesTeam(match, hoveredTeam) && !winnerIsTeam(match, hoveredTeam);

  const highlightChampionToFinal = (
    semi: KnockoutMatch,
    finalMatchData: KnockoutMatch,
  ) => {
    if (!hoveredTeam) return false;

    return (
      highlightFromMatch(semi) &&
      normalizeTeamName(finalMatchData.winner) === hoveredTeam
    );
  };

  const highlightEliminatedAtFinal = (
    semi: KnockoutMatch,
    finalMatchData: KnockoutMatch,
  ) => {
    if (!hoveredTeam) return false;

    return (
      highlightFromMatch(semi) &&
      includesTeam(finalMatchData, hoveredTeam) &&
      normalizeTeamName(finalMatchData.winner) !== hoveredTeam
    );
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <style>
        {`
          @keyframes drawHighlightedPath {
            0% {
              stroke-dashoffset: 1;
              opacity: 0.1;
              filter: drop-shadow(0 0 0 rgba(34, 197, 94, 0));
            }
            70% {
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
              filter: drop-shadow(0 0 9px rgba(34, 197, 94, 0.95));
            }
          }

          @keyframes pulseHighlightedPath {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.40));
            }
            50% {
              filter: drop-shadow(0 0 14px rgba(34, 197, 94, 1));
            }
          }

          .bracket-path {
            fill: none;
            stroke: rgba(71, 85, 105, 0.82);
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            vector-effect: non-scaling-stroke;
            transition: stroke 0.25s ease, stroke-width 0.25s ease, filter 0.25s ease;
          }

          .highlighted-path {
            fill: none;
            stroke: rgba(34, 197, 94, 0.98);
            stroke-width: 3.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            vector-effect: non-scaling-stroke;
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation:
              drawHighlightedPath 0.85s ease-out forwards,
              pulseHighlightedPath 1.2s ease-in-out 0.85s infinite;
          }

          .eliminated-path {
            fill: none;
            stroke: rgba(239, 68, 68, 0.98);
            stroke-width: 3.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            vector-effect: non-scaling-stroke;
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            filter: drop-shadow(0 0 9px rgba(239, 68, 68, 0.85));
            animation: drawHighlightedPath 0.85s ease-out forwards;
          }
        `}
      </style>

      <div className="bracket-board relative w-full min-w-[1320px] h-[780px] rounded-3xl bg-slate-950 p-7 border border-border overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,64,175,0.20),_transparent_55%)]" />

        <div className="relative z-10 mx-auto h-full w-[1260px]">
          <div className="relative h-6 text-white text-xs font-black">
            <div
              className="absolute w-[150px] text-center"
              style={{ left: x.leftR16 }}
            >
              Oitavas de final
            </div>

            <div
              className="absolute w-[150px] text-center"
              style={{ left: x.leftQF }}
            >
              Quartas de final
            </div>

            <div
              className="absolute w-[150px] text-center"
              style={{ left: x.leftSF }}
            >
              Semifinal
            </div>

            <div
              className="absolute w-[150px] text-center"
              style={{ left: x.final }}
            >
              Final
            </div>

            <div
              className="absolute w-[150px] text-center"
              style={{ left: x.rightSF }}
            >
              Semifinal
            </div>

            <div
              className="absolute w-[150px] text-center"
              style={{ left: x.rightQF }}
            >
              Quartas de final
            </div>

            <div
              className="absolute w-[150px] text-center"
              style={{ left: x.rightR16 }}
            >
              Oitavas de final
            </div>
          </div>

          <div className="relative z-10 h-[690px] mt-8">
            <svg
              className="pointer-events-none absolute inset-0 z-0"
              width="1260"
              height="690"
              viewBox="0 0 1260 690"
              aria-hidden="true"
            >
              {/* Caminhos neutros completos */}
              <SvgConnector
                d={leftBracket(
                  cy.leftR16[0],
                  cy.leftR16[1],
                  cy.leftQF[0],
                  cx.leftR16Out,
                  cx.leftQFIn,
                )}
              />
              <SvgConnector
                d={leftBracket(
                  cy.leftR16[2],
                  cy.leftR16[3],
                  cy.leftQF[1],
                  cx.leftR16Out,
                  cx.leftQFIn,
                )}
              />
              <SvgConnector
                d={leftBracket(
                  cy.leftQF[0],
                  cy.leftQF[1],
                  cy.leftSF,
                  cx.leftQFOut,
                  cx.leftSFIn,
                )}
              />
              <SvgConnector
                d={simple(cx.leftSFOut, cy.leftSF, cx.finalInLeft)}
              />

              <SvgConnector
                d={rightBracket(
                  cy.rightR16[0],
                  cy.rightR16[1],
                  cy.rightQF[0],
                  cx.rightR16Out,
                  cx.rightQFIn,
                )}
              />
              <SvgConnector
                d={rightBracket(
                  cy.rightR16[2],
                  cy.rightR16[3],
                  cy.rightQF[1],
                  cx.rightR16Out,
                  cx.rightQFIn,
                )}
              />
              <SvgConnector
                d={rightBracket(
                  cy.rightQF[0],
                  cy.rightQF[1],
                  cy.rightSF,
                  cx.rightQFOut,
                  cx.rightSFIn,
                )}
              />
              <SvgConnector
                d={simple(cx.rightSFOut, cy.rightSF, cx.finalInRight)}
              />

              {/* Destaques individuais: só o ramo exato do time fica colorido */}
              <SvgConnector
                d={leftSingleBracket(
                  cy.leftR16[0],
                  cy.leftQF[0],
                  cx.leftR16Out,
                  cx.leftQFIn,
                )}
                isHighlighted={highlightFromMatch(leftRound16[0])}
              />
              <SvgConnector
                d={leftSingleBracket(
                  cy.leftR16[1],
                  cy.leftQF[0],
                  cx.leftR16Out,
                  cx.leftQFIn,
                )}
                isHighlighted={highlightFromMatch(leftRound16[1])}
              />
              <SvgConnector
                d={leftSingleBracket(
                  cy.leftR16[2],
                  cy.leftQF[1],
                  cx.leftR16Out,
                  cx.leftQFIn,
                )}
                isHighlighted={highlightFromMatch(leftRound16[2])}
              />
              <SvgConnector
                d={leftSingleBracket(
                  cy.leftR16[3],
                  cy.leftQF[1],
                  cx.leftR16Out,
                  cx.leftQFIn,
                )}
                isHighlighted={highlightFromMatch(leftRound16[3])}
              />

              <SvgConnector
                d={leftSingleBracket(
                  cy.leftQF[0],
                  cy.leftSF,
                  cx.leftQFOut,
                  cx.leftSFIn,
                )}
                isHighlighted={highlightFromMatch(leftQuarters[0])}
              />
              <SvgConnector
                d={leftSingleBracket(
                  cy.leftQF[1],
                  cy.leftSF,
                  cx.leftQFOut,
                  cx.leftSFIn,
                )}
                isHighlighted={highlightFromMatch(leftQuarters[1])}
              />
              <SvgConnector
                d={simple(cx.leftSFOut, cy.leftSF, cx.finalInLeft)}
                isHighlighted={highlightChampionToFinal(leftSemi, finalMatch)}
                isEliminated={highlightEliminatedAtFinal(leftSemi, finalMatch)}
              />

              <SvgConnector
                d={rightSingleBracket(
                  cy.rightR16[0],
                  cy.rightQF[0],
                  cx.rightR16Out,
                  cx.rightQFIn,
                )}
                isHighlighted={highlightFromMatch(rightRound16[0])}
              />
              <SvgConnector
                d={rightSingleBracket(
                  cy.rightR16[1],
                  cy.rightQF[0],
                  cx.rightR16Out,
                  cx.rightQFIn,
                )}
                isHighlighted={highlightFromMatch(rightRound16[1])}
              />
              <SvgConnector
                d={rightSingleBracket(
                  cy.rightR16[2],
                  cy.rightQF[1],
                  cx.rightR16Out,
                  cx.rightQFIn,
                )}
                isHighlighted={highlightFromMatch(rightRound16[2])}
              />
              <SvgConnector
                d={rightSingleBracket(
                  cy.rightR16[3],
                  cy.rightQF[1],
                  cx.rightR16Out,
                  cx.rightQFIn,
                )}
                isHighlighted={highlightFromMatch(rightRound16[3])}
              />

              <SvgConnector
                d={rightSingleBracket(
                  cy.rightQF[0],
                  cy.rightSF,
                  cx.rightQFOut,
                  cx.rightSFIn,
                )}
                isHighlighted={highlightFromMatch(rightQuarters[0])}
              />
              <SvgConnector
                d={rightSingleBracket(
                  cy.rightQF[1],
                  cy.rightSF,
                  cx.rightQFOut,
                  cx.rightSFIn,
                )}
                isHighlighted={highlightFromMatch(rightQuarters[1])}
              />
              <SvgConnector
                d={simple(cx.rightSFOut, cy.rightSF, cx.finalInRight)}
                isHighlighted={highlightChampionToFinal(rightSemi, finalMatch)}
                isEliminated={highlightEliminatedAtFinal(rightSemi, finalMatch)}
              />
            </svg>

            {leftRound16.map((match, index) => (
              <div
                key={`lr16-${index}`}
                className="absolute z-10"
                style={{ left: x.leftR16, top: y.r16[index] }}
              >
                <BracketMatch
                  match={match}
                  championTeam={championTeam}
                  hoveredTeam={hoveredTeam}
                  onHoverTeam={setHoveredTeam}
                />
              </div>
            ))}

            {leftQuarters.map((match, index) => (
              <div
                key={`lqf-${index}`}
                className="absolute z-10"
                style={{ left: x.leftQF, top: y.qf[index] }}
              >
                <BracketMatch
                  match={match}
                  championTeam={championTeam}
                  hoveredTeam={hoveredTeam}
                  onHoverTeam={setHoveredTeam}
                />
              </div>
            ))}

            <div
              className="absolute z-10"
              style={{ left: x.leftSF, top: y.sf }}
            >
              <BracketMatch
                match={leftSemi}
                championTeam={championTeam}
                hoveredTeam={hoveredTeam}
                onHoverTeam={setHoveredTeam}
              />
            </div>

            <div
              className="absolute z-10 text-center"
              style={{ left: x.final, top: y.final }}
            >
              <div
                className={`rounded-2xl bg-slate-900/90 p-2 transition-all duration-300 ${
                  hoveredTeam === championTeam
                    ? "border border-green-400 shadow-[0_0_28px_rgba(34,197,94,0.45)]"
                    : hoveredTeam &&
                        includesTeam(finalMatch, hoveredTeam) &&
                        !winnerIsTeam(finalMatch, hoveredTeam)
                      ? "border border-red-400 shadow-[0_0_28px_rgba(239,68,68,0.38)]"
                      : "border border-slate-600/80 shadow-[0_0_24px_rgba(15,23,42,0.35)]"
                }`}
              >
                <BracketMatch
                  match={finalMatch}
                  championTeam={championTeam}
                  hoveredTeam={hoveredTeam}
                  onHoverTeam={setHoveredTeam}
                />
              </div>

              <div
                onMouseEnter={() => setHoveredTeam(championTeam)}
                onMouseLeave={() => setHoveredTeam(null)}
                className={`mt-3 inline-flex rounded-lg px-4 py-1 text-[11px] font-black text-black cursor-default transition-all ${
                  hoveredTeam === championTeam
                    ? "bg-green-400 shadow-[0_0_22px_rgba(34,197,94,0.9)]"
                    : "bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                }`}
              >
                {championTeam} campeão
              </div>
            </div>

            <div
              className="absolute z-10"
              style={{ left: x.rightSF, top: y.sf }}
            >
              <BracketMatch
                match={rightSemi}
                championTeam={championTeam}
                hoveredTeam={hoveredTeam}
                onHoverTeam={setHoveredTeam}
              />
            </div>

            {rightQuarters.map((match, index) => (
              <div
                key={`rqf-${index}`}
                className="absolute z-10"
                style={{ left: x.rightQF, top: y.qf[index] }}
              >
                <BracketMatch
                  match={match}
                  championTeam={championTeam}
                  hoveredTeam={hoveredTeam}
                  onHoverTeam={setHoveredTeam}
                />
              </div>
            ))}

            {rightRound16.map((match, index) => (
              <div
                key={`rr16-${index}`}
                className="absolute z-10"
                style={{ left: x.rightR16, top: y.r16[index] }}
              >
                <BracketMatch
                  match={match}
                  championTeam={championTeam}
                  hoveredTeam={hoveredTeam}
                  onHoverTeam={setHoveredTeam}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function groupStatusLabel(qualified: string, pos: number) {
  if (qualified === "round16" || pos <= 2) return "Classificado";
  if (qualified === "sudamericana" || pos === 3) return "Sul-Americana";
  return "Desclassificado";
}

function groupStatusClasses(qualified: string, pos: number) {
  if (qualified === "round16" || pos <= 2) {
    return "border-green-500/25 bg-green-500/10 text-green-300";
  }

  if (qualified === "sudamericana" || pos === 3) {
    return "border-blue-400/25 bg-blue-400/10 text-blue-300";
  }

  return "border-red-500/25 bg-red-500/10 text-red-300";
}

function statTextClass(value: number, positiveGood = true) {
  if (value > 0) return positiveGood ? "text-green-300" : "text-red-300";
  if (value < 0) return positiveGood ? "text-red-300" : "text-green-300";
  return "text-slate-300";
}

type MatchFormResult = "V" | "E" | "D";

function getMatchTimestamp(match: any) {
  const rawDate =
    match.matchDate ||
    match.date ||
    match.kickoff ||
    match.createdAt ||
    match.updatedAt ||
    "";

  const rawTime = match.matchTime || match.match_time || "";

  if (rawDate && rawTime) {
    const datePart = String(rawDate).split("T")[0];
    const timePart = String(rawTime).slice(0, 5);
    const combinedTimestamp = new Date(`${datePart}T${timePart}:00`).getTime();

    if (Number.isFinite(combinedTimestamp)) {
      return combinedTimestamp;
    }
  }

  const timestamp = new Date(rawDate).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function buildRecentFormFromMatches({
  teamId,
  teamName,
  groupName,
  matches,
}: {
  teamId?: number | null;
  teamName: string;
  groupName?: string;
  matches?: any[];
}): MatchFormResult[] {
  if (!matches || matches.length === 0) return [];

  const normalizedTeamName = normalizeTeamName(teamName);
  const groupLetter = String(groupName || "")
    .replace(/grupo/i, "")
    .trim()
    .toUpperCase();

  return matches
    .filter((match: any) => {
      const isCompleted =
        match.status === "completed" &&
        match.homeScore !== null &&
        match.homeScore !== undefined &&
        match.awayScore !== null &&
        match.awayScore !== undefined;

      if (!isCompleted) return false;

      if (
        groupLetter &&
        match.group &&
        String(match.group).toUpperCase() !== groupLetter
      ) {
        return false;
      }

      const homeName = normalizeTeamName(
        match.homeTeam?.name || match.homeTeamName || "",
      );
      const awayName = normalizeTeamName(
        match.awayTeam?.name || match.awayTeamName || "",
      );

      return (
        (teamId !== null &&
          teamId !== undefined &&
          (match.homeTeamId === teamId || match.awayTeamId === teamId)) ||
        homeName === normalizedTeamName ||
        awayName === normalizedTeamName
      );
    })
    .sort((a: any, b: any) => getMatchTimestamp(b) - getMatchTimestamp(a))
    .slice(0, 5)
    .map((match: any) => {
      const isHome =
        teamId !== null && teamId !== undefined
          ? match.homeTeamId === teamId
          : normalizeTeamName(
              match.homeTeam?.name || match.homeTeamName || "",
            ) === normalizedTeamName;

      const goalsFor = isHome
        ? Number(match.homeScore)
        : Number(match.awayScore);
      const goalsAgainst = isHome
        ? Number(match.awayScore)
        : Number(match.homeScore);

      if (goalsFor > goalsAgainst) return "V";
      if (goalsFor < goalsAgainst) return "D";
      return "E";
    });
}

function buildRecentFormFallback(team: any): MatchFormResult[] {
  if (Array.isArray(team.recentForm)) {
    return team.recentForm
      .map((result: string) => String(result).toUpperCase())
      .filter((result: string) => ["V", "E", "D", "W", "L"].includes(result))
      .map((result: string) => {
        if (result === "W") return "V";
        if (result === "L") return "D";
        return result as MatchFormResult;
      })
      .slice(0, 5);
  }

  const fallback: MatchFormResult[] = [];

  for (let index = 0; index < Number(team.w || 0); index++) fallback.push("V");
  for (let index = 0; index < Number(team.d || 0); index++) fallback.push("E");
  for (let index = 0; index < Number(team.l || 0); index++) fallback.push("D");

  return fallback.slice(0, 5);
}

function FormBadge({ result }: { result: MatchFormResult }) {
  const classes: Record<MatchFormResult, string> = {
    V: "bg-emerald-500 text-slate-950",
    E: "bg-slate-500 text-white",
    D: "bg-red-500 text-white",
  };

  return (
    <span
      title={result === "V" ? "Vitória" : result === "E" ? "Empate" : "Derrota"}
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] px-1 text-[10px] font-black ${classes[result]}`}
    >
      {result}
    </span>
  );
}

function getGroupLetterFromName(groupName?: string | null) {
  const value = String(groupName || "").trim();
  const direct = value.match(/grupo\s+([a-h])/i);
  if (direct) return direct[1].toUpperCase();
  const lastLetter = value.match(/([A-H])$/i);
  return lastLetter ? lastLetter[1].toUpperCase() : value.toUpperCase();
}

function getMatchDateLabel(match: any) {
  const timestamp = getMatchTimestamp(match);
  if (!timestamp) return "Data a definir";

  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getMatchTimeLabel(match: any) {
  const savedTime = match.matchTime || match.match_time || "";

  if (savedTime) {
    return String(savedTime).slice(0, 5);
  }

  const timestamp = getMatchTimestamp(match);
  if (!timestamp) return "--:--";

  return new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalizeLabel(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getMatchDateWeekdayTimeLabel(match: any) {
  const timestamp = getMatchTimestamp(match);
  if (!timestamp) return "Data a definir";

  const date = new Date(timestamp);
  const dayMonth = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  const weekday = capitalizeLabel(
    date.toLocaleDateString("pt-BR", { weekday: "long" }),
  );
  const savedTime = match.matchTime || match.match_time || "";
  const time = savedTime
    ? String(savedTime).slice(0, 5)
    : date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

  return `${dayMonth} · ${weekday} · ${time}`;
}

function getRoundLabel(match: any, index: number) {
  const explicitRound =
    match.round ||
    match.rodada ||
    match.roundNumber ||
    match.round_number ||
    match.matchday ||
    match.matchDay ||
    null;

  if (
    explicitRound !== null &&
    explicitRound !== undefined &&
    explicitRound !== ""
  ) {
    const cleanRound = String(explicitRound)
      .replace(/^rodada\s*/i, "")
      .trim();
    return `Rodada ${cleanRound}`;
  }

  return `Jogo ${index + 1}`;
}

function getTeamNameForFixture(
  match: any,
  side: "home" | "away",
  teamNameById: Record<number, string>,
) {
  const teamId = side === "home" ? match.homeTeamId : match.awayTeamId;
  const embeddedTeam = side === "home" ? match.homeTeam : match.awayTeam;
  const alternativeName =
    side === "home" ? match.homeTeamName : match.awayTeamName;

  return normalizeTeamName(
    embeddedTeam?.name ||
      alternativeName ||
      teamNameById[teamId] ||
      `Time ${teamId}`,
  );
}


function getYoutubeEmbedUrl(url?: string | null) {
  if (!url) return null;

  const value = String(url).trim();

  if (!value) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/i,
    /(?:youtu\.be\/)([^?\s]+)/i,
    /(?:youtube\.com\/embed\/)([^?\s]+)/i,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
  }

  return null;
}

function MatchVideoModal({
  match,
  teamNameById,
  onClose,
}: {
  match: any;
  teamNameById: Record<number, string>;
  onClose: () => void;
}) {
  const embedUrl = getYoutubeEmbedUrl(match.videoUrl || match.video_url);
  const homeName = getTeamNameForFixture(match, "home", teamNameById);
  const awayName = getTeamNameForFixture(match, "away", teamNameById);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-white/[0.035] px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Saiba como foi
            </p>
            <h3 className="mt-1 truncate text-lg font-black text-white sm:text-xl">
              {homeName} x {awayName}
            </h3>
            <p className="mt-1 text-xs font-bold text-slate-400">
              {match.stadium || match.venue || match.local || "Estádio a definir"} · {getMatchDateWeekdayTimeLabel(match)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.10]"
            aria-label="Fechar vídeo"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {embedUrl ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              src={embedUrl}
              title={`Vídeo ${homeName} x ${awayName}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex min-h-[260px] items-center justify-center px-6 py-10 text-center">
            <div>
              <p className="text-lg font-black text-white">
                Vídeo ainda não cadastrado
              </p>
              <p className="mt-2 text-sm font-bold text-slate-400">
                Adicione o link do YouTube no Admin para este jogo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FixtureStatusBadge({
  match,
  onOpenVideo,
}: {
  match: any;
  onOpenVideo: (match: any) => void;
}) {
  const isCompleted =
    match.status === "completed" &&
    match.homeScore !== null &&
    match.homeScore !== undefined &&
    match.awayScore !== null &&
    match.awayScore !== undefined;

  const isLive = match.status === "in_progress";
  const hasVideo = Boolean(match.videoUrl || match.video_url);

  if (isCompleted) {
    return (
      <button
        type="button"
        onClick={() => onOpenVideo(match)}
        className={`text-[10px] font-black uppercase tracking-widest transition ${
          hasVideo
            ? "text-emerald-400 hover:text-emerald-300 hover:underline"
            : "text-slate-500 hover:text-slate-300"
        }`}
        title={hasVideo ? "Abrir vídeo da partida" : "Vídeo ainda não cadastrado"}
      >
        Saiba como foi
      </button>
    );
  }

  if (isLive) {
    return (
      <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-yellow-300">
        Ao vivo
      </span>
    );
  }

  return (
    <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-blue-300">
      A jogar
    </span>
  );
}

function GroupFixturesPanel({
  group,
  matches,
}: {
  group: any;
  matches?: any[];
}) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [selectedVideoMatch, setSelectedVideoMatch] = useState<any | null>(null);
  const groupLetter = getGroupLetterFromName(group.name);
  const teamNameById = (group.teams || []).reduce(
    (acc: Record<number, string>, team: any) => {
      if (team.teamId !== null && team.teamId !== undefined) {
        acc[team.teamId] = normalizeTeamName(team.name);
      }
      return acc;
    },
    {},
  );

  const groupMatches = (matches || [])
    .filter(
      (match: any) => String(match.group || "").toUpperCase() === groupLetter,
    )
    .sort((a: any, b: any) => {
      const dateDiff = getMatchTimestamp(a) - getMatchTimestamp(b);
      if (dateDiff !== 0) return dateDiff;
      return Number(a.id || 0) - Number(b.id || 0);
    });

  const rounds = groupMatches
    .reduce((acc: any[], match: any, index: number) => {
      const explicitRound =
        match.round ||
        match.rodada ||
        match.roundNumber ||
        match.round_number ||
        match.matchday ||
        match.matchDay ||
        null;

      const derivedRound = Math.floor(index / 2) + 1;
      const rawRound =
        explicitRound !== null &&
        explicitRound !== undefined &&
        explicitRound !== ""
          ? explicitRound
          : derivedRound;
      const cleanRound = String(rawRound)
        .replace(/^rodada\s*/i, "")
        .trim();
      const roundNumber = Number(cleanRound) || derivedRound;
      const roundLabel = `Rodada ${roundNumber}`;
      const existingRound = acc.find(
        (item) => item.key === String(roundNumber),
      );

      if (existingRound) {
        existingRound.matches.push(match);
      } else {
        acc.push({
          key: String(roundNumber),
          label: roundLabel,
          number: roundNumber,
          matches: [match],
        });
      }

      return acc;
    }, [])
    .sort((a, b) => a.number - b.number);

  useEffect(() => {
    if (rounds.length === 0) {
      if (activeRoundIndex !== 0) setActiveRoundIndex(0);
      return;
    }

    if (activeRoundIndex > rounds.length - 1) {
      setActiveRoundIndex(rounds.length - 1);
    }
  }, [activeRoundIndex, rounds.length]);

  const activeRound = rounds[activeRoundIndex];
  const goToPreviousRound = () => {
    setActiveRoundIndex((current) => Math.max(0, current - 1));
  };

  const goToNextRound = () => {
    setActiveRoundIndex((current) => Math.min(rounds.length - 1, current + 1));
  };

  return (
    <>
    <aside className="flex h-full min-h-[285px] flex-col rounded-2xl border border-white/10 bg-slate-950/60 p-2 sm:p-2.5">
      {rounds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.025] p-4 text-center text-[11px] font-bold leading-relaxed text-slate-500">
          Rodadas ainda não cadastradas para este grupo.
        </div>
      ) : (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#10161b]">
          <div className="grid grid-cols-[42px_minmax(0,1fr)_42px] items-center border-b border-white/10 bg-white/[0.025]">
            <button
              type="button"
              onClick={goToPreviousRound}
              disabled={activeRoundIndex === 0}
              className={`flex h-12 items-center justify-center text-2xl font-black transition ${
                activeRoundIndex === 0
                  ? "cursor-not-allowed text-slate-700"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              }`}
              aria-label="Rodada anterior"
            >
              ‹
            </button>

            <div className="text-center text-sm font-black uppercase tracking-wide text-white">
              {activeRound?.label}
            </div>

            <button
              type="button"
              onClick={goToNextRound}
              disabled={activeRoundIndex === rounds.length - 1}
              className={`flex h-12 items-center justify-center text-2xl font-black transition ${
                activeRoundIndex === rounds.length - 1
                  ? "cursor-not-allowed text-slate-700"
                  : "text-emerald-400 hover:bg-white/[0.06] hover:text-emerald-300"
              }`}
              aria-label="Próxima rodada"
            >
              ›
            </button>
          </div>

          <div className="flex-1 divide-y divide-white/10 overflow-hidden">
            {activeRound.matches.map((match: any, index: number) => {
              const homeName = getTeamNameForFixture(
                match,
                "home",
                teamNameById,
              );
              const awayName = getTeamNameForFixture(
                match,
                "away",
                teamNameById,
              );
              const isCompleted =
                match.status === "completed" &&
                match.homeScore !== null &&
                match.homeScore !== undefined &&
                match.awayScore !== null &&
                match.awayScore !== undefined;
              const venue = match.venue || match.stadium || match.local || "";

              return (
                <div
                  key={
                    match.id ||
                    `${groupLetter}-${activeRound.key}-${index}-${homeName}-${awayName}`
                  }
                  className="bg-white/[0.015] px-3 py-3 transition hover:bg-white/[0.04]"
                >
                  <div className="mb-2 text-center text-[10px] font-bold leading-relaxed text-slate-400">
                    <div className="truncate">
                      {venue || "Estádio a definir"}
                    </div>
                    <div className="font-black text-slate-200">
                      {getMatchDateWeekdayTimeLabel(match)}
                    </div>
                  </div>

                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                    <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                      <span className="truncate text-xs font-bold text-slate-200">
                        {homeName}
                      </span>
                      <ClubBadge
                        clubName={homeName}
                        teamId={match.homeTeamId}
                        size="sm"
                      />
                    </div>

                    <div className="flex min-w-[70px] items-center justify-center gap-2 text-lg font-black text-white">
                      {isCompleted ? (
                        <>
                          <span>{match.homeScore}</span>
                          <span className="text-slate-500">×</span>
                          <span>{match.awayScore}</span>
                        </>
                      ) : (
                        <span className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] text-slate-300">
                          {getMatchTimeLabel(match)}
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                      <ClubBadge
                        clubName={awayName}
                        teamId={match.awayTeamId}
                        size="sm"
                      />
                      <span className="truncate text-xs font-bold text-slate-200">
                        {awayName}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-center">
                    <FixtureStatusBadge match={match} onOpenVideo={setSelectedVideoMatch} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-1 border-t border-white/10 px-3 py-1">
            {rounds.map((round, index) => (
              <button
                key={round.key}
                type="button"
                onClick={() => setActiveRoundIndex(index)}
                className={`h-1.5 rounded-full transition ${
                  index === activeRoundIndex
                    ? "w-6 bg-blue-500"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Ir para ${round.label}`}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
    {selectedVideoMatch && (
      <MatchVideoModal
        match={selectedVideoMatch}
        teamNameById={teamNameById}
        onClose={() => setSelectedVideoMatch(null)}
      />
    )}
    </>
  );
}

function HistoricalGroupStatsPanel({ group }: { group: any }) {
  const teams = group.teams || [];
  const totalGoals = teams.reduce((sum: number, team: any) => sum + Number(team.gf || 0), 0);
  const totalMatches = teams.reduce((sum: number, team: any) => sum + Number(team.pld || 0), 0) / 2;
  const goalsPerMatch = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : "0.00";

  const leader = [...teams].sort((a: any, b: any) => Number(b.pts || 0) - Number(a.pts || 0))[0];
  const bestAttack = [...teams].sort((a: any, b: any) => Number(b.gf || 0) - Number(a.gf || 0))[0];
  const bestDefense = [...teams].sort((a: any, b: any) => Number(a.ga || 0) - Number(b.ga || 0))[0];
  const bestBalance = [...teams].sort((a: any, b: any) => Number(b.gd || 0) - Number(a.gd || 0))[0];
  const mostLosses = [...teams].sort((a: any, b: any) => Number(b.l || 0) - Number(a.l || 0))[0];

  const leaderEfficiency =
    leader && Number(leader.pld || 0) > 0
      ? Math.round((Number(leader.pts || 0) / (Number(leader.pld || 0) * 3)) * 100)
      : 0;

  const worstDefense = [...teams].sort((a: any, b: any) => Number(b.ga || 0) - Number(a.ga || 0))[0];

  const stats = [
    {
      icon: "⚽",
      label: "Gols marcados",
      value: String(totalGoals),
      detail: `${goalsPerMatch} por jogo`,
      tone: "from-blue-500/20 to-cyan-400/10 border-blue-400/20",
    },
    {
      teamName: bestAttack?.name,
      label: "Melhor ataque",
      value: bestAttack?.name || "-",
      detail: `${bestAttack?.gf ?? 0} gols`,
      tone: "from-orange-500/20 to-red-400/10 border-orange-400/20",
    },
    {
      teamName: bestDefense?.name,
      label: "Melhor defesa",
      value: bestDefense?.name || "-",
      detail: `${bestDefense?.ga ?? 0} sofridos`,
      tone: "from-emerald-500/20 to-teal-400/10 border-emerald-400/20",
    },
    {
      teamName: bestBalance?.name,
      label: "Melhor saldo",
      value: bestBalance?.name || "-",
      detail: `${Number(bestBalance?.gd || 0) > 0 ? "+" : ""}${bestBalance?.gd ?? 0}`,
      tone: "from-violet-500/20 to-fuchsia-400/10 border-violet-400/20",
    },
    {
      teamName: leader?.name,
      label: "Líder",
      value: leader?.name || "-",
      detail: `${leader?.pts ?? 0} pts · ${leaderEfficiency}%`,
      tone: "from-yellow-500/20 to-amber-400/10 border-yellow-400/20",
    },
    {
      teamName: worstDefense?.name,
      label: "Pior defesa",
      value: worstDefense?.name || "-",
      detail: `${worstDefense?.ga ?? 0} sofridos`,
      tone: "from-rose-500/20 to-red-400/10 border-rose-400/20",
    },
  ];

  return (
    <aside className="h-fit self-start rounded-2xl border border-white/10 bg-slate-950/60 p-2 sm:p-2.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h4 className="text-[12px] font-black uppercase tracking-wide text-white">
            Estatísticas do grupo
          </h4>
        </div>

        <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-yellow-200">
          Histórico
        </span>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {stats.map((stat) => (
          <div
            key={`${stat.label}-${stat.value}`}
            className={`group overflow-hidden rounded-xl border bg-gradient-to-br ${stat.tone} p-2 transition hover:-translate-y-0.5 hover:bg-white/[0.04]`}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                {stat.teamName ? (
                  <ClubBadge clubName={stat.teamName} size="sm" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-base shadow-inner">
                    {stat.icon}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-0.5 truncate text-[12px] font-black text-white">
                  {stat.value}
                </p>
              </div>

              <div className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[8px] font-black text-slate-200">
                {stat.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function GroupCard({ group, matches, showFixtures = true }: { group: any; matches?: any[]; showFixtures?: boolean }) {
  const groupTitle = String(group.name || "").replace("GRUPO ", "Grupo ");
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700/70 bg-[#14191c] shadow-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-inner">
            <img
              src="https://upload.wikimedia.org/wikipedia/pt/9/95/Conmebol_Libertadores_logo.svg"
              alt="CONMEBOL Libertadores"
              className="h-[30px] w-[30px] object-contain"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-black text-white sm:text-lg">
              CONMEBOL Libertadores, {groupTitle}
            </h3>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-blue-200/55">
              Classificação da fase de grupos
            </p>
          </div>
        </div>

        <div className="hidden rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 sm:block">
          Classificação
        </div>
      </div>

      <div className="grid items-start gap-4 p-3 sm:p-4 xl:grid-cols-[minmax(0,785px)_minmax(320px,1fr)]">
        <div className="relative top-2 self-center flex h-fit flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/35">
          <div className="overflow-x-auto">
            <div className="min-w-[760px] px-3 py-3">
              <div className="grid grid-cols-[34px_minmax(190px,1fr)_34px_34px_34px_34px_48px_58px_116px_44px] items-center gap-2 px-1 pb-2 text-[10px] font-black uppercase tracking-wide text-slate-500">
                <div className="text-center">#</div>
                <div>Time</div>
                <div className="text-center" title="Partidas">
                  P
                </div>
                <div className="text-center" title="Vitórias">
                  V
                </div>
                <div className="text-center" title="Empates">
                  E
                </div>
                <div className="text-center" title="Derrotas">
                  D
                </div>
                <div className="text-center" title="Saldo de gols">
                  SG
                </div>
                <div className="text-center" title="Gols pró e gols contra">
                  GP:GC
                </div>
                <div
                  className="text-center"
                  title="Últimos 5 jogos cadastrados"
                >
                  Últimos 5
                </div>
                <div className="text-right" title="Pontos">
                  PTS
                </div>
              </div>

              <div className="space-y-1.5">
                {group.teams.map((team: any) => {
                  const gd = team.gd ?? (team.gf ?? 0) - (team.ga ?? 0);
                  const played =
                    team.pld ??
                    Number(team.w || 0) +
                      Number(team.d || 0) +
                      Number(team.l || 0);
                  const recentFormFromMatches = buildRecentFormFromMatches({
                    teamId: team.teamId,
                    teamName: team.name,
                    groupName: group.name,
                    matches,
                  });
                  const recentForm =
                    recentFormFromMatches.length > 0
                      ? recentFormFromMatches
                      : buildRecentFormFallback(team);

                  const positionClasses =
                    team.pos <= 2
                      ? "bg-emerald-500 text-slate-950"
                      : team.pos === 3
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-950 text-white";

                  return (
                    <div
                      key={team.name}
                      className={`grid grid-cols-[34px_minmax(190px,1fr)_34px_34px_34px_34px_48px_58px_116px_44px] items-center gap-2 rounded-xl px-1 py-2 text-[12px] font-black text-white transition hover:bg-white/[0.04] ${
                        team.pos === 1 ? "bg-white/[0.035]" : ""
                      }`}
                    >
                      <div className="flex justify-center">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${positionClasses}`}
                        >
                          {team.pos}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        <ClubBadge
                          clubName={team.name}
                          teamId={team.teamId}
                          size="sm"
                        />
                        <span className="truncate text-white">
                          {normalizeTeamName(team.name)}
                        </span>
                      </div>

                      <div className="text-center">{played}</div>
                      <div className="text-center">{team.w ?? 0}</div>
                      <div className="text-center text-slate-300">
                        {team.d ?? 0}
                      </div>
                      <div className="text-center text-red-300">
                        {team.l ?? 0}
                      </div>
                      <div className={`text-center ${statTextClass(gd)}`}>
                        {gd > 0 ? `+${gd}` : gd}
                      </div>
                      <div className="text-center">
                        {team.gf ?? 0}:{team.ga ?? 0}
                      </div>
                      <div className="flex items-center justify-center gap-1 rounded bg-white/10 px-1 py-0.5">
                        {recentForm.length > 0 ? (
                          recentForm.map((result, index) => (
                            <FormBadge
                              key={`${team.name}-${result}-${index}`}
                              result={result}
                            />
                          ))
                        ) : (
                          <span className="text-[10px] font-black text-slate-500">
                            Sem jogos
                          </span>
                        )}
                      </div>
                      <div className="text-right text-white">
                        {team.pts ?? 0}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 bg-[#05090c]">
            <button
              type="button"
              onClick={() => setRulesOpen((current) => !current)}
              className="flex h-11 w-full items-center justify-between px-4 text-left text-xs font-black text-white transition hover:bg-white/[0.035]"
              aria-expanded={rulesOpen}
            >
              <span>Regras</span>
              <span className="flex h-6 w-6 items-center justify-center text-white/85">
                {rulesOpen ? (
                  <ChevronUp className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <ChevronDown className="h-4 w-4" strokeWidth={3} />
                )}
              </span>
            </button>

            {rulesOpen && (
              <div className="space-y-3 border-t border-white/10 bg-[#070c0f] px-4 pb-4 pt-3 text-[11px] font-bold leading-relaxed text-slate-200">
                <div className="flex flex-wrap gap-4 text-[11px]">
                  <div className="inline-flex items-center gap-2 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Play-off
                  </div>
                  <div className="inline-flex items-center gap-2 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Taça Sul-Americana
                  </div>
                </div>

                <p className="max-w-4xl text-white">
                  Se duas equipes empatarem na classificação, os critérios de
                  desempate são: 1. Confronto direto entre as equipes em
                  questão, 1a. Total de pontos, 1b. Diferença de gols, 1c. Gols
                  marcados, 2. Diferença de gols, 3. Gols marcados.
                </p>

                <div className="grid max-w-xl grid-cols-[56px_1fr] gap-x-4 gap-y-2 text-[11px]">
                  <div className="font-black text-slate-400">P</div>
                  <div>Jogos disputados</div>
                  <div className="font-black text-slate-400">V</div>
                  <div>Vitórias</div>
                  <div className="font-black text-slate-400">E</div>
                  <div>Empates</div>
                  <div className="font-black text-slate-400">D</div>
                  <div>Derrotas</div>
                  <div className="font-black text-slate-400">SG</div>
                  <div>Saldo de gols</div>
                  <div className="font-black text-slate-400">GP:GC</div>
                  <div>Gols pró / gols contra</div>
                  <div className="font-black text-slate-400">PTS</div>
                  <div>Pontos</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showFixtures ? (
          <GroupFixturesPanel group={group} matches={matches} />
        ) : (
          <HistoricalGroupStatsPanel group={group} />
        )}
      </div>
    </div>
  );
}

function GroupsBoard({ groups, matches, showFixtures = true }: { groups: any[]; matches?: any[]; showFixtures?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-slate-950 p-4 sm:p-5">
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,64,175,0.17),_transparent_58%)]" />

      <div className="relative z-10 grid grid-cols-1 gap-5">
        {groups.map((group) => (
          <GroupCard key={group.name} group={group} matches={matches} showFixtures={showFixtures} />
        ))}
      </div>
    </div>
  );
}

function aplicarDesempateConmebol(
  times: any[],
  matches: any[],
  groupLetter: string,
) {
  const gruposPorPontos: Record<number, any[]> = {};

  times.forEach((t) => {
    if (!gruposPorPontos[t.pts]) gruposPorPontos[t.pts] = [];
    gruposPorPontos[t.pts].push(t);
  });

  const resultado: any[] = [];

  Object.values(gruposPorPontos)
    .sort((a, b) => b[0].pts - a[0].pts)
    .forEach((grupo) => {
      if (grupo.length === 1) {
        resultado.push(grupo[0]);
        return;
      }

      const ids = grupo.map((t) => t.teamId);

      const confrontos = matches.filter(
        (m: any) =>
          m.group === groupLetter &&
          ids.includes(m.homeTeamId) &&
          ids.includes(m.awayTeamId) &&
          m.status === "completed" &&
          m.homeScore !== null &&
          m.homeScore !== undefined &&
          m.awayScore !== null &&
          m.awayScore !== undefined,
      );

      const mini: Record<number, { pts: number; sg: number; gm: number }> = {};

      ids.forEach((id) => {
        mini[id] = { pts: 0, sg: 0, gm: 0 };
      });

      confrontos.forEach((m: any) => {
        const h = mini[m.homeTeamId];
        const a = mini[m.awayTeamId];

        h.gm += m.homeScore;
        a.gm += m.awayScore;

        h.sg += m.homeScore - m.awayScore;
        a.sg += m.awayScore - m.homeScore;

        if (m.homeScore > m.awayScore) h.pts += 3;
        else if (m.homeScore < m.awayScore) a.pts += 3;
        else {
          h.pts += 1;
          a.pts += 1;
        }
      });

      grupo.sort((a, b) => {
        const ma = mini[a.teamId];
        const mb = mini[b.teamId];

        if (mb.pts !== ma.pts) return mb.pts - ma.pts;
        if (mb.sg !== ma.sg) return mb.sg - ma.sg;
        if (mb.gm !== ma.gm) return mb.gm - ma.gm;

        const sgA = a.gf - a.ga;
        const sgB = b.gf - b.ga;
        if (sgB !== sgA) return sgB - sgA;

        if (b.gf !== a.gf) return b.gf - a.gf;

        if ((b.awayGoals ?? 0) !== (a.awayGoals ?? 0)) {
          return (b.awayGoals ?? 0) - (a.awayGoals ?? 0);
        }

        if ((a.redCards ?? 0) !== (b.redCards ?? 0)) {
          return (a.redCards ?? 0) - (b.redCards ?? 0);
        }

        if ((a.yellowCards ?? 0) !== (b.yellowCards ?? 0)) {
          return (a.yellowCards ?? 0) - (b.yellowCards ?? 0);
        }

        return 0;
      });

      resultado.push(...grupo);
    });

  return resultado;
}

function StatusBadge({ status }: { status: string }) {
  const isQualified = status === "Classificado";
  const isPlaying = status === "Pontuando na Libertadores 2026";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-black ${
        isQualified
          ? "bg-green-500/15 text-green-600 border border-green-500/25"
          : isPlaying
            ? "bg-blue-500/10 text-blue-600 border border-blue-500/25"
            : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}

export default function RankingTable({
  onLeaderScoreChange,
}: RankingTableProps) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("mundial");
  const [subAba, setSubAba] = useState<SubAba2025>("grupos");

  const {
    data: matches2026,
    isLoading: isLoadingMatches,
    error: matchesError,
  } = trpc.libertadores.matches.list.useQuery({ season: 2026 });

  const { data: teamsData } = trpc.libertadores.teams.list.useQuery();

  const { data: disciplineData } = trpc.libertadores.discipline.list.useQuery({
    season: 2026,
  });

  const teamIdByName = useMemo(() => {
    const map: Record<string, number> = { ...fallbackTeamIdByName };

    teamsData?.forEach((team: any) => {
      map[normalizeTeamName(team.name)] = team.id;
      map[team.name] = team.id;
    });

    return map;
  }, [teamsData]);

  const grupos2026Dinamico = useMemo(() => {
    if (!matches2026 || !teamsData) return [];

    const teamMap: Record<number, any> = {};
    teamsData.forEach((t: any) => {
      teamMap[t.id] = { ...t, name: normalizeTeamName(t.name) };
    });

    const disciplineMap: Record<string, any> = {};
    disciplineData?.forEach((d: any) => {
      disciplineMap[`${d.group}-${d.teamId}`] = d;
    });

    const groups: Record<string, any> = {};

    matches2026.forEach((m: any) => {
      if (!m.group || m.phase !== "Fase de Grupos") return;

      if (!groups[m.group]) groups[m.group] = {};

      [m.homeTeamId, m.awayTeamId].forEach((id) => {
        if (!groups[m.group][id]) {
          const discipline = disciplineMap[`${m.group}-${id}`];

          groups[m.group][id] = {
            pld: 0,
            w: 0,
            d: 0,
            l: 0,
            gf: 0,
            ga: 0,
            pts: 0,
            awayGoals: 0,
            teamId: id,
            redCards: discipline?.redCards ?? 0,
            yellowCards: discipline?.yellowCards ?? 0,
          };
        }
      });

      if (
        m.status === "completed" &&
        m.homeScore !== null &&
        m.homeScore !== undefined &&
        m.awayScore !== null &&
        m.awayScore !== undefined
      ) {
        const h = groups[m.group][m.homeTeamId];
        const a = groups[m.group][m.awayTeamId];

        h.pld++;
        a.pld++;

        h.gf += m.homeScore;
        h.ga += m.awayScore;
        a.gf += m.awayScore;
        a.ga += m.homeScore;

        a.awayGoals += m.awayScore;

        if (m.homeScore > m.awayScore) {
          h.w++;
          h.pts += 3;
          a.l++;
        } else if (m.homeScore < m.awayScore) {
          a.w++;
          a.pts += 3;
          h.l++;
        } else {
          h.d++;
          h.pts++;
          a.d++;
          a.pts++;
        }
      }
    });

    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        name: `GRUPO ${letter}`,
        teams: aplicarDesempateConmebol(
          Object.values(groups[letter]),
          matches2026,
          letter,
        ).map((t: any, i: number) => {
          const team = teamMap[t.teamId];
          const name = team?.name || `Time ID ${t.teamId}`;
          const gd = t.gf - t.ga;

          return {
            ...t,
            gd,
            pos: i + 1,
            name,
            qualified:
              i < 2 ? "round16" : i === 2 ? "sudamericana" : "eliminated",
          };
        }),
      }));
  }, [matches2026, teamsData, disciplineData]);

  const rankingMundialDinamico = useMemo(() => {
    const mapRanking = new Map<string, any>();
    const backendCountryByName: Record<
      string,
      { code: string; country: string }
    > = {};

    const normalizePhaseName = (phase?: string | null) =>
      String(phase || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const phaseAdvanceOrder = (phase?: string | null) => {
      const normalizedPhase = normalizePhaseName(phase);

      if (
        normalizedPhase.includes("oitavas") ||
        normalizedPhase.includes("round of 16") ||
        normalizedPhase.includes("round16")
      ) {
        return 1;
      }

      if (
        normalizedPhase.includes("quartas") ||
        normalizedPhase.includes("quarter")
      ) {
        return 2;
      }

      if (
        normalizedPhase.includes("semi") ||
        normalizedPhase.includes("semifinal")
      ) {
        return 3;
      }

      if (normalizedPhase.includes("final")) {
        return 4;
      }

      return 0;
    };

    const isCompletedMatch = (match: any) =>
      match.status === "completed" &&
      match.homeScore !== null &&
      match.homeScore !== undefined &&
      match.awayScore !== null &&
      match.awayScore !== undefined;

    const parseAggregateScore = (agg?: string | null) => {
      const match = String(agg || "").match(/(\d+)\D+(\d+)/);

      if (!match) return null;

      return {
        team1Goals: Number(match[1]),
        team2Goals: Number(match[2]),
      };
    };

    const ensureTeam = (
      teamName: string,
      teamId?: number | null,
      backendCountry?: { code: string; country: string } | null,
    ) => {
      const normalizedName = normalizeTeamName(teamName);
      const currentTeam = mapRanking.get(normalizedName);

      if (currentTeam) {
        currentTeam.teamId =
          currentTeam.teamId || teamId || teamIdByName[normalizedName];
        currentTeam.backendCountry =
          currentTeam.backendCountry || backendCountry || null;
        return currentTeam;
      }

      const newTeam = {
        name: normalizedName,
        teamId: teamId || teamIdByName[normalizedName],
        backendCountry:
          backendCountry ||
          backendCountryByName[normalizedName] ||
          backendCountryByName[teamName] ||
          null,
        points2025: 0,
        points2026: 0,
        matchPoints2025: 0,
        matchPoints2026: 0,
        advancePoints2025: 0,
        advancePoints2026: 0,
        advances2025: new Set<number>(),
        advances2026: new Set<number>(),
        played2025: false,
        played2026: false,
      };

      mapRanking.set(normalizedName, newTeam);
      return newTeam;
    };

    const addMatchPoints = (team: any, season: 2025 | 2026, points: number) => {
      if (season === 2025) {
        team.matchPoints2025 += points;
        team.points2025 += points;
        team.played2025 = true;
      } else {
        team.matchPoints2026 += points;
        team.points2026 += points;
        team.played2026 = true;
      }
    };

    const addAdvance = (
      team: any,
      season: 2025 | 2026,
      advanceOrder: number,
    ) => {
      if (advanceOrder <= 0) return;

      if (season === 2025) {
        team.advances2025.add(advanceOrder);
        team.played2025 = true;
      } else {
        team.advances2026.add(advanceOrder);
        team.played2026 = true;
      }
    };

    const addKnockoutMatch2025 = (
      match: KnockoutMatch,
      winnerAdvanceOrder: number,
    ) => {
      const team1 = ensureTeam(match.team1);
      const team2 = ensureTeam(match.team2);
      const aggregate = parseAggregateScore(match.agg);

      team1.played2025 = true;
      team2.played2025 = true;

      if (aggregate) {
        if (aggregate.team1Goals > aggregate.team2Goals) {
          addMatchPoints(team1, 2025, 3);
        } else if (aggregate.team1Goals < aggregate.team2Goals) {
          addMatchPoints(team2, 2025, 3);
        } else {
          addMatchPoints(team1, 2025, 1);
          addMatchPoints(team2, 2025, 1);
        }
      }

      const winner = ensureTeam(match.winner);
      addAdvance(winner, 2025, winnerAdvanceOrder);
    };

    teamsData?.forEach((team: any) => {
      const backendCountry = getBackendTeamCountry(team);

      if (backendCountry) {
        backendCountryByName[normalizeTeamName(team.name)] = backendCountry;
        backendCountryByName[team.name] = backendCountry;
      }
    });

    rankingData.forEach((team) => {
      ensureTeam(
        team.name,
        teamIdByName[normalizeTeamName(team.name)],
        backendCountryByName[normalizeTeamName(team.name)] ||
          backendCountryByName[team.name] ||
          null,
      );
    });

    grupos2025.forEach((group: any) => {
      group.teams.forEach((team: any) => {
        const rankingTeam = ensureTeam(team.name, team.teamId);

        rankingTeam.played2025 = true;
        rankingTeam.matchPoints2025 += team.pts ?? 0;
        rankingTeam.points2025 += team.pts ?? 0;

        if (team.qualified === "round16" || team.pos <= 2) {
          addAdvance(rankingTeam, 2025, 1);
        }
      });
    });

    oitavas2025.forEach((match) => addKnockoutMatch2025(match, 2));
    quartas2025.forEach((match) => addKnockoutMatch2025(match, 3));
    semis2025.forEach((match) => addKnockoutMatch2025(match, 4));
    addKnockoutMatch2025(final2025, 0);

    if (matches2026 && teamsData) {
      const idMap: Record<number, string> = {};

      teamsData.forEach((team: any) => {
        const normalizedName = normalizeTeamName(team.name);
        const backendCountry = getBackendTeamCountry(team);

        idMap[team.id] = normalizedName;
        ensureTeam(normalizedName, team.id, backendCountry);
      });

      matches2026.forEach((match: any) => {
        const homeName = idMap[match.homeTeamId];
        const awayName = idMap[match.awayTeamId];

        if (!homeName || !awayName) return;

        const homeTeam = ensureTeam(homeName, match.homeTeamId);
        const awayTeam = ensureTeam(awayName, match.awayTeamId);
        const advanceOrder = phaseAdvanceOrder(match.phase);

        homeTeam.played2026 = true;
        awayTeam.played2026 = true;

        addAdvance(homeTeam, 2026, advanceOrder);
        addAdvance(awayTeam, 2026, advanceOrder);

        if (!isCompletedMatch(match)) return;

        if (match.homeScore > match.awayScore) {
          addMatchPoints(homeTeam, 2026, 3);
        } else if (match.homeScore < match.awayScore) {
          addMatchPoints(awayTeam, 2026, 3);
        } else {
          addMatchPoints(homeTeam, 2026, 1);
          addMatchPoints(awayTeam, 2026, 1);
        }
      });
    }

    return Array.from(mapRanking.values())
      .map((team) => {
        const advancePoints2025 = team.advances2025.size * 3;
        const advancePoints2026 = team.advances2026.size * 3;
        let status = "Não pontua em 2026";

        if (team.name === "Flamengo") {
          status = "Classificado";
        } else if (team.played2026) {
          status = "Pontuando na Libertadores 2026";
        }

        return {
          ...team,
          teamId: team.teamId || teamIdByName[team.name],
          status,
          advancePoints2025,
          advancePoints2026,
          points2025: team.matchPoints2025 + advancePoints2025,
          points2026: team.matchPoints2026 + advancePoints2026,
          points:
            team.matchPoints2025 +
            advancePoints2025 +
            team.matchPoints2026 +
            advancePoints2026,
        };
      })
      .filter((team) => team.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 30);
  }, [matches2026, teamsData, teamIdByName]);

  useEffect(() => {
    if (rankingMundialDinamico[0] && onLeaderScoreChange) {
      onLeaderScoreChange(rankingMundialDinamico[0].points);
    }
  }, [rankingMundialDinamico, onLeaderScoreChange]);

  return (
    <div className="w-full max-w-[1500px] mx-auto bg-card rounded-[32px] shadow-2xl overflow-hidden border border-border transition-colors duration-300">
      <div className="bg-slate-950 p-4 flex gap-2 overflow-x-auto border-b border-white/5">
        {(["mundial", "2025", "2026"] as Aba[]).map((aba) => (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all ${
              abaAtiva === aba
                ? aba === "mundial"
                  ? "bg-yellow-500 text-black"
                  : aba === "2025"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            {aba === "mundial" ? "Ranking Mundial 2029" : `Libertadores ${aba}`}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8 bg-card">
        {abaAtiva === "mundial" && (
          <div className="relative overflow-hidden rounded-3xl border border-border bg-slate-950 p-5 md:p-6">
            <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(234,179,8,0.16),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.16),_transparent_50%)]" />

            <div className="relative z-10 mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-200">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  Ranking Mundial 2029
                </div>

                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white md:text-4xl">
                  Top 30 Mundial
                </h2>

                <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Vitória 3 pts · empate 1 pt · avanço de fase 3 pts
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/[0.035] p-2 text-center">
                <div className="rounded-2xl bg-yellow-400/10 px-4 py-3">
                  <div className="text-[9px] font-black uppercase tracking-widest text-yellow-200/70">
                    Líder
                  </div>
                  <div className="mt-1 truncate text-xs font-black text-white">
                    {rankingMundialDinamico[0]?.name ?? "-"}
                  </div>
                </div>

                <div className="rounded-2xl bg-green-400/10 px-4 py-3">
                  <div className="text-[9px] font-black uppercase tracking-widest text-green-200/70">
                    Pontos
                  </div>
                  <div className="mt-1 text-xs font-black text-white">
                    {rankingMundialDinamico[0]?.points ?? 0}
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-400/10 px-4 py-3">
                  <div className="text-[9px] font-black uppercase tracking-widest text-blue-200/70">
                    Clubes
                  </div>
                  <div className="mt-1 text-xs font-black text-white">
                    {rankingMundialDinamico.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 overflow-x-auto">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[76px_minmax(280px,1fr)_260px_140px] items-center gap-4 border-b border-white/10 px-4 pb-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <div className="text-center">Rank</div>
                  <div>Clube</div>
                  <div className="text-center">Status</div>
                  <div className="text-right">Pontos</div>
                </div>

                <div className="mt-3 space-y-2.5">
                  {rankingMundialDinamico.map((club, i) => {
                    const isTopThree = i < 3;
                    const isLeader = i === 0;
                    const isFlamengo = club.name === "Flamengo";

                    return (
                      <div
                        key={club.name}
                        className={`grid grid-cols-[76px_minmax(280px,1fr)_260px_140px] items-center gap-4 rounded-2xl border px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                          isLeader
                            ? "border-yellow-400/35 bg-yellow-400/[0.075] shadow-yellow-500/10 hover:border-yellow-300/60"
                            : isTopThree
                              ? "border-blue-400/20 bg-blue-400/[0.045] hover:border-blue-300/40 hover:shadow-blue-500/10"
                              : isFlamengo
                                ? "border-green-400/25 bg-green-400/[0.055] hover:border-green-300/50 hover:shadow-green-500/10"
                                : "border-slate-700/70 bg-white/[0.025] hover:border-slate-500/80 hover:bg-white/[0.045]"
                        }`}
                      >
                        <div className="flex justify-center">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black italic ${
                              isLeader
                                ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"
                                : isTopThree
                                  ? "bg-blue-400/15 text-blue-200"
                                  : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {i + 1}
                          </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-4">
                          <ClubBadge
                            clubName={club.name}
                            teamId={club.teamId}
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-black uppercase text-white">
                              {club.name}
                            </div>
                            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-blue-400/15 bg-blue-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-blue-200">
                              <img
                                src={`https://flagcdn.com/w40/${getTeamCountryLabel(club.name, club.backendCountry).code}.png`}
                                alt={
                                  getTeamCountryLabel(
                                    club.name,
                                    club.backendCountry,
                                  ).country
                                }
                                className="w-4 h-4 rounded-[3px] border border-white/10 object-cover"
                              />
                              <span>
                                {
                                  getTeamCountryLabel(
                                    club.name,
                                    club.backendCountry,
                                  ).country
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <StatusBadge status={club.status} />
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-flex min-w-[86px] items-center justify-center rounded-2xl px-4 py-2 text-sm font-black shadow-lg ${
                              isLeader
                                ? "bg-yellow-400 text-black shadow-yellow-500/20"
                                : isFlamengo
                                  ? "bg-green-500 text-white shadow-green-500/20"
                                  : "bg-white text-slate-950 shadow-black/10"
                            }`}
                          >
                            {club.points}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === "2025" && (
          <>
            <div className="flex gap-2 mb-6 border-b border-border pb-4">
              <button
                onClick={() => setSubAba("grupos")}
                className={`px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest transition-all ${
                  subAba === "grupos"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                FASE DE GRUPOS
              </button>

              <button
                onClick={() => setSubAba("mata-mata")}
                className={`px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest transition-all ${
                  subAba === "mata-mata"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                MATA-MATA
              </button>
            </div>

            {subAba === "grupos" ? (
              <GroupsBoard groups={grupos2025} showFixtures={false} />
            ) : (
              <Bracket2025 />
            )}
          </>
        )}

        {abaAtiva === "2026" && (
          <>
            {isLoadingMatches ? (
              <div className="text-center py-10 text-muted-foreground italic">
                Sincronizando banco de dados...
              </div>
            ) : matchesError ? (
              <div className="text-center py-10 text-red-500 italic">
                Erro ao buscar jogos de 2026: {matchesError.message}
              </div>
            ) : grupos2026Dinamico.length > 0 ? (
              <GroupsBoard groups={grupos2026Dinamico} matches={matches2026} />
            ) : (
              <div className="text-center py-10 text-muted-foreground italic">
                Nenhum jogo processado para 2026. Verifique se o backend está
                rodando.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
