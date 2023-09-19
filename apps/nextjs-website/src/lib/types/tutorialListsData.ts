import { Page } from '@/lib/types/page';
import { TutorialsPageProps } from '@/app/[locale]/[productSlug]/tutorials/page';

export type TutorialListsData = Page<Omit<TutorialsPageProps, 'products'>>;
