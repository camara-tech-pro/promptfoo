# Promptfoo Configuration

This repository contains promptfoo configuration for evaluating AI CLI tools.

## Important: Default Configuration

**Before committing any changes, always ensure that Devin CLI is set as the default for both:**
1. **Provider**: `devin_provider.sh` (bash) or `devin_provider.ps1` (PowerShell)
2. **Grader**: `devin_grader.sh` (bash) or `devin_grader.ps1` (PowerShell)

This ensures consistent evaluation results and maintains the intended baseline configuration.

## Configuration Files

- `promptfooconfig.yaml` - Main promptfoo configuration
- `prompt-under-test.md` - The prompt being evaluated
- `eval-script.js` - Custom JavaScript evaluation functions

## Provider Scripts

### Bash (Linux/Mac)
- `devin_provider.sh` - Devin CLI provider
- `gh_copilot_provider.sh` - GitHub Copilot CLI provider
- `claude_code_provider.sh` - Claude Code CLI provider

### PowerShell (Windows)
- `devin_provider.ps1` - Devin CLI provider
- `gh_copilot_provider.ps1` - GitHub Copilot CLI provider
- `claude_code_provider.ps1` - Claude Code CLI provider

## Grader Scripts

### Bash (Linux/Mac)
- `devin_grader.sh` - Devin CLI grader for llm-rubric assertions
- `gh_copilot_grader.sh` - GitHub Copilot CLI grader for llm-rubric assertions
- `claude_grader.sh` - Claude Code CLI grader for llm-rubric assertions

### PowerShell (Windows)
- `devin_grader.ps1` - Devin CLI grader for llm-rubric assertions
- `gh_copilot_grader.ps1` - GitHub Copilot CLI grader for llm-rubric assertions
- `claude_grader.ps1` - Claude Code CLI grader for llm-rubric assertions

## Running Evaluations

```bash
npx promptfoo eval
```

## Viewing Results

Results are saved to `results.html` by default. Open this file in a web browser to view the evaluation results.
