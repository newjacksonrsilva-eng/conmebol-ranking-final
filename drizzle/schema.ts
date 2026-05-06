import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de times - armazena informações dos clubes
 */
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  country: varchar("country", { length: 100 }).notNull(),
  espnId: varchar("espnId", { length: 100 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Tabela de pontos - armazena pontos de cada time no ranking
 */
export const teamPoints = mysqlTable("teamPoints", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  season: int("season").notNull(), // 2025, 2026, etc
  totalPoints: int("totalPoints").default(0).notNull(),
  wins: int("wins").default(0).notNull(),
  draws: int("draws").default(0).notNull(),
  losses: int("losses").default(0).notNull(),
  gamesPlayed: int("gamesPlayed").default(0).notNull(),
  phaseAdvances: int("phaseAdvances").default(0).notNull(), // Número de fases avançadas
  status: mysqlEnum("status", ["qualified", "active", "eliminated"]).default("active").notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamPoints = typeof teamPoints.$inferSelect;
export type InsertTeamPoints = typeof teamPoints.$inferInsert;

/**
 * Tabela de jogos - armazena todos os jogos da Libertadores
 */
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  espnId: varchar("espnId", { length: 100 }).unique(),
  season: int("season").notNull(), // 2025, 2026, etc
  phase: varchar("phase", { length: 100 }).notNull(), // "Fase de Grupos", "Oitavas", etc
  group: varchar("group", { length: 10 }), // "A", "B", etc (para fase de grupos)
  homeTeamId: int("homeTeamId").notNull(),
  awayTeamId: int("awayTeamId").notNull(),
  homeScore: int("homeScore"),
  awayScore: int("awayScore"),
  status: varchar("status", { length: 50 }).notNull(), // "scheduled", "in_progress", "completed"
  matchDate: timestamp("matchDate").notNull(),
  homeTeamPoints: int("homeTeamPoints").default(0), // Pontos ganhos pelo time da casa
  awayTeamPoints: int("awayTeamPoints").default(0), // Pontos ganhos pelo time visitante
  processed: boolean("processed").default(false).notNull(), // Se os pontos já foram processados
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

/**
 * Tabela de sincronização - rastreia última atualização da API
 */
export const syncLog = mysqlTable("syncLog", {
  id: int("id").autoincrement().primaryKey(),
  source: varchar("source", { length: 100 }).notNull(), // "espn", "sofascore", etc
  season: int("season").notNull(),
  lastSyncTime: timestamp("lastSyncTime").notNull(),
  matchesUpdated: int("matchesUpdated").default(0).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // "success", "failed", "partial"
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SyncLog = typeof syncLog.$inferSelect;
export type InsertSyncLog = typeof syncLog.$inferInsert;



