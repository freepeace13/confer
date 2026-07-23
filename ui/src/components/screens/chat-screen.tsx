import { useState } from "react"

import { MessageComposer } from "@/components/molecules/message-composer"
import type { Message } from "@/components/molecules/message-bubble"
import { AppHeader } from "@/components/organisms/app-header"
import { MessageList } from "@/components/organisms/message-list"

const mockMessages: Message[] = [
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
  {
    id: "5",
    sender: "applicant",
    content:
      "Sure — a teammate and I disagreed on a design approach, so we prototyped both and let the data decide.",
    timestamp: "10:34 AM",
  },
]

function ChatScreen() {
  const [draft, setDraft] = useState("")

  return (
    <div className="flex h-svh flex-col">
      <AppHeader />
      <MessageList messages={mockMessages} isTyping />
      <MessageComposer
        value={draft}
        onChange={setDraft}
        onSend={() => setDraft("")}
      />
    </div>
  )
}

export { ChatScreen }
