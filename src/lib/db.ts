import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

function createPool(): mysql.Pool {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  if (!host || !user || password === undefined || !database) {
    throw new Error("Variáveis DB_HOST, DB_USER, DB_PASSWORD e DB_NAME são obrigatórias.");
  }
  return mysql.createPool({
    host,
    port: Number(process.env.DB_PORT || 3306),
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_LIMIT || 5),
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
