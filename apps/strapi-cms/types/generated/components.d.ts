import type { Attribute, Schema } from '@strapi/strapi';

export interface ApiApiRestDetail extends Schema.Component {
  collectionName: 'components_api_api_rest_details';
  info: {
    description: '';
    displayName: 'ApiRestDetail';
  };
  attributes: {
    slug: Attribute.String & Attribute.Required;
    specUrls: Attribute.Component<'api.spec-urls', true> &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface ApiApiSoapDetail extends Schema.Component {
  collectionName: 'components_api_api_soap_details';
  info: {
    description: '';
    displayName: 'ApiSoapDetail';
    icon: 'chartBubble';
  };
  attributes: {
    branch: Attribute.String & Attribute.Required;
    dirName: Attribute.String & Attribute.Required;
    repositoryPath: Attribute.String;
    repositoryUrl: Attribute.String & Attribute.Required;
    slug: Attribute.String & Attribute.Required;
  };
}

export interface ApiSpecUrls extends Schema.Component {
  collectionName: 'components_api_spec_urls';
  info: {
    displayName: 'specUrls';
  };
  attributes: {
    hideTryIt: Attribute.Boolean & Attribute.DefaultTo<true>;
    name: Attribute.String;
    url: Attribute.String & Attribute.Required;
  };
}

export interface CommonBannerLink extends Schema.Component {
  collectionName: 'components_banner_links_banner_link';
  info: {
    description: '';
    displayName: 'bannerLink';
    icon: 'file';
  };
  attributes: {
    content: Attribute.Blocks;
    icon: Attribute.Media<'images'> & Attribute.Required;
    theme: Attribute.Enumeration<['light', 'dark']> &
      Attribute.Required &
      Attribute.DefaultTo<'light'>;
    title: Attribute.String;
  };
}

export interface CommonCallToAction extends Schema.Component {
  collectionName: 'components_common_call_to_actions';
  info: {
    description: '';
    displayName: 'CallToAction';
  };
  attributes: {
    link: Attribute.Component<'common.link'> & Attribute.Required;
    variant: Attribute.Enumeration<['text', 'contained', 'outlined']>;
  };
}

export interface CommonCardProps extends Schema.Component {
  collectionName: 'components_common_card_props';
  info: {
    description: '';
    displayName: 'cardProps';
    icon: 'bulletList';
  };
  attributes: {
    content: Attribute.Blocks & Attribute.Required;
    image: Attribute.Media<'images'> & Attribute.Required;
    linkHref: Attribute.String & Attribute.Required;
    linkText: Attribute.String & Attribute.Required;
    mobileImage: Attribute.Media<'images'> & Attribute.Required;
    title: Attribute.String & Attribute.Required;
  };
}

export interface CommonCaseHistories extends Schema.Component {
  collectionName: 'components_common_case_histories';
  info: {
    displayName: 'CaseHistories';
    icon: 'bulletList';
  };
  attributes: {
    case_histories: Attribute.Relation<
      'common.case-histories',
      'oneToMany',
      'api::case-history.case-history'
    >;
    description: Attribute.Text;
    title: Attribute.String & Attribute.Required;
  };
}

export interface CommonEcosystem extends Schema.Component {
  collectionName: 'components_ecosystem';
  info: {
    description: '';
    displayName: 'Ecosystem';
    icon: 'file';
  };
  attributes: {
    products: Attribute.Relation<
      'common.ecosystem',
      'oneToMany',
      'api::product.product'
    >;
    productsTabName: Attribute.String & Attribute.Required;
    solutions: Attribute.Relation<
      'common.ecosystem',
      'oneToMany',
      'api::solution.solution'
    >;
    solutionsCta: Attribute.Component<'common.call-to-action'>;
    solutionsTabName: Attribute.String & Attribute.Required;
    title: Attribute.String;
  };
}

export interface CommonFeatures extends Schema.Component {
  collectionName: 'components_common_features';
  info: {
    description: '';
    displayName: 'Features';
  };
  attributes: {
    items: Attribute.Component<'common.banner-link', true> &
      Attribute.SetMinMax<
        {
          max: 4;
          min: 3;
        },
        number
      >;
    subtitle: Attribute.Text;
    title: Attribute.String & Attribute.Required;
  };
}

export interface CommonGuideVersion extends Schema.Component {
  collectionName: 'components_common_guide_versions';
  info: {
    displayName: 'GuideVersion';
    icon: 'attachment';
  };
  attributes: {
    dirName: Attribute.String & Attribute.Required;
    main: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    version: Attribute.String & Attribute.Required;
  };
}

export interface CommonGuidesByCategory extends Schema.Component {
  collectionName: 'components_common_guides_by_categories';
  info: {
    displayName: 'GuidesByCategory';
    icon: 'command';
  };
  attributes: {
    category: Attribute.String & Attribute.Required;
    guides: Attribute.Relation<
      'common.guides-by-category',
      'oneToMany',
      'api::guide.guide'
    >;
  };
}

export interface CommonHeroSlide extends Schema.Component {
  collectionName: 'components_common_hero_slides';
  info: {
    description: '';
    displayName: 'HeroSlide';
  };
  attributes: {
    backgroundImage: Attribute.Media<'images'>;
    callToAction: Attribute.Component<'common.call-to-action'>;
    subhead: Attribute.Blocks;
    subheadColor: Attribute.Enumeration<
      ['contrastText', 'main', 'light', 'dark']
    > &
      Attribute.DefaultTo<'contrastText'>;
    title: Attribute.String;
    titleColor: Attribute.Enumeration<
      ['contrastText', 'main', 'light', 'dark']
    > &
      Attribute.DefaultTo<'contrastText'>;
  };
}

export interface CommonLink extends Schema.Component {
  collectionName: 'components_common_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Attribute.String & Attribute.Required;
    target: Attribute.Enumeration<['_self', '_blank', '_parent', '_top']>;
    text: Attribute.String & Attribute.Required;
  };
}

export interface CommonListItem extends Schema.Component {
  collectionName: 'components_common_list_items';
  info: {
    description: '';
    displayName: 'ListItem';
    icon: 'cube';
  };
  attributes: {
    text: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 70;
        minLength: 1;
      }>;
  };
}

