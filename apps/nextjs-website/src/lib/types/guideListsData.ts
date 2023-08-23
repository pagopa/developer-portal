import { Page } from '@/lib/types/page';
import { GuidesPageProps } from '@/app/[productSlug]/guides';

export type GuideListsData = Page<Omit<GuidesPageProps, 'products'>>;
