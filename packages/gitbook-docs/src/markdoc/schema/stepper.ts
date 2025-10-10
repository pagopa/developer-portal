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
 * Schema for the container tag: {% stepper %}
 */
export const stepper: Schema = {
  render: 'Stepper',
  // This should be 'step', listing the allowed child tags.
  children: ['Step'],
  transform(node, config) {
    // We find all direct children that are 'step' tags and add an index.
    // eslint-disable-next-line functional/no-let
    let stepIndex = 0;
    // eslint-disable-next-line functional/no-loop-statements
    for (const child of node.children) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (child.type === 'Step') {
        // Mutate the child node to add the index to its attributes.
        // eslint-disable-next-line functional/immutable-data,functional/no-expression-statements
        child.attributes.index = stepIndex;
        // eslint-disable-next-line functional/no-expression-statements
        stepIndex++;
      }
    }

    const children = node.transformChildren(config);
    return new Markdoc.Tag('Stepper', {}, children); // This was 'Steppers' in your example, adjust if needed.
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
