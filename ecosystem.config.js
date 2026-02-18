module.exports = {
  apps: [
    {
      name: 'bussells-backend',
      script: './server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'bussells-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
    },
  ],
};
