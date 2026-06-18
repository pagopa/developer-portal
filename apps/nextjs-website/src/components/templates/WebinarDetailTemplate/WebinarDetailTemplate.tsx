'use client';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import SummaryInformation from '@/components/atoms/SummaryInformation/SummaryInformation';
import SubscribeCta from '@/components/atoms/SubscribeCta/SubscribeCta';
import SpeakerList from '@/components/organisms/SpeakerList/SpeakerList';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Alert, Box, Snackbar, useTheme } from '@mui/material';
import SubscribeToWebinar from '@/components/molecules/SubscribeToWebinar/SubscribeToWebinar';
import type { Webinar } from '@/lib/webinars/types';
import { useUser } from '@/helpers/user.helper';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { snackbarAutoHideDurationMs } from '@/config';
import WebinarPlayerSection from '@/components/molecules/WebinarPlayerSection/WebinarPlayerSection';
import { useWebinar, WebinarState } from '@/helpers/webinar.helpers';
import Typography from '@mui/material/Typography';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import RelatedResources from '@/components/molecules/RelatedResources/RelatedResources';
import QuestionsAndAnswers from '@/components/molecules/QuestionsAndAnswers/QuestionsAndAnswers';
import { useParams } from 'next/navigation';
import ConfirmationModal from '@/components/atoms/ConfirmationModal/ConfirmationModal';
import { setCookie, deleteCookie, getCookie } from 'cookies-next/client';

type WebinarDetailTemplateProps = {
  webinar: Webinar;
};

const WebinarDetailTemplate = ({ webinar }: WebinarDetailTemplateProps) => {
  const t = useTranslations('webinar');
  const { locale } = useParams<{ locale: string }>();
  const { palette } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const { user, setUserAttributes } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const hasAcceptedWebinarMonitoringSubscription =
    user?.attributes['custom:webinar_accepted'] === 'true';
  const {
    webinarState,
    setWebinar,
    isQuestionFormEnabled,
    isPlayerVisible,
    livePlayerReloadToken,
    isLiveStreamAvailable,
    setIsVideoPlaying,
  } = useWebinar();
  const showHeaderImage =
    webinarState === WebinarState.future && webinar.headerImage;

  useEffect(() => {
    if (!user) return;
    const rememberOption = getCookie('consent_monitoring_remember_choice');
    if (
      isSubscribed &&
      !hasAcceptedWebinarMonitoringSubscription &&
      !rememberOption
    )
      setShowSubscribePopup(isSubscribed);
    else if (hasAcceptedWebinarMonitoringSubscription) {
      setShowSubscribePopup(false);
    }
  }, [isSubscribed, hasAcceptedWebinarMonitoringSubscription, user]);
  useEffect(() => {
    if (webinar) {
      setWebinar(webinar);
    }
  }, [webinar, setWebinar]);

  const bodyContent = useMemo(
    () =>
      webinar.bodyContent ? (
        <EContainer direction='column' containerSx={{ marginTop: '2.5rem' }}>
          <BlocksRendererClient content={webinar.bodyContent} />
        </EContainer>
      ) : null,
    [webinar.bodyContent]
  );

  const speakerList = useMemo(
    () => webinar.speakers && <SpeakerList speakers={[...webinar.speakers]} />,
    [webinar.speakers]
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
      textColor={showHeaderImage ? 'white' : palette.text.primary}
    />
  );

  return (
    <>
      <Box
        paddingY={'20px'}
        style={{
          backgroundColor: palette.grey[50],
          backgroundImage: showHeaderImage
            ? `url(${webinar.headerImage?.url})`
            : 'none',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <ConfirmationModal
          title={t('subscriptionPopup.title')}
          text={
            t.rich('subscriptionPopup.text', {
              strong: (chunks) => <strong>{chunks}</strong>,
              br: () => <br></br>,
            }) as string
          }
          open={showSubscribePopup}
          setOpen={() => null}
          confirmCta={{
            label: t('subscriptionPopup.confirmCta'),
            onClick: () => {
              if (!user) return null;
              setUserAttributes(
                {
                  ...user.attributes,
                  'custom:webinar_accepted': `true`,
                },
                () => {
                  setShowSubscribePopup(false);
                  return null;
                },
                () => {
                  setError(t('genericSubscriptionError'));
                  return null;
                }
              );
              return null;
            },
          }}
          cancelCta={{
            label: t('subscriptionPopup.cancelCta'),
            onClick: () => {
              setShowSubscribePopup(false);
              return null;
            },
          }}
          checkboxLabel={t('subscriptionPopup.checkboxLabel')}
          checked={false}
          onCheckboxChange={(checked) => {
            if (checked) {
              setCookie('consent_monitoring_remember_choice', 'true', {
                maxAge: 60 * 60 * 24 * 365,
              });
            } else {
              deleteCookie('consent_monitoring_remember_choice');
            }
            return null;
          }}
        />

        <EContainer>
          <ProductBreadcrumbs
            textColor={showHeaderImage ? 'white' : palette.text.primary}
            breadcrumbs={[
              ...pageToBreadcrumbs(locale, 'webinars', [
                {
                  name: webinar.title,
                  path: `/${locale}/webinars/${webinar.slug}`,
                },
              ]),
            ]}
          />
        </EContainer>
        <SummaryInformation
          title={webinar.title}
          description={webinar.description}
          startDateTime={webinar.startDateTime}
          endDateTime={webinar.endDateTime}
          webinarState={webinarState}
          textColor={showHeaderImage ? 'white' : palette.text.primary}
        >
          {subscribeToWebinarButton}
          {isSubscribed && webinarState === WebinarState.comingSoon && (
            <Typography
              variant={'body2'}
              sx={{
                position: 'absolute',
                bottom: '24px',
                fontSize: '12px',
                marginTop: 1,
                color: showHeaderImage ? 'white' : palette.text.primary,
              }}
            >
              {t('warnings.refresh')}
            </Typography>
          )}
        </SummaryInformation>
      </Box>
      {user &&
        isSubscribed &&
        ![WebinarState.future, WebinarState.unknown].includes(webinarState) && (
          <WebinarPlayerSection
            webinar={webinar}
            webinarState={webinarState}
            enableQuestionForm={isQuestionFormEnabled}
            reloadPlayerToken={livePlayerReloadToken}
            isLiveStreamAvailable={isLiveStreamAvailable}
            isPlayerVisible={isPlayerVisible}
            setIsVideoPlaying={setIsVideoPlaying}
          ></WebinarPlayerSection>
        )}
      {webinar.subscribeCtaLabel && (
        <SubscribeCta label={webinar.subscribeCtaLabel}>
          {subscribeToWebinarButton}
        </SubscribeCta>
      )}
      {bodyContent}
      {speakerList}
      {webinar.questionsAndAnswers && (
        <QuestionsAndAnswers items={[...webinar.questionsAndAnswers]} />
      )}
      {webinar.relatedResources && (
        <RelatedResources
          title={webinar.relatedResources.title}
          resources={webinar.relatedResources.resources.map((resource) => ({
            title: resource.title,
            description: {
              title: resource.subtitle || '',
              content: resource.description,
            },
            imagePath: resource.image?.url || '/images/hero.jpg',
            link: {
              label: resource.linkText,
              href: resource.linkHref,
            },
            mobileImagePath: resource.image?.url || '/images/hero.jpg',
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
