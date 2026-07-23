import type { Meta, StoryObj } from "@storybook/react-vite"

import { AppHeader } from "./app-header"

const meta = {
  title: "Organisms/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
