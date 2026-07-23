# Hiring Screening Chat System - UML Diagram

```mermaid
graph TB
    subgraph "Domain Layer - Aggregates"
        ChatRoom["ChatRoom<br/>─────<br/>id: UUID<br/>status: enum<br/>created_at: datetime<br/>closed_at: datetime?<br/>─────<br/>addParticipant()<br/>publishMessage()"]
        
        Participant["Participant<br/>─────<br/>id: UUID<br/>chat_room_id<br/>type: enum[human|bot]<br/>user_id | bot_config_id<br/>joined_at<br/>─────<br/>isBot(): bool"]
        
        Message["Message<br/>─────<br/>id: UUID<br/>room_id<br/>sent_by: Participant<br/>content: string<br/>created_at<br/>metadata: json"]
        
        BotDefinition["BotDefinition<br/>─────<br/>id: UUID<br/>client_id<br/>name: string<br/>persona: string<br/>model: enum<br/>temperature: float<br/>analysis_level: enum<br/>─────<br/>getSystemPrompt()"]
    end

    subgraph "Events - Event Sourcing"
        MessageSent["MessageSent<br/>─────<br/>message_id<br/>room_id<br/>sent_by_id<br/>content<br/>timestamp"]
        
        BotJoinedRoom["BotJoinedRoom<br/>─────<br/>room_id<br/>bot_id<br/>timestamp"]
        
        VibeScoreUpdated["VibeScoreUpdated<br/>─────<br/>room_id<br/>bot_id<br/>score_delta<br/>reason"]
    end

    subgraph "Projections - Read Models"
        VibeCheckProjection["VibeCheckProjection<br/>─────<br/>room_id: UUID<br/>bot_id: UUID<br/>coverage: dict<br/>signals: Signal[]<br/>current_vibe_score: float<br/>gaps: string[]<br/>message_count: int<br/>last_summary: string<br/>─────<br/>updateFromEvent()"]
        
        Signal["Signal<br/>─────<br/>type: enum[positive|red]<br/>topic: string<br/>quote: string<br/>timestamp"]
    end

    subgraph "AI Provider Layer - Manager Pattern"
        AiProviderManager["AiProviderManager<br/>extends Manager<br/>─────<br/>getDefaultDriver()<br/>best(): AiDriver<br/>driver(name): AiDriver<br/>fallback_chain"]
        
        AiDriver["AiDriver ≪interface≫<br/>─────<br/>analyzeJson(prompt, tokens)<br/>generate(prompt, tokens)<br/>stream(prompt, callback)<br/>getName(): string<br/>isHealthy(): bool<br/>recordUsage()"]
        
        ClaudeDriver["ClaudeDriver<br/>implements AiDriver<br/>─────<br/>client: Anthropic<br/>model: string<br/>healthStatus: dict<br/>─────<br/>calculateCost()"]
        
        OpenAiDriver["OpenAiDriver<br/>implements AiDriver<br/>─────<br/>client: OpenAI<br/>model: string"]
        
        OllamaDriver["OllamaDriver<br/>implements AiDriver<br/>─────<br/>baseUrl: string<br/>model: string"]
    end

    subgraph "Jobs - Async Processing"
        AnalyzeVibeCheckMsg["AnalyzeVibeCheckMessage<br/>implements ShouldQueue<br/>─────<br/>handle()<br/>analyzeNewMessage()<br/>generateIncrementalSummary()"]
        
        DecideNextQuestion["DecideNextVibeCheckQuestion<br/>implements ShouldQueue<br/>─────<br/>handle()<br/>selectNextGap()<br/>generateQuestion()"]
        
        PublishBotMessage["PublishBotMessage<br/>─────<br/>dispatch(room_id, bot_id, content)<br/>broadcast over WebSocket"]
    end

    subgraph "Real-time Transport"
        WebSocketListener["WebSocket Channel<br/>room.{id}<br/>─────<br/>presence: who's online<br/>typing indicators<br/>message broadcasts"]
        
        EphemeralChannel["Ephemeral Streaming Channel<br/>room.{id}.streaming<br/>─────<br/>BotTokenStreamed<br/>BotTypingStarted"]
    end

    subgraph "Logging & Observability"
        AiUsageLog["AiUsageLog<br/>─────<br/>provider: string<br/>operation: string<br/>model: string<br/>input_tokens: int<br/>output_tokens: int<br/>cost_usd: float<br/>recorded_at"]
        
        EventStore["EventStore<br/>─────<br/>stream all events<br/>per aggregate<br/>event_type<br/>aggregate_id<br/>payload"]
    end

    subgraph "Configuration"
        Config["config/ai-providers.php<br/>─────<br/>default: string<br/>fallback_chain: array<br/>drivers: dict<br/>bot_drivers: dict"]
    end

    %% Domain relationships
    ChatRoom -->|contains| Participant
    ChatRoom -->|generates| Message
    Participant -->|references| BotDefinition
    Message -->|sent by| Participant

    %% Event relationships
    Message -->|triggers| MessageSent
    Participant -->|triggers| BotJoinedRoom
    VibeCheckProjection -->|updates via| VibeScoreUpdated

    %% Projection relationships
    MessageSent -->|rebuilds| VibeCheckProjection
    VibeCheckProjection -->|contains| Signal

    %% AI Provider relationships
    AiProviderManager -->|creates & manages| AiDriver
    AiDriver -->|implemented by| ClaudeDriver
    AiDriver -->|implemented by| OpenAiDriver
    AiDriver -->|implemented by| OllamaDriver

    %% Job relationships
    MessageSent -->|triggers| AnalyzeVibeCheckMsg
    AnalyzeVibeCheckMsg -->|uses| AiDriver
    AnalyzeVibeCheckMsg -->|updates| VibeCheckProjection
    AnalyzeVibeCheckMsg -->|triggers| DecideNextQuestion
    DecideNextQuestion -->|uses| AiDriver
    DecideNextQuestion -->|publishes| PublishBotMessage
    PublishBotMessage -->|broadcasts| WebSocketListener

    %% Real-time relationships
    AnalyzeVibeCheckMsg -->|streams tokens via| EphemeralChannel
    PublishBotMessage -->|persists & broadcasts| MessageSent

    %% Logging relationships
    AiDriver -->|logs usage| AiUsageLog
    ChatRoom -->|generates| EventStore
    Message -->|stored in| EventStore

    %% Config relationships
    AiProviderManager -->|reads| Config
    Config -->|drives| ClaudeDriver
    Config -->|drives| OpenAiDriver
    Config -->|drives| OllamaDriver

    %% Styling
    classDef aggregate fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef event fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef projection fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef provider fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef job fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef realtime fill:#fff9c4,stroke:#f57f17,stroke-width:2px

    class ChatRoom,Participant,Message,BotDefinition aggregate
    class MessageSent,BotJoinedRoom,VibeScoreUpdated event
    class VibeCheckProjection,Signal projection
    class AiProviderManager,AiDriver,ClaudeDriver,OpenAiDriver,OllamaDriver provider
    class AnalyzeVibeCheckMsg,DecideNextQuestion,PublishBotMessage job
    class WebSocketListener,EphemeralChannel realtime
```

