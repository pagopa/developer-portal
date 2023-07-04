import { appIoOverview } from '@/_contents/appIo/overview';
import { ioSignOverview } from '@/_contents/ioSign/overview';
import { pagoPaOverview } from '@/_contents/pagoPa/overview';
import { appIoApi } from '@/_contents/appIo/api';
import { sendOverview } from '@/_contents/send/overview';
import { ioSignGuideLists } from '@/_contents/ioSign/guideLists';
import { pagoPaGuideLists } from '@/_contents/pagoPa/guideLists';
import { sendGuideLists } from '@/_contents/send/guideLists';
import { appIO } from './appIo/appIO';
import { ioSign } from './ioSign/ioSign';
import { pagoPa } from './pagoPa/pagoPa';
import { send } from '@/_contents/send/send';
import { ioSignApi } from './ioSign/api';

export const overviews = [
  appIoOverview,
  ioSignOverview,
  pagoPaOverview,
  sendOverview,
];
export const quickStarts = [];
export const apis = [appIoApi, ioSignApi];
export const tutorials = [];
export const tools = [];
export const guideLists = [pagoPaGuideLists, ioSignGuideLists, sendGuideLists];
export const products = [appIO, ioSign, pagoPa, send];
