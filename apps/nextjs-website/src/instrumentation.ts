import { registerOTel } from '@vercel/otel';
import { AWSXRayPropagator } from '@opentelemetry/propagator-aws-xray';

export function register() {
  const telemetry = registerOTel({
    serviceName: 'next-app',
    propagators: [new AWSXRayPropagator()],
  });
}
