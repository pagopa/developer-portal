import { Page } from '@/lib/types/page';
import { GuidesPageProps } from '@/pages/[productSlug]/guides';

export type GuidesData = Page<Omit<GuidesPageProps, 'products'>>;
