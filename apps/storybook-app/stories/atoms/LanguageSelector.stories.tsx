import { Meta, StoryObj } from '@storybook/nextjs';
import LanguageSelector from '../../../nextjs-website/src/components/atoms/LanguageSelector/LanguageSelector';

const meta: Meta<typeof LanguageSelector> = {
  title: 'Atoms/LanguageSelector',
  component: LanguageSelector,
};

export default meta;

export const Showcase: StoryObj<typeof LanguageSelector> = {
  args: {
    locales: [
      { code: 'en', label: 'EN' },
      { code: 'it', label: 'IT' },
      { code: 'fr', label: 'FR' },
      { code: 'de', label: 'DE' },
    ],
    currentLocale: 'en',
  },
};
