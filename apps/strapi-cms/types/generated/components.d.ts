import type { Schema, Attribute } from '@strapi/strapi';

export interface CommonLinks extends Schema.Component {
  collectionName: 'components_common_links';
  info: {
    displayName: 'Links';
    icon: 'link';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
    href: Attribute.String & Attribute.Required;
    target: Attribute.Enumeration<['_self', '_blank', '_parent', '_top']>;
  };
}

export interface CommonRelatedLinks extends Schema.Component {
  collectionName: 'components_common_related_links';
  info: {
    displayName: 'RelatedLinks';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    links: Attribute.Component<'common.links', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'common.links': CommonLinks;
      'common.related-links': CommonRelatedLinks;
    }
  }
}