export interface CommonNewsShowcase extends Schema.Component {
  collectionName: 'components_common_news_showcases';
  info: {
    description: '';
    displayName: 'NewsShowcase';
    icon: 'bell';
  };
  attributes: {
    items: Attribute.Relation<
      'common.news-showcase',
      'oneToMany',
      'api::news-item.news-item'
    >;
    link: Attribute.Component<'common.link'>;
    subTitle: Attribute.Text;
    title: Attribute.String & Attribute.Required;
  };
}

export interface CommonQuestionAndAnswer extends Schema.Component {
  collectionName: 'components_common_question_and_answers';
  info: {
    displayName: 'QuestionAndAnswer';
    icon: 'discuss';
  };
  attributes: {
    answer: Attribute.Blocks & Attribute.Required;
    question: Attribute.Text & Attribute.Required;
  };
}

export interface CommonRelatedLinks extends Schema.Component {
  collectionName: 'components_common_related_links';
  info: {
    description: '';
    displayName: 'RelatedLinks';
    icon: 'bulletList';
  };
  attributes: {
    links: Attribute.Component<'common.link', true>;
    title: Attribute.String;
  };
}

export interface CommonResource extends Schema.Component {
  collectionName: 'components_common_resources';
  info: {
    description: '';
    displayName: 'Resource';
    icon: 'arrowRight';
  };
  attributes: {
    description: Attribute.Blocks;
    image: Attribute.Media<'images'>;
    linkHref: Attribute.String & Attribute.Required;
    linkText: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
    title: Attribute.String & Attribute.Required;
  };
}

export interface CommonSolutionStat extends Schema.Component {
  collectionName: 'components_common_solution_stats';
  info: {
    displayName: 'SolutionStat';
    icon: 'chartPie';
  };
  attributes: {
    description: Attribute.Text;
    title: Attribute.String & Attribute.Required;
  };
}

