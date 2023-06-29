import { appIoOverview } from '@/_contents/appIo/overview';
import { ioSignOverview } from '@/_contents/ioSign/overview';
import { pagoPaOverview } from '@/_contents/pagoPa/overview';
import { pagoPaGuides } from '@/_contents/pagoPa/guides';
import { appIO } from './appIo/appIO';
import { ioSign } from './ioSign/ioSign';
import { pagoPA } from './pagoPa/pagoPA';

export const overviews = [appIoOverview, ioSignOverview, pagoPaOverview];
export const quickStarts = [];
export const apis = [];
export const tutorials = [];
export const tools = [];
export const productsGuides = [pagoPaGuides];
export const products = [appIO, ioSign, pagoPA];
