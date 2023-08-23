import { Page } from '@/lib/types/page';
import { TutorialsPageProps } from '@/app/[productSlug]/tutorials';

export type TutorialListsData = Page<Omit<TutorialsPageProps, 'products'>>;
