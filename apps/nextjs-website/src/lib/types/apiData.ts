import { Page } from '@/lib/types/page';
import { ApiPageProps } from '@/app/[productSlug]/api';

export type ApiData = Page<Omit<ApiPageProps, 'products'>>;
