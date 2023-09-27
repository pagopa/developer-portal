import path from 'path';

// @ts-expect-error
export default ({ env }) => {
  return {
    connection: {
      client: env('DATABASE_CLIENT', 'sqlite'),
      connection: {
        filename: path.join(
          __dirname,
          '..',
          '..',
          env('DATABASE_FILENAME', '.tmp/data.db')
        ),
      },
      useNullAsDefault: true,
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