export interface CommonSolutionStep extends Schema.Component {
  collectionName: 'components_common_solution_steps';
  info: {
    displayName: 'SolutionStep';
    icon: 'bulletList';
  };
  attributes: {
    content: Attribute.Blocks & Attribute.Required;
    products: Attribute.Relation<
      'common.solution-step',
      'oneToMany',
      'api::product.product'
    >;
    title: Attribute.String & Attribute.Required;
  };
}

export interface OverviewPostIntegration extends Schema.Component {
  collectionName: 'components_overview_post_integrations';
  info: {
    description: '';
    displayName: 'PostIntegration';
    icon: 'bulletList';
  };
  attributes: {
    description: Attribute.Text & Attribute.Required;
    documents: Attribute.Component<'common.card-props', true>;
    guides: Attribute.Relation<
      'overview.post-integration',
      'oneToMany',
      'api::guide.guide'
    >;
    guidesTitle: Attribute.String;
    link: Attribute.Component<'common.link'>;
    serviceModels: Attribute.Component<'overview.service-model', true> &
      Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    title: Attribute.String & Attribute.Required;
  };
}

export interface OverviewServiceModel extends Schema.Component {
  collectionName: 'components_overview_service_models';
  info: {
    displayName: 'serviceModel';
    icon: 'arrowRight';
  };
  attributes: {
    description: Attribute.Text & Attribute.Required;
    href: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
  };
}

export interface OverviewStartInfo extends Schema.Component {
  collectionName: 'components_overview_start_infos';
  info: {
    description: '';
    displayName: 'StartInfo';
    icon: 'bulletList';
  };
  attributes: {
    description: Attribute.Text & Attribute.Required;
    icon: Attribute.Media<'images'> & Attribute.Required;
    path: Attribute.String & Attribute.Required;
    title: Attribute.String & Attribute.Required;
  };
}

export interface OverviewStartInfoSection extends Schema.Component {
  collectionName: 'components_overview_start_info_sections';
  info: {
    description: '';
    displayName: 'StartInfoSection';
    icon: 'information';
  };
  attributes: {
    bottomLabel: Attribute.Text;
    bottomLink: Attribute.Component<'common.link'>;
    items: Attribute.Component<'overview.start-info', true>;
    title: Attribute.String & Attribute.Required;
  };
}

export interface OverviewTutorialSection extends Schema.Component {
  collectionName: 'components_overview_tutorial_sections';
  info: {
    displayName: 'TutorialSection';
    icon: 'bulletList';
  };
  attributes: {
    description: Attribute.Text & Attribute.Required;
    title: Attribute.String & Attribute.Required;
    tutorials: Attribute.Relation<
      'overview.tutorial-section',
      'oneToMany',
      'api::tutorial.tutorial'
    >;
  };
}

export interface PartsAlert extends Schema.Component {
  collectionName: 'components_parts_alerts';
  info: {
    description: '';
    displayName: 'alert';
    icon: 'bell';
  };
  attributes: {
    severity: Attribute.Enumeration<['success', 'info', 'warning', 'error']> &
      Attribute.Required &
      Attribute.DefaultTo<'info'>;
    text: Attribute.Text;
    title: Attribute.String;
  };
}

export interface PartsApiTester extends Schema.Component {
  collectionName: 'components_parts_api_testers';
  info: {
    description: '';
    displayName: 'apiTester';
    icon: 'cog';
  };
  attributes: {
    requestAttributes: Attribute.Component<'parts.api-tester-attribute', true> &
      Attribute.Required;
    requestCode: Attribute.Component<'parts.code-block'> & Attribute.Required;
    requestDescription: Attribute.Text;
    responseCode: Attribute.Component<'parts.code-block'> & Attribute.Required;
    responseDescription: Attribute.Text;
  };
}

export interface PartsApiTesterAttribute extends Schema.Component {
  collectionName: 'components_parts_api_tester_attributes';
  info: {
    description: '';
    displayName: 'apiTesterAttribute';
    icon: 'connector';
  };
  attributes: {
    label: Attribute.String;
    value: Attribute.String & Attribute.Required;
  };
}

export interface PartsCkEditor extends Schema.Component {
  collectionName: 'components_parts_ck_editors';
  info: {
    description: '';
    displayName: 'ckEditor';
  };
  attributes: {
    content: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
  };
}

