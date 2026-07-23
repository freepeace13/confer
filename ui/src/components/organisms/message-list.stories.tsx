import type { Meta, StoryObj } from "@storybook/react-vite"

import type { Message } from "@/components/molecules/message-bubble"

import { MessageList } from "./message-list"

const sampleMessages: Message[] = [
  {
    id: "1",
    sender: "bot",
    content: "Hi! Thanks for joining. Let's start with a quick question.",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    sender: "bot",
    content: "What do you enjoy most about working on a team?",
    timestamp: "10:30 AM",
  },
  {
    id: "3",
    sender: "applicant",
    content: "I love working in teams and figuring out problems together.",
    timestamp: "10:31 AM",
  },
  {
    id: "4",
    sender: "bot",
    content: "Nice! Tell me about a time you disagreed with a teammate.",
    timestamp: "10:32 AM",
  },
]

const meta = {
  title: "Organisms/MessageList",
  component: MessageList,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    messages: sampleMessages,
  },
} satisfies Meta<typeof MessageList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Typing: Story = {
  args: { isTyping: true },
}
