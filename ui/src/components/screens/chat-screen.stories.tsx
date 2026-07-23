import type { Meta, StoryObj } from "@storybook/react-vite"

import { ChatScreen } from "./chat-screen"

const meta = {
  title: "Screens/ChatScreen",
  component: ChatScreen,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChatScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
