import { cn } from "@/lib/utils"

type MessageSender = "applicant" | "bot"

type Message = {
  id: string
  sender: MessageSender
  content: string
  timestamp?: string
}

type MessageBubbleProps = {
  sender: MessageSender
  content: string
  timestamp?: string
}

function MessageBubble({ sender, content, timestamp }: MessageBubbleProps) {
  const isApplicant = sender === "applicant"

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isApplicant ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 text-sm leading-relaxed",
          isApplicant
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {content}
      </div>
      {timestamp ? (
        <span className="px-1 text-xs text-muted-foreground">{timestamp}</span>
      ) : null}
    </div>
  )
}

export { MessageBubble }
export type { Message, MessageSender }
