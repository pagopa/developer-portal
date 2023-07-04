import { Page } from '@/lib/types/page';
import { ApiPageProps } from '@/pages/[productSlug]/api';

export type ApiData = Page<Omit<ApiPageProps, 'products'>>;
