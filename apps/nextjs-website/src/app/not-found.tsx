import { translations } from '@/_contents/translations';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';

export default function PageNotFound() {
  const { pageNotFound } = translations;

  return (
    <Abstract
      layout='center'
      overline={pageNotFound.overline}
      title={pageNotFound.title}
      description={pageNotFound.description}
    />
  );
}
