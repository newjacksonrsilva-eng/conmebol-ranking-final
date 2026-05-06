import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  InsertUser,
  users,
  Team,
  InsertTeam,
  teams,
  TeamPoints,
  InsertTeamPoints,
  teamPoints,
  Match,
  InsertMatch,
  matches,
  SyncLog,
  InsertSyncLog,
  syncLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }

  return _db;
}

function getPool() {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    _pool = mysql.createPool(process.env.DATABASE_URL);
  }

  return _pool;
}

async function queryRows<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.query(query, params);
  return rows as T[];
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== TEAMS ==========

export async function getAllTeams() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(teams);
}

export async function getTeamById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTeamByName(name: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(teams).where(eq(teams.name, name)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTeam(data: InsertTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(teams).values(data);
}

export async function upsertTeam(data: InsertTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(teams).values(data).onDuplicateKeyUpdate({
    set: {
      country: data.country,
      espnId: data.espnId,
    },
  });
}

// ========== TEAM POINTS ==========

export async function getTeamPoints(teamId: number, season: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(teamPoints)
    .where(and(eq(teamPoints.teamId, teamId), eq(teamPoints.season, season)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getRankingBySeason(season: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(teamPoints)
    .where(eq(teamPoints.season, season))
    .orderBy(desc(teamPoints.totalPoints));
}

export async function createTeamPoints(data: InsertTeamPoints) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(teamPoints).values(data);
}

export async function updateTeamPoints(id: number, data: Partial<TeamPoints>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(teamPoints).set(data).where(eq(teamPoints.id, id));
}

// ========== MATCHES ==========

export async function getMatchesBySeason(season: number) {
  return await queryRows(
    `
    SELECT
      id,
      espnId,
      season,
      phase,
      \`group\`,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status,
      matchDate,
      homeTeamPoints,
      awayTeamPoints,
      processed,
      createdAt,
      updatedAt
    FROM matches
    WHERE season = ?
    ORDER BY matchDate DESC
    `,
    [season]
  );
}

export async function getMatchesByPhase(season: number, phase: string) {
  return await queryRows(
    `
    SELECT
      id,
      espnId,
      season,
      phase,
      \`group\`,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status,
      matchDate,
      homeTeamPoints,
      awayTeamPoints,
      processed,
      createdAt,
      updatedAt
    FROM matches
    WHERE season = ?
      AND phase = ?
    ORDER BY matchDate DESC
    `,
    [season, phase]
  );
}

export async function getUnprocessedMatches(season: number) {
  return await queryRows(
    `
    SELECT
      id,
      espnId,
      season,
      phase,
      \`group\`,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status,
      matchDate,
      homeTeamPoints,
      awayTeamPoints,
      processed,
      createdAt,
      updatedAt
    FROM matches
    WHERE season = ?
      AND processed = 0
      AND status = 'completed'
    `,
    [season]
  );
}

export async function createMatch(data: InsertMatch) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(matches).values(data);
}

export async function updateMatch(id: number, data: Partial<Match>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(matches).set(data).where(eq(matches.id, id));
}

export async function getMatchById(id: number) {
  const rows = await queryRows(
    `
    SELECT
      id,
      espnId,
      season,
      phase,
      \`group\`,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      status,
      matchDate,
      homeTeamPoints,
      awayTeamPoints,
      processed,
      createdAt,
      updatedAt
    FROM matches
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows.length > 0 ? rows[0] : undefined;
}

// ========== SYNC LOG ==========

export async function createSyncLog(data: InsertSyncLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(syncLog).values(data);
}

export async function getLastSync(source: string, season: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(syncLog)
    .where(and(eq(syncLog.source, source), eq(syncLog.season, season)))
    .orderBy(desc(syncLog.lastSyncTime))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}