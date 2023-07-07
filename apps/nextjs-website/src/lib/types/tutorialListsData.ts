import { Page } from '@/lib/types/page';
import { TutorialsPageProps } from '@/pages/[productSlug]/tutorials';

export type TutorialListsData = Page<Omit<TutorialsPageProps, 'products'>>;
