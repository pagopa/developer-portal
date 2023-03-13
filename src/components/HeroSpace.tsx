import React from 'react';
import { Hero as MUIHero } from '@pagopa/mui-italia';
import { Hero } from '@/domain/product';

const HeroSpace = (props: Hero) => (
  <MUIHero
    title={props.title}
    subtitle={props.subtitle}
    image={props.image.src}
    type={'image'}
    altText={props.image.alt}
    ctaPrimary={{
      title: props.primaryRef.title,
      label: props.primaryRef.title,
      onClick: function noRefCheck() {},
    }}
    ctaSecondary={{
      title: props.secondaryRef.title,
      label: props.secondaryRef.title,
      onClick: function noRefCheck() {},
    }}
  />
);

export default HeroSpace;
