# How to Trust AI

This directory contains the promptfoo configuration for evaluating AI models used in the class "How to Trust AI", appling principles from "Speed of Trust" by Covey

## In this Directory

- `simple.config.yaml` - Simple promptfoo configuration  demonstrating deterministic evalus, and some basic LLM-as-judge evals for a stripped down "create-prd" prompt. Use this for a 'hello world' introduction to promptfoo, and to introduce the basic EDD loop. 
- `advanced.config.yaml` - Advanced promptfoo configuration demonstrating more complex evaluations, meant for demonstrating the Load-Bearing Principle, and Model Economics.
- `simple.prompt.md` - The simple prompt used in `simple.config.yaml`, follows a stripped down RTCC prompt structure for generating a PRD. 
- `advanced.prompt.md` - The advanced prompt used in `advanced.config.yaml`, follows a more comprehensive RTCC prompt structure for generating a PRD, with some built in fluff for demonstrating the Load-Bearing Principle.

## How to run the Evals here

```bash
npm run test ./trust-ai/simple.config.yaml
npm run test ./trust-ai/advanced.config.yaml
```