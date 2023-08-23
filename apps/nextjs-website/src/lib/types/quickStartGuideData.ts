import { Page } from '@/lib/types/page';
import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start';

export type QuickStartGuideData = Page<
  Omit<QuickStartGuidePageProps, 'products'>
>;
