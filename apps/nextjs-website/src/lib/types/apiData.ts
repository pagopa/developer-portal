import { ApiPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import { Page } from '@/lib/types/page';

export type ApiData = Page<Omit<ApiPageProps, 'products'>>;