export interface PartsCodeBlock extends Schema.Component {
  collectionName: 'components_parts_code_blocks';
  info: {
    description: '';
    displayName: 'codeBlock';
    icon: 'code';
  };
  attributes: {
    code: Attribute.Text & Attribute.Required;
    language: Attribute.Enumeration<
      [
        'oneC (1c)',
        'abnf',
        'accesslog',
        'actionscript',
        'ada',
        'angelscript',
        'apache',
        'applescript',
        'arcade',
        'arduino',
        'armasm',
        'asciidoc',
        'aspectj',
        'autohotkey',
        'autoit',
        'avrasm',
        'awk',
        'axapta',
        'bash',
        'basic',
        'bnf',
        'brainfuck',
        'cLike (c-like)',
        'c',
        'cal',
        'capnproto',
        'ceylon',
        'clean',
        'clojureRepl (clojure-repl)',
        'clojure',
        'cmake',
        'coffeescript',
        'coq',
        'cos',
        'cpp',
        'crmsh',
        'crystal',
        'csharp',
        'csp',
        'css',
        'd',
        'dart',
        'delphi',
        'diff',
        'django',
        'dns',
        'dockerfile',
        'dos',
        'dsconfig',
        'dts',
        'dust',
        'ebnf',
        'elixir',
        'elm',
        'erb',
        'erlangRepl (erlang-repl)',
        'erlang',
        'excel',
        'fix',
        'flix',
        'fortran',
        'fsharp',
        'gams',
        'gauss',
        'gcode',
        'gherkin',
        'glsl',
        'gml',
        'go',
        'golo',
        'gradle',
        'groovy',
        'haml',
        'handlebars',
        'haskell',
        'haxe',
        'hsp',
        'htmlbars',
        'http',
        'hy',
        'inform7',
        'ini',
        'irpf90',
        'isbl',
        'java',
        'javascript',
        'jbossCli (jboss-cli)',
        'json',
        'juliaRepl (julia-repl)',
        'julia',
        'kotlin',
        'lasso',
        'latex',
        'ldif',
        'leaf',
        'less',
        'lisp',
        'livecodeserver',
        'livescript',
        'llvm',
        'lsl',
        'lua',
        'makefile',
        'markdown',
        'mathematica',
        'matlab',
        'maxima',
        'mel',
        'mercury',
        'mipsasm',
        'mizar',
        'mojolicious',
        'monkey',
        'moonscript',
        'n1ql',
        'nginx',
        'nim',
        'nix',
        'nodeRepl (node-repl)',
        'nsis',
        'objectivec',
        'ocaml',
        'openscad',
        'oxygene',
        'parser3',
        'perl',
        'pf',
        'pgsql',
        'phpTemplate (php-template)',
        'php',
        'plaintext',
        'pony',
        'powershell',
        'processing',
        'profile',
        'prolog',
        'properties',
        'protobuf',
        'puppet',
        'purebasic',
        'pythonRepl (python-repl)',
        'python',
        'q',
        'qml',
        'r',
        'reasonml',
        'rib',
        'roboconf',
        'routeros',
        'rsl',
        'ruby',
        'ruleslanguage',
        'rust',
        'sas',
        'scala',
        'scheme',
        'scilab',
        'scss',
        'shell',
        'smali',
        'smalltalk',
        'sml',
        'sqf',
        'sql',
        'sqlMore (sql_more)',
        'stan',
        'stata',
        'step21',
        'stylus',
        'subunit',
        'swift',
        'taggerscript',
        'tap',
        'tcl',
        'thrift',
        'tp',
        'twig',
        'typescript',
        'vala',
        'vbnet',
        'vbscriptHtml (vbscript-html)',
        'vbscript',
        'verilog',
        'vhdl',
        'vim',
        'x86asm',
        'xl',
        'xml',
        'xquery',
        'yaml',
        'zephir'
      ]
    >;
    showLineNumbers: Attribute.Boolean;
  };
}

