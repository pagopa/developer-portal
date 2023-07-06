import { appIoOverview } from '@/_contents/appIo/overview';
import { appIO } from '@/_contents/appIo/appIO';
import { appIoApi } from '@/_contents/appIo/api';
import { ioSignOverview } from '@/_contents/ioSign/overview';
import { ioSignApi } from '@/_contents/ioSign/api';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignGuideLists } from '@/_contents/ioSign/guideLists';
import { pagoPaOverview } from '@/_contents/pagoPa/overview';
import { pagoPaGuideLists } from '@/_contents/pagoPa/guideLists';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaApi } from '@/_contents/pagoPa/api';
import { sendApi } from '@/_contents/send/api';
import { sendGuideLists } from '@/_contents/send/guideLists';
import { sendOverview } from '@/_contents/send/overview';
import { send } from '@/_contents/send/send';
import { appIOGuideLists } from '@/_contents/appIo/guideLists';
import { appIoGuides } from '@/_contents/appIo/guides';
import { appIoTutorials } from '@/_contents/appIo/tutorials';
import { ioSignTutorials } from '@/_contents/ioSign/tutorials';
import { ioSignGuides } from '@/_contents/ioSign/guides';
import { pagoPaGuides } from '@/_contents/pagoPa/guides';
import { sendGuides } from '@/_contents/send/guides';

export const overviews = [
  appIoOverview,
  ioSignOverview,
  pagoPaOverview,
  sendOverview,
];
export const quickStarts = [];
export const apis = [appIoApi, ioSignApi, sendApi, pagoPaApi];
export const tutorials = [...appIoTutorials, ...ioSignTutorials];
export const tools = [];
export const guideLists = [
  appIOGuideLists,
  pagoPaGuideLists,
  ioSignGuideLists,
  sendGuideLists,
];
export const guides = [
  ...appIoGuides,
  ...ioSignGuides,
  ...pagoPaGuides,
  ...sendGuides,
];
export const products = [appIO, ioSign, send, pagoPa];
