#!/bin/bash
# GitHub Copilot CLI provider for promptfoo with model selection

PROMPT="$1"
OPTIONS="$2"
CONTEXT="$3"

# Parse OPTIONS to get model from config
MODEL=$(echo "$OPTIONS" | jq -r '.config.model // ""' 2>/dev/null)

# Build command with optional model flag
if [ -n "$MODEL" ]; then
  gh copilot --prompt "$PROMPT" --model "$MODEL" --allow-all-tools --silent
else
  gh copilot --prompt "$PROMPT" --allow-all-tools --silent
fi