import { ApiPageProps } from '@/app/[locale]/[productSlug]/api/page';
import { Page } from '@/lib/types/page';

export type ApiData = Page<Omit<ApiPageProps, 'products'>>;
