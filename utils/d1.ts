/**
 * D1 Database Helper
 * Provides a unified interface for D1 database queries
 * Works with Cloudflare Pages/Workers D1 bindings or Worker API
 */

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }>;
}

export interface D1Result {
  success: boolean;
  meta: {
    changes: number;
    last_row_id: number;
    duration: number;
  };
}

export interface D1ExecResult {
  success: boolean;
  meta: {
    duration: number;
  };
}

/**
 * D1 Query Client - abstracts database access
 * Can work with direct D1 binding or Worker API
 */
export class D1Client {
  private db: D1Database | null = null;
  private workerUrl: string | null = null;

  constructor(db?: D1Database) {
    if (db) {
      this.db = db;
    } else {
      // Try to get D1 from runtime context
      if (typeof (globalThis as any).getRequestContext === 'function') {
        const ctx = (globalThis as any).getRequestContext();
        this.db = ctx?.env?.DB || null;
      }

      // Fallback: check process.env
      if (!this.db && (process.env as any).DB) {
        this.db = (process.env as any).DB;
      }

      // If no direct DB access, use Worker API
      if (!this.db) {
        this.workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL ||
          'https://pashtobiblesearch.workers.dev';
      }
    }
  }

  /**
   * Execute a SELECT query and return results
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.db) {
      try {
        let stmt = this.db.prepare(sql);
        if (params.length > 0) {
          stmt = stmt.bind(...params);
        }
        const result = await stmt.all<T>();
        return result.results || [];
      } catch (error) {
        console.warn(`D1 query error:`, error);
        return [];
      }
    }

    // Fallback: query via Worker API (if available)
    if (this.workerUrl) {
      // For now, return empty array - Worker API queries need to be implemented
      // or use the existing cloudflare-d1.ts functions
      return [];
    }

    return [];
  }

  /**
   * Execute a SELECT query and return first result
   */
  async queryFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    if (this.db) {
      try {
        let stmt = this.db.prepare(sql);
        if (params.length > 0) {
          stmt = stmt.bind(...params);
        }
        return await stmt.first<T>();
      } catch (error) {
        console.warn(`D1 query error:`, error);
        return null;
      }
    }

    return null;
  }

  /**
   * Get all rows from a table with optional filtering
   */
  async select(
    table: string,
    options: {
      where?: Record<string, any>;
      orderBy?: string;
      orderDirection?: 'ASC' | 'DESC';
      limit?: number;
    } = {}
  ): Promise<any[]> {
    let sql = `SELECT * FROM ${table}`;
    const params: any[] = [];

    if (options.where && Object.keys(options.where).length > 0) {
      const conditions = Object.entries(options.where).map(([key, value], idx) => {
        params.push(value);
        return `${key} = ?`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
      if (options.orderDirection) {
        sql += ` ${options.orderDirection}`;
      }
    }

    if (options.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);
    }

    return this.query(sql, params);
  }
}

/**
 * Get D1 database instance from environment
 * For Cloudflare Pages/Workers, this comes from the runtime context
 */
export function getD1Database(): D1Database | null {
  // In Cloudflare Pages/Workers, D1 is available via getRequestContext
  if (typeof (globalThis as any).getRequestContext === 'function') {
    const ctx = (globalThis as any).getRequestContext();
    return ctx?.env?.DB || null;
  }

  // Fallback: check if DB is available on process.env (for development)
  if ((process.env as any).DB) {
    return (process.env as any).DB;
  }

  return null;
}

/**
 * Helper to execute a SELECT query and return results
 */
export async function queryD1<T = any>(
  db: D1Database,
  sql: string,
  params: any[] = []
): Promise<T[]> {
  try {
    let stmt = db.prepare(sql);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    const result = await stmt.all<T>();
    return result.results || [];
  } catch (error) {
    console.warn(`D1 query error:`, error);
    return [];
  }
}

/**
 * Helper to execute a SELECT query and return first result
 */
export async function queryD1First<T = any>(
  db: D1Database,
  sql: string,
  params: any[] = []
): Promise<T | null> {
  try {
    let stmt = db.prepare(sql);
    if (params.length > 0) {
      stmt = stmt.bind(...params);
    }
    return await stmt.first<T>();
  } catch (error) {
    console.warn(`D1 query error:`, error);
    return null;
  }
}
