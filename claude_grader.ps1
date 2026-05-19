# Claude Code CLI grader for promptfoo llm-rubric assertions
#
# promptfoo sends graders a JSON chat array: [{role, content}, ...]
# This script parses that array, routes the system message via --system-prompt
# (which replaces Claude Code's default prompt, stripping project context),
# and passes the user message as the actual prompt.

$Prompt = $args[0]

# Parse the JSON chat message array that promptfoo sends to graders
try {
    $Messages = $Prompt | ConvertFrom-Json
    $SystemMsg = ($Messages | Where-Object { $_.role -eq 'system' } | Select-Object -First 1).content
    $UserMsg   = ($Messages | Where-Object { $_.role -eq 'user'   } | Select-Object -First 1).content
} catch {
    # Fallback: treat the whole thing as a user message
    $SystemMsg = "You are an evaluator. Respond with only valid JSON: {`"pass`": bool, `"score`": 0.0-1.0, `"reason`": `"string`"}"
    $UserMsg   = $Prompt
}

# --system-prompt replaces Claude Code's default system prompt entirely,
# so the promptfoo rubric grading instructions are used verbatim.
$Result = claude -p $UserMsg --system-prompt $SystemMsg --model haiku 2>&1

Write-Output $Result