## Architecture Layers Explained

### 🟦 Domain Layer (Aggregates)
**The heart of your business logic**

- **ChatRoom**: Root aggregate holding the interview session
- **Participant**: Polymorphic entity (human applicant or bot)
- **Message**: Immutable event record of each exchange
- **BotDefinition**: Client-defined bot configuration (persona, model, behavior)

These are your core domain models—everything else is infrastructure.

---

### 🟧 Event Sourcing Layer
**Immutable history of what happened**

- **MessageSent**: Every message is an event first, persisted second
- **BotJoinedRoom**: Bots entering are events (allows replay/auditing)
- **VibeScoreUpdated**: Scoring updates are versioned (no retroactive changes)

Source of truth = Event Store. Everything else is derived.

---

### 🟪 Projection Layer (CQRS Read Model)
**Optimized for fast reads**

- **VibeCheckProjection**: Redis-cached view of (bot, room) vibe state
  - Evolves incrementally (no full transcript replay)
  - Stores: coverage, signals, score, gaps, summary
  - Cache miss → rebuild from EventStore
  - TTL: 7 days or until room closes

- **Signal**: Granular observations (positive/red flags tied to topics)

This is why you get sub-millisecond lookups despite complex analysis.

---

### 🟩 AI Provider Layer (Manager Pattern)
**Pluggable AI backends**

- **AiProviderManager**: Laravel Manager class for driver registration + fallback
  - Default driver from config
  - Fallback chain if primary fails
  - Per-bot driver overrides
  
- **AiDriver Interface**: Contract all providers implement
  - `analyzeJson()`: Parse messages into signals
  - `generate()`: Create bot responses
  - `stream()`: Token-by-token streaming
  - `isHealthy()`: Health checks before use
  - `recordUsage()`: Cost tracking
  
