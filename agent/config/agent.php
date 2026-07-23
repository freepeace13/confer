<?php

return [
    'default' => env('AI_PROVIDER', 'claude'),

    'fallback_chain' => ['claude', 'openai'],

    'drivers' => [
        'claude' => [
            'key' => env('ANTHROPIC_API_KEY'),
            'model' => env('CLAUDE_MODEL', 'claude-opus-4-6'),
            'base_url' => env('ANTHROPIC_BASE_URL'),
        ],

        'openai' => [
            'key' => env('OPENAI_API_KEY'),
            'model' => env('OPENAI_MODEL', 'gpt-4o'),
        ],
    ],
];