'use client';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import SummaryInformation from '@/components/atoms/SummaryInformation/SummaryInformation';
import SubscribeCta from '@/components/atoms/SubscribeCta/SubscribeCta';
import SpeakerList from '@/components/organisms/SpeakerList/SpeakerList';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Alert, Box, Snackbar, useTheme } from '@mui/material';
import SubscribeToWebinar from '@/components/molecules/SubscribeToWebinar/SubscribeToWebinar';
import { Webinar } from '@/lib/types/webinar';
import { useUser } from '@/helpers/user.helper';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { snackbarAutoHideDurationMs } from '@/config';
import WebinarPlayerSection from '@/components/molecules/WebinarPlayerSection/WebinarPlayerSection';
import { useWebinar, WebinarState } from '@/helpers/webinar.helpers';
import Typography from '@mui/material/Typography';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import RelatedResources from '@/components/molecules/RelatedResources/RelatedResources';
import QuestionsAndAnswersComponent from '@/components/molecules/QuestionsAndAnswers/QuestionsAndAnswers';

type WebinarDetailTemplateProps = {
  webinar: Webinar;
};

const WebinarDetailTemplate = ({ webinar }: WebinarDetailTemplateProps) => {
  const t = useTranslations('webinar');
  const { palette } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { webinarState, setWebinar } = useWebinar();

  useEffect(() => {
    webinar && setWebinar(webinar);
  }, [webinar]);

  const html = useMemo(
    () =>
      webinar.html ? (
        <EContainer direction='column'>
          <Box dangerouslySetInnerHTML={{ __html: webinar.html }} />
        </EContainer>
      ) : null,
    [webinar.html]
  );

  const bodyContent = useMemo(
    () =>
      webinar.bodyContent ? (
        <EContainer direction='column'>
          <BlocksRendererClient content={webinar.bodyContent} />
        </EContainer>
      ) : null,
    [webinar.bodyContent]
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
    () =>
      webinar.relatedLinks?.title && (
        <RelatedLinks
          title={webinar.relatedLinks?.title}
          links={[...(webinar.relatedLinks?.links || [])]}
        />
      ),
    [webinar.relatedLinks]
  );

  const subscribeToWebinarButton = (
    <SubscribeToWebinar
      webinarSlug={webinar.slug}
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
      <Box paddingTop={5} style={{ backgroundColor: palette.grey[50] }}>
        <EContainer>
          <ProductBreadcrumbs
            breadcrumbs={[
              ...pageToBreadcrumbs('webinars', [
                {
                  name: webinar.title,
                  path: webinar.slug,
                },
              ]),
            ]}
          />
        </EContainer>
      </Box>
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
      {user &&
        isSubscribed &&
        ![WebinarState.future, WebinarState.unknown].includes(webinarState) && (
          <WebinarPlayerSection
            webinar={webinar}
            webinarState={webinarState}
          ></WebinarPlayerSection>
        )}
      {webinar.subscribeCtaLabel && (
        <SubscribeCta label={webinar.subscribeCtaLabel}>
          {subscribeToWebinarButton}
        </SubscribeCta>
      )}
      {html}
      {bodyContent}
      {speakerList}
      {startInfo}
      {webinar.relatedResources && (
        <RelatedResources
          title={webinar.relatedResources.title}
          resources={webinar.relatedResources.resources.map((resource) => ({
            description: { title: resource.subtitle || '', listItems: [] }, // TODO: remove and use description when PR is fixed
            imagePath: resource.image?.url || '',
            link: {
              label: resource.linkText,
              href: resource.linkHref,
            },
            mobileImagePath: resource.image?.url || '',
            title: resource.title,
          }))}
          downloadableDocuments={(
            webinar.relatedResources.downloadableDocuments || []
          ).map((doc) => ({
            title: doc.title,
            size: doc.size,
            downloadLink: doc.downloadLink,
            tags: [{ label: doc.extension }],
          }))}
        />
      )}
      {webinar.questionsAndAnswers && (
        <QuestionsAndAnswersComponent
          questions={[...webinar.questionsAndAnswers]}
        />
      )}
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
