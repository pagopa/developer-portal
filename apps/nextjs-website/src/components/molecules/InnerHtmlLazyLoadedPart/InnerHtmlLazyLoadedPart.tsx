import React, { useEffect, useState } from 'react';
import InnerHtmlPart from '@/components/atoms/InnerHtmlPart/InnerHtmlPart';

export type InnerHtmlLazyLoadedPartProps = { html: string };

const InnerHtmlLazyLoadedPart = ({ html }: InnerHtmlLazyLoadedPartProps) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return <>{loaded && <InnerHtmlPart html={html} />}</>;
};

export default InnerHtmlLazyLoadedPart;
