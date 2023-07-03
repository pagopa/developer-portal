import { Page } from '@/lib/types/page';
import { GuidesPageProps } from '@/pages/[productSlug]/guides';

export type GuideListsData = Page<Omit<GuidesPageProps, 'products'>>;
