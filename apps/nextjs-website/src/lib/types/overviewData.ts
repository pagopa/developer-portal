import { OverviewPageProps } from '@/app/[productSlug]/page';
import { Page } from '@/lib/types/page';

export type OverviewData = Page<Omit<OverviewPageProps, 'products'>>;
