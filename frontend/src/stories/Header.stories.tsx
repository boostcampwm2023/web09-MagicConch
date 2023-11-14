import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '@iconify/react';

import Header from '@components/Header';
import CustomButton from '@components/CustomButton';

const meta = {
  title: 'components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'colored',
      values: [
        { name: 'colored', value: '#181818' },
      ],
    },
  },

  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AIChatHeader: Story = {
  args: {
  rightItems: [
    <CustomButton color="transparent" size="s">
      <Icon icon="octicon:sidebar-expand-24" />
    </CustomButton>
  ]}
};

export const HumanChatHeader: Story = {
  args: {
  rightItems: [
    <CustomButton color="active" size="s">
      상담 종료
    </CustomButton>
    ,
    <CustomButton color="transparent" size="s">
      <Icon icon="basil:chat-outline" />
    </CustomButton>
  ]}
};
