import { Meta, StoryObj } from '@storybook/nextjs';
import CertificateBanner from 'nextjs-website/src/components/molecules/CertificateBanner/CertificateBanner';

const meta: Meta<typeof CertificateBanner> = {
  title: 'Molecules/CertificateBanner',
  component: CertificateBanner,
};

export default meta;
type Story = StoryObj<typeof CertificateBanner>;

const mockImage = {
  url: 'https://placehold.co/333x199',
  alternativeText: 'Attestato di partecipazione',
};

export const Showcase: Story = {
  args: {
    imagePath: mockImage.url,
    isInListPage: false,
  },
};
