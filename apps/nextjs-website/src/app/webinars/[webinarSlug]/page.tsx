import { translations } from '@/_contents/translations';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import SummaryInformation from '@/components/atoms/SummaryInformation/SummaryInformation';
import SubscribeCta from '@/components/atoms/SubscribeCta/SubscribeCta';
import SpeakerList from '@/components/organisms/SpeakerList/SpeakerList';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { getWebinar, getWebinars } from '@/lib/api';
import { Box } from '@mui/material';
import SubscribeToWebinar from '@/components/molecules/SubscribeToWebinar/SubscribeToWebinar';

type Params = {
  webinarSlug: string;
};

export async function generateStaticParams() {
  const webinars = await getWebinars();
  return [...webinars].map(({ slug }) => ({
    webinarSlug: slug,
  }));
}

const Page = async ({ params }: { params: Params }) => {
  const webinar = await getWebinar(params?.webinarSlug);
  const { webinar: webinarLabels } = translations;

  const subscribeToWebinarButton = <SubscribeToWebinar />;

  return (
    <>
      <SummaryInformation
        title={webinar.title}
        description={webinar.description}
        startDateTime={webinar.startDateTime}
        endDateTime={webinar.endDateTime}
      >
        {subscribeToWebinarButton}
      </SummaryInformation>
      {webinar.subscribeCtaLabel && (
        <SubscribeCta label={webinar.subscribeCtaLabel}>
          {subscribeToWebinarButton}
        </SubscribeCta>
      )}
      {webinar.html && (
        <EContainer>
          <Box dangerouslySetInnerHTML={{ __html: webinar.html }} />
        </EContainer>
      )}
      {webinar.speakers && <SpeakerList speakers={[...webinar.speakers]} />}
      {webinar.startInfo && (
        <StartInfo
          cardVariant='outlined'
          title={webinar.startInfo.title}
          cards={[...webinar.startInfo.cards]}
        />
      )}
      <RelatedLinks
        title={webinarLabels.relatedLinksTitle}
        links={
          webinar.relatedLinks?.map(({ path, name }) => ({
            text: name,
            href: path,
          })) || []
        }
      />
    </>
  );
};

export default Page;
