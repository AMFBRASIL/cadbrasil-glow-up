/** PM2 / aaPanel — produção Next.js */
module.exports = {
  apps: [
    {
      name: "cadbrasil-glow-up",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3015",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "1024M",
      env: {
        NODE_ENV: "production",
        PORT: 3015,
      },
    },
  ],
};
