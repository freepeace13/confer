import type { KeyboardEvent } from "react"

import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MessageComposerProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

function MessageComposer({
  value,
  onChange,
  onSend,
  disabled = false,
}: MessageComposerProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-border p-3">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type your response…"
        rows={1}
        className={cn(
          "min-h-9 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30"
        )}
      />
      <Button
        type="button"
        size="icon"
        aria-label="Send message"
        disabled={disabled}
        onClick={onSend}
      >
        <Send />
      </Button>
    </div>
  )
}

export { MessageComposer }
