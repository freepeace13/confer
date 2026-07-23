function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2.5">
        <span className="sr-only">Bot is typing</span>
        <span
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"
          aria-hidden="true"
        />
        <span
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"
          aria-hidden="true"
        />
        <span
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export { TypingIndicator }
