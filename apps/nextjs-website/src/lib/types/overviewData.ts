import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { Page } from '@/lib/types/page';

export type OverviewData = Page<Omit<OverviewPageProps, 'products'>>;
