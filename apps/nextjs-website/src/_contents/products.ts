import { appIoOverview } from '@/_contents/appIo/overview';
import { ioSignOverview } from '@/_contents/ioSign/overview';
import { pagoPaOverview } from '@/_contents/pagoPa/overview';
import { pagoPaGuides } from '@/_contents/pagoPa/guides';
import { appIO } from './appIo/appIO';
import { ioSign } from './ioSign/ioSign';
import { pagoPa } from './pagoPa/pagoPa';
import { ioSignGuides } from '@/_contents/ioSign/guides';

export const overviews = [appIoOverview, ioSignOverview, pagoPaOverview];
export const quickStarts = [];
export const apis = [];
export const tutorials = [];
export const tools = [];
export const productsGuides = [pagoPaGuides, ioSignGuides];
export const products = [appIO, ioSign, pagoPa];
