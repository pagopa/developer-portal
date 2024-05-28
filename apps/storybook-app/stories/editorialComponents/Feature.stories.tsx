import { Meta, StoryObj } from "@storybook/react";
import Feature from "../../../nextjs-website/src/editorialComponents/Feature/Feature";
import { FeatureItem } from "../../../nextjs-website/src/editorialComponents/Feature/FeatureStackItem";

const meta: Meta<typeof Feature> = {
  title: "EditorialComponents/Feature",
  component: Feature,
};

export default meta;

const items: FeatureItem[] = [
  {
    iconName: "MessageRounded",
    subtitle: "Contatta le cittadine e i cittadini in modo rapido e sicuro",
    title: "Inviare messaggi",
  },
  {
    iconName: "PaymentsRounded",
    subtitle: "Invia avvisi di pagamento e riduci i tempi di incasso",
    title: "Ottenere pagamenti",
  },
  {
    iconName: "CreateRounded",
    subtitle:
      "Richiedi la firma digitale di documenti e contratti grazie a Firma con IO ",
    title: "Far firmare documenti",
  },
];

export const Showcase: StoryObj<typeof Feature> = {
  args: {
    items,
    title: "Feature Title",
    subtitle: "Feature Subtitle",
  },
};

export const DarkShowcase: StoryObj<typeof Feature> = {
  args: {
    items,
    title: "Feature Title",
    subtitle: "Feature Subtitle",
    useDarkTheme: true,
  },
};
