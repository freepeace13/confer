import { useState } from "react"

import type { Meta, StoryObj } from "@storybook/react-vite"

import { MessageComposer } from "./message-composer"

const meta = {
  title: "Molecules/MessageComposer",
  component: MessageComposer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <MessageComposer
        {...args}
        value={value}
        onChange={setValue}
        onSend={() => setValue("")}
      />
    )
  },
} satisfies Meta<typeof MessageComposer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: "", onChange: () => {}, onSend: () => {} },
}

export const Disabled: Story = {
  args: { value: "", onChange: () => {}, onSend: () => {}, disabled: true },
}
