'use client';
import React, { useEffect } from 'react';
import { GuidePage } from '@/lib/types/guideData';
import { redirect, usePathname } from 'next/navigation';

type GuideWrapperProps = {
  children: React.ReactNode;
  guideProps: GuidePage;
  paths: string[];
};

const GuideWrapper = ({ children, guideProps, paths }: GuideWrapperProps) => {
  const path = usePathname();
  const guidePath = (paths ?? [''])?.join('/');
  useEffect(() => {
    const isPathWithMainVersion =
      guideProps.version.main && !path.startsWith(guideProps.version.path);

    // We need to redirect to the main version if the user is trying to access to a url without version
    // Example: /sanp/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog
    // We need to redirect to /sanp/3.6.0/specifiche-attuative-del-nodo-dei-pagamenti-spc/changelog

    if (isPathWithMainVersion) {
      // Check if the current path has a version in it
      const hasVersionInPath = (guidePath ?? '').match(/v?\d+\.\d+\.\d+/);
      const sliceFrom = hasVersionInPath ? 2 : 1;
      const to = [
        guideProps.version.path,
        ...(paths ?? []).slice(sliceFrom),
      ].join('/');

      if (to !== guidePath) {
        redirect(guideProps.page.path);
      }
    }
  }, []);

  return <>{children}</>;
};

export default GuideWrapper;
