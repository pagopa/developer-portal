import React from 'react';
import { Hero } from '@pagopa/mui-italia';
import { CTA } from '@pagopa/mui-italia/dist/types';

type ImageProps = {
  src: string;
  altText: string;
};

type HeroSpaceProps = {
  title: string;
  description: string;
  image?: ImageProps;
  // We are using an array of two elements, because we want to render two buttons. Let's evaluate if we need another type instead of using CTA.
  buttons?: [CTA, CTA];
};

const HeroSpace = (props: HeroSpaceProps) => (
  <Hero
    title={props.title}
    subtitle={props.description}
    {...(props.image
      ? {
          image: props.image.src,
          type: 'image',
          altText: props.image.altText,
        }
      : {
          type: 'text',
        })}
    ctaPrimary={props.buttons && props.buttons[0]}
    ctaSecondary={props.buttons && props.buttons[1]}
  />
);

export default HeroSpace;
