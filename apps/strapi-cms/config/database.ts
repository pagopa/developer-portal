import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const connections = {
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          '..',
          '..',
          env('DATABASE_FILENAME', '.tmp/data.db')
        ),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
