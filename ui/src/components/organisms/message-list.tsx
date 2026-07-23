import {
  MessageBubble,
  type Message,
} from "@/components/molecules/message-bubble"
import { TypingIndicator } from "@/components/molecules/typing-indicator"

type MessageListProps = {
  messages: Message[]
  isTyping?: boolean
}

function MessageList({ messages, isTyping = false }: MessageListProps) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          sender={message.sender}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      {isTyping ? <TypingIndicator /> : null}
    </div>
  )
}

export { MessageList }
