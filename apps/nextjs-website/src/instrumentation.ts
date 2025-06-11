import { registerOTel } from '@vercel/otel';

export function register() {
  // prettier-ignore
  registerOTel({ serviceName: 'next-app' });
}
