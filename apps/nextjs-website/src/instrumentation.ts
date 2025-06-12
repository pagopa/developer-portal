import { registerOTel } from '@vercel/otel';

export function register() {
  const telemetry = registerOTel({ serviceName: 'next-app' });
}
