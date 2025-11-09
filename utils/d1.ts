/**
 * Lightweight helpers for interacting with Cloudflare D1 bindings.
 * The functions here intentionally avoid importing any Cloudflare-specific
 * packages so they can run in both Node.js (Vercel) and Edge runtimes.
 */

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[]; success?: boolean } | T[]>;
  raw<T = unknown>(): Promise<T[] | undefined>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<any>;
}

let cachedDb: D1Database | null = null;

function resolveD1Binding(): D1Database | null {
  if (cachedDb) {
    return cachedDb;
  }

  const globalAny = globalThis as any;

  if (globalAny.__D1_DB) {
    cachedDb = globalAny.__D1_DB as D1Database;
    return cachedDb;
  }

  if (globalAny.env?.DB) {
    cachedDb = globalAny.env.DB as D1Database;
    globalAny.__D1_DB = cachedDb;
    return cachedDb;
  }

  if ((process.env as any)?.DB) {
    cachedDb = (process.env as any).DB as D1Database;
    globalAny.__D1_DB = cachedDb;
    return cachedDb;
  }

  return null;
}

export function setD1Database(db: D1Database | null) {
  const globalAny = globalThis as any;
  cachedDb = db;
  if (db) {
    globalAny.__D1_DB = db;
  } else if (globalAny.__D1_DB) {
    delete globalAny.__D1_DB;
  }
}

export function getD1Database(): D1Database | null {
  return resolveD1Binding();
}

function bindStatement(stmt: D1PreparedStatement, params: any[]): D1PreparedStatement {
  if (!params || params.length === 0) {
    return stmt;
  }
  return stmt.bind(...params);
}

function normaliseResults<T>(value: any): T[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value.results && Array.isArray(value.results)) {
    return value.results as T[];
  }

  return [];
}

export async function queryD1<T = any>(db: D1Database, sql: string, params: any[] = []): Promise<T[]> {
  try {
    const stmt = bindStatement(db.prepare(sql), params);

    if (typeof stmt.raw === 'function') {
      const raw = await stmt.raw<T>();
      const normalised = normaliseResults<T>(raw);
      if (normalised.length > 0) {
        return normalised;
      }
      if (Array.isArray(raw)) {
        return raw as T[];
      }
    }

    const allResult = await stmt.all<T>();
    const normalised = normaliseResults<T>(allResult);
    if (normalised.length > 0) {
      return normalised;
    }

    if (typeof stmt.first === 'function') {
      const first = await stmt.first<T>();
      return first ? [first] : [];
    }
  } catch (error) {
    console.warn('D1 query failed:', error);
  }

  return [];
}

export async function queryD1First<T = any>(db: D1Database, sql: string, params: any[] = []): Promise<T | null> {
  const results = await queryD1<T>(db, sql, params);
  return results.length > 0 ? results[0] : null;
}

export class D1Client {
  private readonly db: D1Database;

  constructor(database: D1Database) {
    this.db = database;
  }

  prepare(query: string, params: any[] = []): D1PreparedStatement {
    return bindStatement(this.db.prepare(query), params);
  }

  async query<T = any>(query: string, params: any[] = []): Promise<T[]> {
    return queryD1<T>(this.db, query, params);
  }

  async queryFirst<T = any>(query: string, params: any[] = []): Promise<T | null> {
    return queryD1First<T>(this.db, query, params);
  }

  async exec(query: string): Promise<any> {
    return this.db.exec(query);
  }
}

export function ensureD1(): D1Database {
  const db = getD1Database();
  if (!db) {
    throw new Error('Cloudflare D1 database is not configured');
  }
  return db;
}
