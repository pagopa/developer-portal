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
      { code: 'en', name: 'EN' },
      { code: 'it', name: 'IT' },
      { code: 'fr', name: 'FR' },
      { code: 'de', name: 'DE' },
    ],
    currentLocale: 'en',
    onLocaleChange: (lang) => console.log(`Selected language: ${lang}`),
  },
};
