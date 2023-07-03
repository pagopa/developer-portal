import { appIoOverview } from '@/_contents/appIo/overview';
import { ioSignOverview } from '@/_contents/ioSign/overview';
import { pagoPaOverview } from '@/_contents/pagoPa/overview';
import { ioSignGuides } from '@/_contents/ioSign/guides';
import { pagoPaGuideLists } from '@/_contents/pagoPa/guideLists';
import { appIO } from './appIo/appIO';
import { ioSign } from './ioSign/ioSign';
import { pagoPa } from './pagoPa/pagoPa';

export const overviews = [appIoOverview, ioSignOverview, pagoPaOverview];
export const quickStarts = [];
export const apis = [];
export const tutorials = [];
export const tools = [];
export const guideLists = [pagoPaGuideLists, ioSignGuides];
export const products = [appIO, ioSign, pagoPa];
