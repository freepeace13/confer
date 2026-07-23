# Chat/Interview Screen — Design Spec

Date: 2026-07-23

## Purpose

Confer's core applicant-facing surface is a screening chat between an applicant and a bot (see `docs/architecture.md`). The project currently has atomic-design folders (`ui`, `molecules`, `organisms`) with an `AppHeader` organism and `ThemeToggle` molecule, plus Storybook wired up, but no `screens` folder and no chat UI yet. This spec adds the first screen: a static (no backend/WebSocket) chat/interview screen, built from newly created molecules and organisms, each documented in Storybook.

## Scope

- Static UI only: mock/hardcoded messages, no live send/receive behavior, no network or WebSocket calls.
- Single-column layout: `AppHeader` on top, scrollable message list in the middle, message composer pinned to the bottom. No progress/status strip, no vibe-score/coverage UI (that belongs to a future recruiter/admin view, out of scope here).
- No new shadcn/ui primitives. The composer's textarea is hand-styled using the existing `cva`/`cn` pattern already used by `ui/button.tsx`, to avoid adding a dependency for one element.
- No unit tests requested — Storybook stories are the only testing artifact for this pass.

## File Structure

```
src/components/
  molecules/
    message-bubble.tsx           — one chat message, applicant or bot variant
    message-bubble.stories.tsx
    typing-indicator.tsx         — "Bot is typing…" animated indicator
    typing-indicator.stories.tsx
    message-composer.tsx         — textarea + send button (controlled, presentational)
    message-composer.stories.tsx
  organisms/
    message-list.tsx             — scrollable list of MessageBubble/TypingIndicator
    message-list.stories.tsx
  screens/
    chat-screen.tsx              — composes AppHeader + MessageList + MessageComposer
    chat-screen.stories.tsx
```

## Component Contracts

### `Message` type (defined in `message-bubble.tsx`, imported by `message-list.tsx` and `chat-screen.tsx`)

```ts
type Message = {
  id: string
  sender: "applicant" | "bot"
  content: string
  timestamp?: string
}
```

### `MessageBubble`

- Props: `{ sender: "applicant" | "bot"; content: string; timestamp?: string }`
- Applicant messages: right-aligned, `primary` background/foreground.
- Bot messages: left-aligned, `muted`/`secondary` background/foreground.
- Optional timestamp rendered small and muted beneath the bubble content.

### `TypingIndicator`

- No props.
- Renders a bot-styled bubble (left-aligned, same visual language as a bot `MessageBubble`) containing an animated three-dot indicator and the text "Bot is typing".

### `MessageComposer`

- Props: `{ value: string; onChange: (value: string) => void; onSend: () => void; disabled?: boolean }`
- Controlled textarea + send `Button` (reusing existing `ui/button.tsx`).
- Pure/presentational: no internal side effects beyond calling the provided callbacks. `disabled` disables both the textarea and the send button.

### `MessageList`

- Props: `{ messages: Message[]; isTyping?: boolean }`
- Renders each `Message` via `MessageBubble`, then a `TypingIndicator` at the bottom if `isTyping` is true.
- Scrollable container (`overflow-y-auto`), fills available vertical space.

### `ChatScreen`

- No required props.
- Renders `AppHeader` (existing organism, unmodified) at the top, `MessageList` below it fed with a small hardcoded mock conversation (a short sample screening exchange, 4-6 messages, ending with `isTyping: true` to showcase the typing state), and `MessageComposer` pinned to the bottom.
- Composer's `value`/`onChange` are backed by local `useState` purely so the textarea is functional to type into; `onSend` clears that local input state (visual-only reset, no message appended to the list) since there is no backend in this pass — this is UI plumbing, not application behavior, and satisfies "static UI" scope.
- Full-height single-column flex layout (`flex flex-col h-svh` or similar), header fixed, message list flexes/scrolls, composer fixed at bottom.

## Storybook Conventions

Match existing conventions from `app-header.stories.tsx` / `theme-toggle.stories.tsx`:
- `title: "Molecules/MessageBubble"`, `"Molecules/TypingIndicator"`, `"Molecules/MessageComposer"`, `"Organisms/MessageList"`, `"Screens/ChatScreen"`.
- `tags: ["autodocs"]` on all stories.
- `layout: "fullscreen"` for `MessageList` and `ChatScreen` (matches `AppHeader`'s fullscreen layout); default (centered) layout for the smaller molecules.
- Story variants:
  - `MessageBubble`: `Applicant`, `Bot` stories (and optionally `WithTimestamp`).
  - `TypingIndicator`: `Default`.
  - `MessageComposer`: `Default`, `Disabled` (using Storybook args/controls for `value`).
  - `MessageList`: `Default` (sample conversation), `Typing` (with `isTyping: true`).
  - `ChatScreen`: `Default`.

## Out of Scope (explicitly)

- Real-time/WebSocket wiring, API calls, or any backend integration.
- Vibe score, coverage, or signals UI (recruiter/admin-facing, separate future screen).
- Progress/status strip under the header.
- New shadcn/ui primitives (avatar, textarea component, scroll-area, etc.) — hand-styled inline instead.
- Unit/interaction tests — Storybook stories only.
