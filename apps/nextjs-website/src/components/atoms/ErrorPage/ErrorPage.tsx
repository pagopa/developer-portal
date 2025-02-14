import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { useTranslations } from 'next-intl';
import React from 'react';

type ErrorPageProps = {
  overline: string;
  title: string;
  description: string;
};

const ErrorPage: React.FC<ErrorPageProps> = ({
  overline,
  title,
  description,
}) => {
  const t = useTranslations();
  return (
    <Abstract
      layout='center'
      overline={t(overline)}
      title={t(title)}
      description={t(description)}
    />
  );
};

export default ErrorPage;
