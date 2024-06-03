import { Meta, StoryObj } from "@storybook/react";
import TypographyPart from "../../../nextjs-website/src/components/atoms/TypographyPart/TypographyPart";

const meta: Meta<typeof TypographyPart> = {
  title: "Atoms/TypographyPart",
  component: TypographyPart,
};

export default meta;

export const Showcase: StoryObj<typeof TypographyPart> = {
  args: {
    text: "This is a text",
    variant: "h1",
  },
};