export interface PartsEmbedHtml extends Schema.Component {
  collectionName: 'components_parts_embed_htmls';
  info: {
    description: '';
    displayName: 'embedHtml';
    icon: 'slideshow';
  };
  attributes: {
    html: Attribute.Text & Attribute.Required;
  };
}

export interface PartsHtml extends Schema.Component {
  collectionName: 'components_parts_htmls';
  info: {
    description: '';
    displayName: 'html';
    icon: 'layout';
  };
  attributes: {
    html: Attribute.Blocks & Attribute.Required;
  };
}

export interface PartsQuote extends Schema.Component {
  collectionName: 'components_parts_quotes';
  info: {
    displayName: 'Quote';
    icon: 'quote';
  };
  attributes: {
    backgroundImage: Attribute.Media<'images'>;
    text: Attribute.Text & Attribute.Required;
  };
}

export interface ProductsProductsShowcase extends Schema.Component {
  collectionName: 'components_products_products_showcases';
  info: {
    displayName: 'ProductsShowcase';
    icon: 'oneToMany';
  };
  attributes: {
    products: Attribute.Relation<
      'products.products-showcase',
      'oneToMany',
      'api::product.product'
    >;
    title: Attribute.String & Attribute.Required;
  };
}

export interface ProductsUrlToGuide extends Schema.Component {
  collectionName: 'components_products_url_to_guides';
  info: {
    description: '';
    displayName: 'urlToGuide';
  };
  attributes: {
    guide: Attribute.Relation<
      'products.url-to-guide',
      'oneToOne',
      'api::guide.guide'
    >;
    subPath: Attribute.String;
    url: Attribute.String & Attribute.Required;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    description: '';
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    card: Attribute.String;
    creator: Attribute.String;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    site: Attribute.String;
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Attribute.String;
    keywords: Attribute.Text;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Attribute.String;
    metaSocial: Attribute.Component<'shared.meta-social', true> &
      Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Attribute.String &
      Attribute.DefaultTo<'width=device-width, initial-scale=1'>;
    structuredData: Attribute.JSON;
  };
}

export interface WebinarRelatedResources extends Schema.Component {
  collectionName: 'components_webinar_related_resources';
  info: {
    description: '';
    displayName: 'RelatedResources';
    icon: 'folder';
  };
  attributes: {
    downloadableDocuments: Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    resources: Attribute.Component<'common.resource', true>;
    title: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'api.api-rest-detail': ApiApiRestDetail;
      'api.api-soap-detail': ApiApiSoapDetail;
      'api.spec-urls': ApiSpecUrls;
      'common.banner-link': CommonBannerLink;
      'common.call-to-action': CommonCallToAction;
      'common.card-props': CommonCardProps;
      'common.case-histories': CommonCaseHistories;
      'common.ecosystem': CommonEcosystem;
      'common.features': CommonFeatures;
      'common.guide-version': CommonGuideVersion;
      'common.guides-by-category': CommonGuidesByCategory;
      'common.hero-slide': CommonHeroSlide;
      'common.link': CommonLink;
      'common.list-item': CommonListItem;
      'common.news-showcase': CommonNewsShowcase;
      'common.question-and-answer': CommonQuestionAndAnswer;
      'common.related-links': CommonRelatedLinks;
      'common.resource': CommonResource;
      'common.solution-stat': CommonSolutionStat;
      'common.solution-step': CommonSolutionStep;
      'overview.post-integration': OverviewPostIntegration;
      'overview.service-model': OverviewServiceModel;
      'overview.start-info': OverviewStartInfo;
      'overview.start-info-section': OverviewStartInfoSection;
      'overview.tutorial-section': OverviewTutorialSection;
      'parts.alert': PartsAlert;
      'parts.api-tester': PartsApiTester;
      'parts.api-tester-attribute': PartsApiTesterAttribute;
      'parts.ck-editor': PartsCkEditor;
      'parts.code-block': PartsCodeBlock;
      'parts.embed-html': PartsEmbedHtml;
      'parts.html': PartsHtml;
      'parts.quote': PartsQuote;
      'products.products-showcase': ProductsProductsShowcase;
      'products.url-to-guide': ProductsUrlToGuide;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'webinar.related-resources': WebinarRelatedResources;
    }
  }
}
