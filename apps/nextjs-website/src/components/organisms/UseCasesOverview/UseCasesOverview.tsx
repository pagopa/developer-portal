'use client';

import React from 'react';
import { Path } from '@/lib/types/path';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import { useTranslations } from 'next-intl';
import { UseCase } from '@/lib/types/useCaseData';

type UseCasesOverviewProps = {
  title?: string;
  description: string;
  ctaLabel?: string;
  useCasePath: Path;
  useCases: UseCase[];
};

const UseCasesOverview = ({
  title,
  description,
  ctaLabel,
  useCases,
  useCasePath,
}: UseCasesOverviewProps) => {
  const t = useTranslations();
  const label = t('shared.readUseCase');
  return (
    <NewsShowcase
      marginTop={8}
      title={title || t('overview.useCases.title')}
      subtitle={description}
      link={{
        text: ctaLabel || t('overview.useCases.ctaLabel'),
        url: useCasePath.path,
      }}
      items={useCases.map((useCase) => ({
        ...useCase,
        image: useCase.coverImage,
        link: {
          url: useCase.path,
          text: label,
        },
      }))}
    />
  );
};

export default UseCasesOverview;
