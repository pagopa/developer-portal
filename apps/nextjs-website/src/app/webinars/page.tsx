import { getOtherWebinars, getVisibleInHomeWebinars } from '@/lib/api';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import { baseUrl } from '@/config';
import WebinarsLayout from '@/components/organisms/WebinarsLayout/WebinarsLayout';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'PagoPA DevPortal - Webinars',
    description: 'Il portale per gli sviluppatori di PagoPA',
    url: `${baseUrl}/webinars`,
    locale: 'it_IT',
  });
}

const Webinars = async () => {
  const visibleInHomeWebinars = await getVisibleInHomeWebinars();
  const otherWebinars = await getOtherWebinars().then((webinars) => {
    return (
      [...webinars]
        .filter(
          (webinar) => !!webinar.startDateTime && !webinar.isVisibleInHome
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .sort((a, b) => (a.startDateTime! < b.startDateTime! ? 1 : -1))
    );
  });

  return (
    <WebinarsLayout
      visibleInHomeWebinars={visibleInHomeWebinars}
      otherWebinars={otherWebinars}
    ></WebinarsLayout>
  );
};

export default Webinars;