- **Concrete Drivers**: Claude, OpenAI, Ollama (drop in new ones anytime)

**Why this matters**: You can swap providers without touching bot logic. Test with Ollama locally, run production on Claude.

---

### 🟥 Jobs Layer (Async Processing)
**Non-blocking AI orchestration**

- **AnalyzeVibeCheckMessage** (ShouldQueue)
  - Triggered by MessageSent event
  - Calls driver→analyzeJson()
  - Updates VibeCheckProjection
  - Triggers next job
  
- **DecideNextVibeCheckQuestion** (ShouldQueue)
  - Selects gap in coverage
  - Calls driver→generate()
  - Publishes bot message
  
- **PublishBotMessage**
  - Persists as MessageSent event
  - Broadcasts to room channel

**Applicant UX**: Their message appears instantly (20ms). Bot analysis + response generation happens async in background (2-3 seconds). No blocking.

---

### 🟨 Real-time Transport
**WebSocket-driven UX**

- **Presence Channel** (`room.{id}`)
  - Who's online (applicant, bot 1, bot 2)
  - Message broadcasts
  - Final bot responses pushed here
  
- **Ephemeral Streaming Channel** (`room.{id}.streaming`)
  - Token-by-token bot generation
  - Typing indicators ("Bot is thinking...")
  - Disappears on stream complete

**Why separate**: Final message is persisted; intermediate tokens are ephemeral. No garbage in your database.

---

### 📊 Logging & Observability

- **AiUsageLog**: Every API call tracked
  - Provider, operation, model, tokens, cost
  - Query: "Which bot cost most this week?"
  - Implement quota checks per-bot
  
- **EventStore**: Immutable audit trail
  - Every state change logged
  - Replay capability
  - Compliance/screening appeal records

---

## Data Flow: Applicant Responds

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Applicant types "I love working in teams"                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend emits MessageSent event                          │
│    Payload: {message_id, room_id, sent_by: applicant_id}    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Message persisted to EventStore                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Broadcast to room.{id} channel                            │
│    ✓ Applicant sees message instantly (20ms)                │
│    ✓ Other participants notified                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Queue AnalyzeVibeCheckMessage job (async)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
         ┌──────────────────┴──────────────────┐
         ↓                                     ↓
   [5 sec later...]                   [Running in worker]
   Applicant refreshes,
   Bot is still typing               1. Load Projection
                                     2. Resolve AiDriver
                                     3. Call analyzeJson()
                                        → Claude analyzes
                                           "love teams" = +0.3 score
                                           topics: [collaboration]
                                           signals: [positive - teamwork]
                                     4. Update Projection
                                        ✓ Score: 6.8 → 7.1
                                        ✓ Coverage: add 'collaboration'
                                        ✓ Signals: add observation
                                     5. Log to AiUsageLog
                                     6. Queue DecideNextQuestion
                                        ↓
                                        Select gap: 'conflict resolution'
                                        Call generate() for question
                                        → Claude responds in 2 sec
                                        → Publish bot message
                                        ↓
                                        Broadcast to room
                                        ✓ Applicant sees:
                                          "Nice! Tell me about a time
                                           you disagreed with a teammate"
```

---

## Config-Driven Behavior

```php
// Use Claude for expensive screening
'bot_drivers' => [
    'senior-tech-bot' => 'claude',
    'culture-fit-bot' => 'best',           // Fallback chain
    'quick-screening-bot' => 'ollama',    // Local/cheap
];

// Fallback if primary provider fails
'fallback_chain' => ['claude', 'openai', 'ollama'];

// Cost: Claude → OpenAI → Ollama (local free)
// Latency: Claude (3s) → OpenAI (2s) → Ollama (500ms)
```

**Result**: Premium screenings get Claude's best output. Budget candidates run on fast local Ollama. No code changes needed.

---

## Why This Architecture?

| Problem | Solution |
|---------|----------|
| **Slow applicant UX** | Async jobs + WebSockets = instant feedback |
| **Expensive LLM calls** | Projection caching + smart re-analysis intervals |
| **Provider lock-in** | Manager pattern + per-bot overrides |
| **Replay/audit trail** | Event sourcing keeps immutable history |
| **Bot context bloat** | Projection holds only signals, not full transcript |
| **Scaling complexity** | Async queue + Redis projection = horizontal scaling |
| **Cost explosion** | Usage logging + driver fallback = cost control |

