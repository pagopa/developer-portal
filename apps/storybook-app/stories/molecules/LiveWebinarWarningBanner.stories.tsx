import { Meta, StoryObj } from '@storybook/nextjs';
import LiveWebinarWarningBanner from 'nextjs-website/src/components/molecules/LiveWebinarWarningBanner/LiveWebinarWarningBanner';

const t = (key: string): string => {
  const translations: Record<string, string> = {
    'consent_banner.title': "Consenso richiesto per ottenere l'attestato",
    'consent_banner.body_line1_pre':
      "Per ricevere l'attestato di partecipazione al termine del webinar, è necessario fornire il consenso al monitoraggio della visione ",
    'consent_banner.body_line1_bold': "entro i primi 5 minuti dall'inizio",
    'consent_banner.body_line1_post': '.',
    'consent_banner.body_line2':
      'Il monitoraggio serve esclusivamente a verificare che il webinar venga effettivamente seguito.',
    'consent_banner.cta_enable': 'Abilita il monitoraggio',
    'consent_banner.cta_given': 'Hai dato il consenso',
  };
  return translations[key] ?? key;
};

const meta: Meta<typeof LiveWebinarWarningBanner> = {
  title: 'Molecules/LiveWebinarWarningBanner',
  component: LiveWebinarWarningBanner,
};

export default meta;
type Story = StoryObj<typeof LiveWebinarWarningBanner>;

export const Default: Story = {
  args: {},
};
