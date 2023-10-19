import type { Schema, Attribute } from '@strapi/strapi';

export interface HeroHeroSwiper extends Schema.Component {
  collectionName: 'components_hero_hero_swipers';
  info: {
    displayName: 'HeroSwiper';
    icon: 'dashboard';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    ctaLabel: Attribute.String;
    ctaLink: Attribute.String;
  };
}

export interface LinksLinksList extends Schema.Component {
  collectionName: 'components_links_links_lists';
  info: {
    displayName: 'LinksList';
    icon: 'bulletList';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    url: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'hero.hero-swiper': HeroHeroSwiper;
      'links.links-list': LinksLinksList;
    }
  }
}
