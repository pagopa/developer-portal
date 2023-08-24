import { Page } from '@/lib/types/page';
import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';

export type QuickStartGuideData = Page<
  Omit<QuickStartGuidePageProps, 'products'>
>;
