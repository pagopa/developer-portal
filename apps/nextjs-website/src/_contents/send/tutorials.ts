import { send } from '@/_contents/send/send';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';
import { makeTutorials } from '../makeDocs';

export const sendTutorials = makeTutorials({
  product: send,
  dirName: 'QzrvHJmSUOaAVsgD4qWK',
  bannerLinks: sendBannerLinks,
});
