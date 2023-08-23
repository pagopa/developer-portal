import { Page } from '@/lib/types/page';
import { ApiPageProps } from '@/app/[productSlug]/api/page';

export type ApiData = Page<Omit<ApiPageProps, 'products'>>;
