'use client';
import { translations } from '@/_contents/translations';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import SummaryInformation from '@/components/atoms/SummaryInformation/SummaryInformation';
import SubscribeCta from '@/components/atoms/SubscribeCta/SubscribeCta';
import SpeakerList from '@/components/organisms/SpeakerList/SpeakerList';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Alert, Box, Snackbar } from '@mui/material';
import SubscribeToWebinar from '@/components/molecules/SubscribeToWebinar/SubscribeToWebinar';
import { Webinar } from '@/lib/types/webinar';
import { useUser } from '@/helpers/user.helper';
import { useState } from 'react';
import { DevPortalUser } from '@/lib/types/auth';
import { snackbarAutoHideDurationMs } from '@/config';

type WebinarDetailTemplateProps = {
  webinar: Webinar;
};

const WebinarDetailTemplate = ({ webinar }: WebinarDetailTemplateProps) => {
  const { webinar: webinarLabels } = translations;
  const [error, setError] = useState<string | null>(null);
  const { user, aligned: userAligned, setUserAttributes } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeToWebinarButton = (
    <SubscribeToWebinar
      webinarSlug={webinar.slug}
      userAttributes={user?.attributes}
      userAligned={userAligned}
      setUserAttributes={async (attributes: DevPortalUser['attributes']) => {
        await setUserAttributes(attributes);
        return null;
      }}
      isSubscribed={isSubscribed}
      setIsSubscribed={(bool: boolean) => {
        setIsSubscribed(bool);
        return null;
      }}
      handleErrorMessage={(message: string) => {
        setError(message);
        return null;
      }}
    />
  );

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
      <Snackbar
        open={!!error}
        autoHideDuration={snackbarAutoHideDurationMs}
        onClose={() => setError(null)}
      >
        <Alert severity={'error'}>{error}</Alert>
      </Snackbar>
    </>
  );
};

export default WebinarDetailTemplate;
