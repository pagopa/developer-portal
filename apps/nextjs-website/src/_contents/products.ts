import { appIo } from '@/_contents/appIo/appIo';
import { appIoApi } from '@/_contents/appIo/api';
import { appIoGuides } from '@/_contents/appIo/guides';
import { appIoGuideLists } from '@/_contents/appIo/guideLists';
import { appIoOverview } from '@/_contents/appIo/overview';
import { appIoQuickStartGuide } from '@/_contents/appIo/quickStartGuide';
import { appIoTutorials } from '@/_contents/appIo/tutorials';
import { appIoTutorialLists } from '@/_contents/appIo/tutorialLists';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignApi } from '@/_contents/ioSign/api';
import { ioSignGuides } from '@/_contents/ioSign/guides';
import { ioSignGuideLists } from '@/_contents/ioSign/guideLists';
import { ioSignOverview } from '@/_contents/ioSign/overview';
import { ioSignTutorialLists } from '@/_contents/ioSign/tutorialLists';
import { ioSignTutorials } from '@/_contents/ioSign/tutorials';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaApi } from '@/_contents/pagoPa/api';
import { pagoPaGuides } from '@/_contents/pagoPa/guides';
import { pagoPaGuideLists } from '@/_contents/pagoPa/guideLists';
import { pagoPaOverview } from '@/_contents/pagoPa/overview';
import { pagoPaTutorials } from '@/_contents/pagoPa/tutorials';
import { pagoPaTutorialLists } from '@/_contents/pagoPa/tutorialLists';
import { send } from '@/_contents/send/send';
import { sendApi } from '@/_contents/send/api';
import { sendGuides } from '@/_contents/send/guides';
import { sendGuideLists } from '@/_contents/send/guideLists';
import { sendOverview } from '@/_contents/send/overview';
import { sendTutorialLists } from '@/_contents/send/tutorialLists';
import { sendTutorials } from '@/_contents/send/tutorials';
import { sendQuickStartGuide } from '@/_contents/send/quickStartGuide';
import { ioSignQuickStartGuide } from '@/_contents/ioSign/quickStartGuide';
import { pagoPaQuickStartGuide } from '@/_contents/pagoPa/quickStartGuide';
import { makeGuide, makeTutorials } from './makeDocs';
import { pipe } from 'fp-ts/lib/function';
import * as s from 'fp-ts/lib/string';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as Eq from 'fp-ts/lib/Eq';

export const overviews = [
  appIoOverview,
  ioSignOverview,
  pagoPaOverview,
  sendOverview,
];

export const quickStartGuides = [
  appIoQuickStartGuide,
  sendQuickStartGuide,
  ioSignQuickStartGuide,
  pagoPaQuickStartGuide,
];

export const apis = [appIoApi, ioSignApi, pagoPaApi, sendApi];

export const tutorialLists = [
  appIoTutorialLists,
  ioSignTutorialLists,
  pagoPaTutorialLists,
  sendTutorialLists,
];

const tutorialsDefinitions = [
  appIoTutorials,
  ioSignTutorials,
  pagoPaTutorials,
  sendTutorials,
];
export const tutorials = tutorialsDefinitions.flatMap(makeTutorials);

export const guideLists = [
  appIoGuideLists,
  ioSignGuideLists,
  pagoPaGuideLists,
  sendGuideLists,
];
const guidesDefinitions = [
  ...appIoGuides,
  ...ioSignGuides,
  ...pagoPaGuides,
  ...sendGuides,
];
export const guides = guidesDefinitions.flatMap(makeGuide);

// Create a slim data structure to reduce React page size.
// This structure is composed of page path and title.
export const gitBookPagesWithTitle = [...tutorials, ...guides].map(
  (content) => ({
    title: content.page.title,
    path: content.page.path,
  })
);

export const spaceToPrefixMap = pipe(
  [...tutorials, ...guides],
  RA.map((content) => ({
    spaceId: content.source.spaceId,
    pathPrefix: content.source.pathPrefix,
  })),
  RA.uniq(Eq.struct({ spaceId: s.Eq, pathPrefix: s.Eq }))
);

export const urlRewritesMap: { readonly [url: string]: string } = {
  'https://docs.pagopa.it/manuale-operativo-dei-servizi': 'manuale-servizi',
  'https://docs.pagopa.it/kb-enti': 'supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-adesione': 'supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-servizi': 'supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-messaggi': 'supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-pagamenti': 'supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-accordi': 'supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-assistenza': 'supporto-agli-enti',
  'https://docs.pagopa.it/kit-di-comunicazione-per-gli-enti':
    'kit-comunicazione',
  'https://docs.pagopa.it/io-come-aderire': 'accordi-adesione',
  'https://docs.pagopa.it/f.a.q.-per-integratori': 'knowledge-base',
  'https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche':
    'modello-di-integrazione',
  'https://docs.pagopa.it/manuale-operativo-back-office-pagopa-ente-creditore':
    'manuale-bo-ec',
  'https://docs.pagopa.it/manuale-bo-pagopa-psp': 'manuale-bo-psp',
  'https://docs.pagopa.it/gestionedeglierrori': 'errori',
  'https://docs.pagopa.it/dizionario-dei-metadata': 'metadata',
  'https://docs.pagopa.it/manuale-operativo-di-firma-con-io':
    'manuale-operativo',
};

export const products = [appIo, ioSign, send, pagoPa];
