// Problem: https://github.com/char0n/swagger-ui-nextjs/issues/1
// Applied Solution: https://github.com/swagger-api/swagger-ui/issues/8245#issuecomment-1719034039

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Undici = require('next/dist/compiled/undici');

// eslint-disable-next-line functional/no-expression-statements, functional/immutable-data, no-undef
globalThis.File = globalThis.File ?? Undici.File;
