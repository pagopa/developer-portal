import { Page } from '@/lib/types/page';
import { TutorialsPageProps } from '@/app/[productSlug]/tutorials/page';

export type TutorialListsData = Page<Omit<TutorialsPageProps, 'products'>>;
