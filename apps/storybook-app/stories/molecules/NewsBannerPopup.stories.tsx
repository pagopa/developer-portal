import { Meta, StoryObj } from '@storybook/nextjs';
import NewsBannerPopup from 'nextjs-website/src/components/molecules/NewsBannerPopup/NewsBannerPopup';

const meta: Meta<typeof NewsBannerPopup> = {
  title: 'Components/NewsBannerPopup',
  component: NewsBannerPopup,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    linkLabel: { control: 'text' },
    linkUrl: { control: 'text' },
    image: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof NewsBannerPopup>;

const mockImage = {
  url: 'https://placehold.co/300x200',
  alternativeText: 'Attestato di partecipazione',
};

export const Default: Story = {
  args: {
    title: 'Attestato di partecipazione al Webinar',
    description:
      "Partecipa al webinar e ottieni il tuo attestato di partecipazione.\nDopo l'evento, troverai l'attestato nel tuo profilo.",
    linkLabel: 'Vai al profilo',
    linkUrl: '/profilo',
    image: mockImage,
  },
};

export const WithoutImage: Story = {
  args: {
    title: 'Attestato di partecipazione al Webinar',
    description:
      "Partecipa al webinar e ottieni il tuo attestato di partecipazione.\nDopo l'evento, troverai l'attestato nel tuo profilo.",
    linkLabel: 'Vai al profilo',
    linkUrl: '/profilo',
  },
};

export const WithoutLink: Story = {
  args: {
    title: 'Attestato di partecipazione al Webinar',
    description:
      "Partecipa al webinar e ottieni il tuo attestato di partecipazione.\nDopo l'evento, troverai l'attestato nel tuo profilo.",
    image: mockImage,
  },
};

export const Minimal: Story = {
  args: {
    title: 'Attestato di partecipazione al Webinar',
  },
};
