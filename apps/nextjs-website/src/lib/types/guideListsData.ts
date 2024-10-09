import { Page } from '@/lib/types/page';
import { GuideListPageProps } from '@/app/[productSlug]/guides/page';

export type GuideListsData = Page<Omit<GuideListPageProps, 'products'>>;
