import { Meta, StoryObj } from "@storybook/react";
import { UnorderedList } from "../../../nextjs-website/src/components/atoms/UnorderedList/UnorderedList";

const meta: Meta<typeof UnorderedList> = {
  title: "Atoms/UnorderedList",
  component: UnorderedList,
};

export default meta;

export const Showcase: StoryObj<typeof UnorderedList> = {
  args: {
    listItems: [
      "This is the first item",
      "This is the second item",
      "This is the third item",
    ],
  },
};
