import { Meta, StoryObj } from '@storybook/nextjs';
import CertificateBanner from 'nextjs-website/src/components/molecules/CertificateBanner/CertificateBanner';

const meta: Meta<typeof CertificateBanner> = {
  title: 'Components/CertificateBanner',
  component: CertificateBanner,
};

export default meta;
type Story = StoryObj<typeof CertificateBanner>;

const mockImage = {
  url: 'https://placehold.co/404x241',
  alternativeText: 'Attestato di partecipazione',
};

export const Showcase: Story = {
  args: {
    image: mockImage,
  },
};
