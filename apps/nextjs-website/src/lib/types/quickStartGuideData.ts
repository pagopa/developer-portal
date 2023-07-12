import { Page } from '@/lib/types/page';
import { QuickStartGuidePageProps } from '@/pages/[productSlug]/quick-start-guide';

export type QuickStartGuideData = Page<
  Omit<QuickStartGuidePageProps, 'products'>
>;
