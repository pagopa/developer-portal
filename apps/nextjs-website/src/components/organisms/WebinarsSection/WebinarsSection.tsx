'use client';
import type { Webinar } from '@/lib/webinars/types';
import FutureWebinarsShowcase from '../FutureWebinarsShowcase/FutureWebinarsShowcase';
import PastWebinarsShowcase from '../PastWebinarsShowcase/PastWebinarsShowcase';
import {
  getFutureWebinarsFrom,
  getPastWebinarsFrom,
} from '@/helpers/webinars.helpers';
import { browserEnv } from '@/browserConfig';

type WebinarsSectionProps = {
  webinars: readonly Webinar[];
};

const WebinarsSection = ({ webinars }: WebinarsSectionProps) => {
  const futureWebinars = getFutureWebinarsFrom(webinars);
  const pastWebinars = getPastWebinarsFrom(webinars).slice(
    0,
    browserEnv.config.maxPastWebinarsInHome
  );

  return (
    <>
      {futureWebinars.length > 0 && (
        <FutureWebinarsShowcase
          title={
            futureWebinars.length > 1 ? 'dontLoseNextPlural' : 'dontLoseNext'
          }
          webinars={[...futureWebinars]}
        />
      )}
      {pastWebinars.length > 0 && (
        <PastWebinarsShowcase webinars={[...pastWebinars]} />
      )}
    </>
  );
};

export default WebinarsSection;
