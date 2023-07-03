import { appIoOverview } from '@/_contents/appIo/overview';
import { ioSignOverview } from '@/_contents/ioSign/overview';
import { pagoPaOverview } from '@/_contents/pagoPa/overview';
import { sendOverview } from '@/_contents/send/overview';
import { pagoPaGuideLists } from '@/_contents/pagoPa/guideLists';
import { sendGuideLists } from '@/_contents/send/guideLists';
import { appIO } from './appIo/appIO';
import { ioSign } from './ioSign/ioSign';
import { pagoPa } from './pagoPa/pagoPa';
import { send } from '@/_contents/send/send';

export const overviews = [
  appIoOverview,
  ioSignOverview,
  pagoPaOverview,
  sendOverview,
];
export const quickStarts = [];
export const apis = [];
export const tutorials = [];
export const tools = [];
export const guideLists = [pagoPaGuideLists, sendGuideLists];
export const products = [appIO, ioSign, pagoPa, send];
