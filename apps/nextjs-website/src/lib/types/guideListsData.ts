import { Page } from '@/lib/types/page';
import { GuidesPageProps } from '@/app/[locale]/[productSlug]/guides/page';

export type GuideListsData = Page<Omit<GuidesPageProps, 'products'>>;
