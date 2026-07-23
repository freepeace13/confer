<?php

namespace Confer\Agent\Drivers;

interface AiDriver
{
    /**
     * Analyze message for vibe check signals
     */
    public function analyzeJson(
        string $prompt,
        int $tokens = 400,
        array $options = []
    ): array;

    /**
     * Generate text response
     */
    public function generate(
        string $prompt,
        int $tokens = 150,
        array $options = []
    ): string;

    /**
     * Stream tokens back in real-time
     */
    public function stream(
        string $prompt,
        callable $callback, // called for each token: fn($token) => ...
        array $options = []
    ): void;

    /**
     * Get provider name for logging/metrics
     */
    public function getName(): string;

    /**
     * Check if provider is available (rate limits, auth, etc.)
     */
    public function isHealthy(): bool;

    /**
     * Track usage for cost + quota
     */
    public function recordUsage(string $operation, array $metadata): void;
}