import { Webinar } from '@/lib/types/webinar';
import FutureWebinarsShowcase from '../FutureWebinarsShowcase/FutureWebinarsShowcase';
import PastWebinarsShowcase from '../PastWebinarsShowcase/PastWebinarsShowcase';
import { getFutureWebinars, getPastWebinars } from '@/helpers/webinars.helpers';
import { maxPastWebinarsInHome } from '@/config';

type WebinarsSectionProps = {
  webinars: Webinar[];
};

const WebinarsSection = ({ webinars }: WebinarsSectionProps) => {
  const futureWebinars = getFutureWebinars(webinars);
  const pastWebinars = getPastWebinars(webinars).slice(
    0,
    maxPastWebinarsInHome
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
      <PastWebinarsShowcase webinars={[...pastWebinars]} />
    </>
  );
};

export default WebinarsSection;
