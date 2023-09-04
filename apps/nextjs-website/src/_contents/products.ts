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

export const tutorials = [
  ...appIoTutorials,
  ...ioSignTutorials,
  ...pagoPaTutorials,
  ...sendTutorials,
];

export const tools = [];

export const guideLists = [
  appIoGuideLists,
  ioSignGuideLists,
  pagoPaGuideLists,
  sendGuideLists,
];
export const guides = [
  ...appIoGuides,
  ...ioSignGuides,
  ...pagoPaGuides,
  ...sendGuides,
];

const gitBookContents = [...tutorials, ...guides];
// Create a slim data structure to reduce React page size.
// This structure is composed of page path and title.
export const gitBookPagesWithTitle = gitBookContents.map((content) => ({
  title: content.page.title,
  path: content.page.path,
}));

export const spaceToPrefix = gitBookContents.map((content) => ({
  // eslint-disable-next-line functional/immutable-data
  spaceId: content.source.dirPath.split('/').pop() ?? '',
  pathPrefix: content.source.pathPrefix,
}));

export const products = [appIo, ioSign, send, pagoPa];
