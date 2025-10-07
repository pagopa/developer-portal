// markdoc/schema/stepper.ts
import Markdoc, { Schema, Tag } from '@markdoc/markdoc';
import { ReactNode } from 'react';

// Prop types for your React components
export type SteppersProps<A> = {
  readonly children: A;
};

export type StepperProps<A> = {
  readonly title: string;
  readonly children: A;
  // This prop is injected by the parent Steppers component, not from Markdoc
  readonly stepNumber?: number;
};

/**
 * Schema for the container tag: {% steppers %}
 */
export const steppers: Schema = {
  render: 'Steppers',
  // Good practice to define which tags are allowed as direct children
  children: ['stepper'],
  transform(node, config) {
    const children = node.transformChildren(config);
    return new Markdoc.Tag('Steppers', {}, children);
  },
};

/**
 * Schema for the item tag: {% stepper title="..." %}
 */
export const stepper: Schema = {
  render: 'Stepper',
  // Defines the content model for what's inside a stepper
  children: ['paragraph', 'list', 'code', 'heading', 'blockquote'],
  attributes: {
    title: {
      type: String,
      required: true,
    },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Markdoc.Tag('Stepper', attributes, children);
  },
};
