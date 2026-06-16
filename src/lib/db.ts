import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

function readDbEnv() {
  const host = process.env.DB_WRITE_HOST || process.env.DB_HOST;
  const user = process.env.DB_WRITE_USER || process.env.DB_USER;
  const password = process.env.DB_WRITE_PASSWORD ?? process.env.DB_PASSWORD;
  const database = process.env.DB_WRITE_NAME || process.env.DB_NAME;
  const port = Number(process.env.DB_WRITE_PORT || process.env.DB_PORT || 3306);
  const connectionLimit = Number(
    process.env.DB_WRITE_POOL_MAX || process.env.DB_POOL_LIMIT || 5
  );
  return { host, user, password, database, port, connectionLimit };
}

export function isDbConfigured(): boolean {
  const { host, user, password, database } = readDbEnv();
  return Boolean(host && user && password !== undefined && database);
}

function createPool(): mysql.Pool {
  const { host, user, password, database, port, connectionLimit } = readDbEnv();
  if (!host || !user || password === undefined || !database) {
    throw new Error(
      "Variáveis DB_WRITE_* ou DB_HOST, DB_USER, DB_PASSWORD e DB_NAME são obrigatórias."
    );
  }
  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit,
    maxIdle: 5000,
    enableKeepAlive: true,
    connectTimeout: 15000,
  });
}

export function getPool(): mysql.Pool {
  if (!globalForMysql.mysqlPool) {
    globalForMysql.mysqlPool = createPool();
  }
  return globalForMysql.mysqlPool;
}
