import { Icon } from '@iconify/react';
import type { Meta, StoryObj } from '@storybook/react';
import Header from '@components/Header';

const meta = {
  title: 'components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AIChatHeader: Story = {
  args: { rightItems: [<Icon icon="octicon:sidebar-expand-24" />] }
};

export const HumanChatHeader: Story = {
  args: { rightItems: [<Icon icon="basil:chat-outline" />]}
};
