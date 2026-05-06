import { z } from "zod";
import mysql from "mysql2/promise";
import { normalizeTeamName, clubLogos } from "../client/src/utils/teamUtils";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

const CURRENT_SEASON = 2026;

let _pool: mysql.Pool | null = null;

function getPool() {
  if (!_pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
    _pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return _pool;
}

async function queryRows<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const [rows] = await getPool().query(query, params);
  return rows as T[];
}

function aplicarDesempateConmebol(times: any[], matches: any[]) {
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
          ids.includes(m.homeTeamId) &&
          ids.includes(m.awayTeamId) &&
          m.status === "completed" &&
          m.homeScore !== null &&
          m.awayScore !== null
      );

      const mini: Record<number, { pts: number; sg: number; gm: number }> = {};
      ids.forEach((id) => (mini[id] = { pts: 0, sg: 0, gm: 0 }));

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
        if ((b.awayGoals ?? 0) !== (a.awayGoals ?? 0)) return (b.awayGoals ?? 0) - (a.awayGoals ?? 0);
        if ((a.redCards ?? 0) !== (b.redCards ?? 0)) return (a.redCards ?? 0) - (b.redCards ?? 0);
        if ((a.yellowCards ?? 0) !== (b.yellowCards ?? 0)) return (a.yellowCards ?? 0) - (b.yellowCards ?? 0);

        return 0;
      });

      resultado.push(...grupo);
    });

  return resultado;
}

export const libertadoresRouter = router({
  teams: router({
    list: publicProcedure.query(async () => await db.getAllTeams()),
  }),

  matches: router({
    list: publicProcedure
      .input(z.object({ season: z.number().default(CURRENT_SEASON) }))
      .query(async ({ input }) => await db.getMatchesBySeason(input.season)),

    byPhase: publicProcedure
      .input(z.object({ season: z.number().default(CURRENT_SEASON), phase: z.string() }))
      .query(async ({ input }) => await db.getMatchesByPhase(input.season, input.phase)),

    create: publicProcedure
      .input(
        z.object({
          season: z.number().default(CURRENT_SEASON),
          phase: z.string(),
          group: z.string().optional(),
          homeTeamId: z.number(),
          awayTeamId: z.number(),
          matchDate: z.date(),
        })
      )
      .mutation(async ({ input }) => {
        await getPool().query(
          `
          INSERT INTO matches (
            season,
            phase,
            \`group\`,
            homeTeamId,
            awayTeamId,
            homeScore,
            awayScore,
            status,
            matchDate
          )
          VALUES (?, ?, ?, ?, ?, NULL, NULL, 'scheduled', ?)
          `,
          [
            input.season,
            input.phase,
            input.group || null,
            input.homeTeamId,
            input.awayTeamId,
            input.matchDate,
          ]
        );

        return { success: true };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          homeScore: z.number().nullable().optional(),
          awayScore: z.number().nullable().optional(),
          status: z.enum(["scheduled", "in_progress", "completed"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const fields: string[] = [];
        const params: any[] = [];

        if ("homeScore" in input) {
          fields.push("homeScore = ?");
          params.push(input.homeScore ?? null);
        }

        if ("awayScore" in input) {
          fields.push("awayScore = ?");
          params.push(input.awayScore ?? null);
        }

        if ("status" in input) {
          fields.push("status = ?");
          params.push(input.status ?? null);
        }

        if (fields.length === 0) {
          return { success: true };
        }

        params.push(input.id);

        await getPool().query(
          `
          UPDATE matches
          SET ${fields.join(", ")}
          WHERE id = ?
          `,
          params
        );

        return { success: true };
      }),
  }),

  discipline: router({
    list: publicProcedure
      .input(z.object({ season: z.number().default(CURRENT_SEASON) }))
      .query(async ({ input }) => {
        return await queryRows(
          `
          SELECT id, season, \`group\`, teamId, yellowCards, redCards, createdAt, updatedAt
          FROM teamDiscipline
          WHERE season = ?
          ORDER BY \`group\`, teamId
          `,
          [input.season]
        );
      }),

    upsert: publicProcedure
      .input(
        z.object({
          season: z.number().default(CURRENT_SEASON),
          group: z.string(),
          teamId: z.number(),
          yellowCards: z.number().default(0),
          redCards: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        await getPool().query(
          `
          INSERT INTO teamDiscipline (season, \`group\`, teamId, yellowCards, redCards)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          yellowCards = VALUES(yellowCards),
          redCards = VALUES(redCards),
          updatedAt = CURRENT_TIMESTAMP
          `,
          [input.season, input.group, input.teamId, input.yellowCards, input.redCards]
        );

        return { success: true };
      }),
  }),

  ranking: router({
    current: publicProcedure
      .input(z.object({ season: z.number().default(CURRENT_SEASON) }))
      .query(async ({ input }) => await db.getRankingBySeason(input.season)),

    dynamicGroupRanking: publicProcedure
      .input(z.object({ season: z.number() }))
      .query(async ({ input }) => {
        const matches = await db.getMatchesBySeason(input.season);
        const teamsData = await db.getAllTeams();

        const teamMap: Record<number, any> = {};
        teamsData.forEach((t: any) => {
          teamMap[t.id] = { ...t, name: normalizeTeamName(t.name) };
        });

        const disciplineRows = await queryRows(
          `SELECT season, \`group\`, teamId, yellowCards, redCards FROM teamDiscipline WHERE season = ?`,
          [input.season]
        );

        const disciplineMap: Record<string, any> = {};
        disciplineRows.forEach((d: any) => {
          disciplineMap[`${d.group}-${d.teamId}`] = d;
        });

        const groups: Record<string, any> = {};

        matches.forEach((m: any) => {
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

          if (m.status === "completed" && m.homeScore !== null && m.awayScore !== null) {
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
              matches.filter((m: any) => m.group === letter)
            ).map((t: any, i: number) => ({
              ...t,
              gd: t.gf - t.ga,
              pos: i + 1,
              name: teamMap[t.teamId]?.name ?? `Time ID ${t.teamId}`,
              logo: clubLogos[teamMap[t.teamId]?.name],
              qualified: i < 2 ? "round16" : i === 2 ? "sudamericana" : "eliminated",
            })),
          }));
      }),
  }),
});