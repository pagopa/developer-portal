import { registerOTel } from '@vercel/otel';
import { AWSXRayPropagator } from '@opentelemetry/propagator-aws-xray';
import { AlwaysOnSampler } from '@opentelemetry/core';



export function register() {
  const telemetry = registerOTel({
    serviceName: 'next-app',
    propagators: [new AWSXRayPropagator()],
    traceSampler: new AlwaysOnSampler(),
  });
}
