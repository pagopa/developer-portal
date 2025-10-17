// markdoc/schema/stepper.ts
import Markdoc, { Schema } from '@markdoc/markdoc';

export type StepperProps<A> = {
  readonly children: A;
};

export type StepProps<A> = {
  readonly children: A;
  readonly title?: string;
  readonly stepNumber?: number;
};

/**
 * Schema for the container tag: {% stepper %}
 */
export const stepper: Schema = {
  render: 'Stepper',
  // This should be 'step', listing the allowed child tags.
  children: ['step'],
  transform(node, config) {
    const children = node.transformChildren(config);
    return new Markdoc.Tag('Stepper', {}, children);
  },
};

/**
 * Schema for the item tag: {% step %}
 */
export const step: Schema = {
  render: 'Step',
  // Defines the content model for what's inside a stepper
  children: ['paragraph', 'list', 'code', 'heading', 'blockquote'],
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Markdoc.Tag('Step', attributes, children);
  },
};
