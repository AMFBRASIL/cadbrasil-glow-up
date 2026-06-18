/** PM2 / aaPanel — produção Next.js (Vercel não usa este arquivo) */
const path = require("path");

const appRoot = __dirname;
const port = process.env.PORT || "3015";
/** Node do aaPanel — ajuste se a versão no painel for outra */
const nodeBin =
  process.env.AAPANEL_NODE_BIN || "/www/server/nodejs/v22.13.1/bin/node";

module.exports = {
  apps: [
    {
      name: "cadbrasil-glow-up",
      cwd: appRoot,
      script: path.join(appRoot, "node_modules/next/dist/bin/next"),
      interpreter: nodeBin,
      args: ["start", "-p", String(port)],
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "1024M",
      error_file: path.join(appRoot, "logs/pm2-error.log"),
      out_file: path.join(appRoot, "logs/pm2-out.log"),
      merge_logs: true,
      env: {
        NODE_ENV: "production",
        PORT: port,
      },
    },
  ],
};
