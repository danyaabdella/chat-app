module.exports = {
    apps: [
      {
        name: 'chat-backend',
        script: 'dist/main.js',
        instances: 'max', // Use all available CPU cores
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production',
          PORT: 3000,
          DATABASE_URL: 'postgresql://chatuser:chat-app@localhost:5432',
          REDIS_HOST: 'redis',
          REDIS_PORT: 6379,
          FRONTEND_URL: 'http://localhost:3001',
        },
      },
    ],
  };
