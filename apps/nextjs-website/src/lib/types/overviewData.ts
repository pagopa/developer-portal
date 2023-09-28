import { OverviewPageProps } from '@/app/[productSlug]/overview/page';
import { Page } from '@/lib/types/page';

export type OverviewData = Page<Omit<OverviewPageProps, 'products'>>;
