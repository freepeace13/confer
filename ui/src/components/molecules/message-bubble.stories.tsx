import type { Meta, StoryObj } from "@storybook/react-vite"

import { MessageBubble } from "./message-bubble"

const meta = {
  title: "Molecules/MessageBubble",
  component: MessageBubble,
  tags: ["autodocs"],
  args: {
    content: "Tell me about a time you disagreed with a teammate.",
  },
} satisfies Meta<typeof MessageBubble>

export default meta
type Story = StoryObj<typeof meta>

export const Bot: Story = {
  args: { sender: "bot" },
}

export const Applicant: Story = {
  args: {
    sender: "applicant",
    content: "I love working in teams and figuring out problems together.",
  },
}

export const WithTimestamp: Story = {
  args: { sender: "bot", timestamp: "10:32 AM" },
}
