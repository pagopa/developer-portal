'use client';
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
import { useEffect, useMemo, useState } from 'react';
import { DevPortalUser } from '@/lib/types/auth';
import { useTranslations } from 'next-intl';
import { snackbarAutoHideDurationMs } from '@/config';
import WebinarPlayerSection from '@/components/molecules/WebinarPlayerSection/WebinarPlayerSection';
import { useWebinar, WebinarState } from '@/helpers/webinar.helpers';
import Typography from '@mui/material/Typography';

type WebinarDetailTemplateProps = {
  webinar: Webinar;
};

const WebinarDetailTemplate = ({ webinar }: WebinarDetailTemplateProps) => {
  const t = useTranslations('webinar');
  const [error, setError] = useState<string | null>(null);
  const { user, aligned: userAligned, setUserAttributes } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { webinarState, setWebinar } = useWebinar();

  useEffect(() => {
    webinar && setWebinar(webinar);
  }, [webinar]);

  const html = useMemo(
    () =>
      webinar.html ? (
        <EContainer>
          <Box dangerouslySetInnerHTML={{ __html: webinar.html }} />
        </EContainer>
      ) : null,
    [webinar.html]
  );

  const speakerList = useMemo(
    () => webinar.speakers && <SpeakerList speakers={[...webinar.speakers]} />,
    [webinar.speakers]
  );

  const startInfo = useMemo(
    () =>
      webinar.startInfo && (
        <StartInfo
          cardVariant='outlined'
          title={webinar.startInfo.title}
          cards={[...webinar.startInfo.cards]}
        />
      ),
    [webinar.startInfo]
  );
  const relatedLinks = useMemo(
    () => (
      <RelatedLinks
        title={t('relatedLinksTitle')}
        links={
          webinar.relatedLinks?.map(({ path, name }) => ({
            text: name,
            href: path,
          })) || []
        }
      />
    ),
    [webinar.relatedLinks]
  );

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
      webinarState={webinarState}
    />
  );

  return (
    <>
      <SummaryInformation
        title={webinar.title}
        description={webinar.description}
        startDateTime={webinar.startDateTime}
        endDateTime={webinar.endDateTime}
        webinarState={webinarState}
      >
        {subscribeToWebinarButton}
        {isSubscribed && webinarState === WebinarState.future && (
          <Typography
            variant={'body2'}
            sx={{
              position: 'absolute',
              bottom: '24px',
              fontSize: '12px',
              marginTop: 1,
            }}
          >
            {t('warnings.email')}
          </Typography>
        )}
        {isSubscribed && webinarState === WebinarState.comingSoon && (
          <Typography
            variant={'body2'}
            sx={{
              position: 'absolute',
              bottom: '24px',
              fontSize: '12px',
              marginTop: 1,
            }}
          >
            {t('warnings.refresh')}
          </Typography>
        )}
      </SummaryInformation>
      {user && isSubscribed && (
        <WebinarPlayerSection
          webinar={webinar}
          user={user}
        ></WebinarPlayerSection>
      )}
      {webinar.subscribeCtaLabel && (
        <SubscribeCta label={webinar.subscribeCtaLabel}>
          {subscribeToWebinarButton}
        </SubscribeCta>
      )}
      {html}
      {speakerList}
      {startInfo}
      {relatedLinks}
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
