#!/usr/bin/env node
// Combined Ollama API provider and grader for promptfoo
//
// Auto-detects mode based on prompt format:
// - Grader mode: Prompt is JSON array [{role, content}, ...]
// - Provider mode: Prompt is plain text
//
// Makes HTTP requests to a local Ollama server
// Configurable via options: host (default localhost), port (default 11434), endpoint (default /api/v1/chat), model (default llama2)

const http = require('http');

const prompt = process.argv[2];
const options = process.argv[3];
const context = process.argv[4];

// Parse options to extract host, port, endpoint, and model
let host = 'localhost'; // Default local host
let port = 11434; // Default Ollama port
let endpoint = '/api/v1/chat'; // Default LM Studio endpoint
let model = 'llama2'; // Default model
if (options && options !== '{}') {
  try {
    const optionsObj = JSON.parse(options);
    if (optionsObj.config) {
      if (optionsObj.config.host) {
        host = optionsObj.config.host;
      }
      if (optionsObj.config.port) {
        port = optionsObj.config.port;
      }
      if (optionsObj.config.endpoint) {
        endpoint = optionsObj.config.endpoint;
      }
      if (optionsObj.config.model) {
        model = optionsObj.config.model;
      }
    }
  } catch (e) {
    // If JSON parsing fails, use defaults
  }
}

// Detect mode: if prompt looks like a JSON array, use grader mode
let isGraderMode = false;
try {
  const parsed = JSON.parse(prompt);
  if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].role) {
    isGraderMode = true;
  }
} catch (e) {
  // Not JSON, so provider mode
}

// Helper function to make HTTP request to Ollama
function callOllama(input) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: model,
      input: input,
      stream: false
    });

    const requestOptions = {
      hostname: host,
      port: port,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Ollama API error: ${res.statusCode} - ${data}`));
          return;
        }

        try {
          const response = JSON.parse(data);
          const output = response.output;
          if (Array.isArray(output) && output.length > 0) {
            const messageOutput = output.find(o => o.type === 'message');
            resolve(messageOutput ? messageOutput.content : output[0].content);
          } else {
            reject(new Error('Unexpected Ollama response format'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Ollama response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Failed to connect to Ollama at ${host}:${port}${endpoint}: ${e.message}`));
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  try {
    if (isGraderMode) {
      // ===== GRADER MODE =====
      // Parse the JSON chat message array that promptfoo sends to graders
      let systemMsg, userMsg;
      try {
        const parsed = JSON.parse(prompt);
        const systemMessage = parsed.find(m => m.role === 'system');
        const userMessage = parsed.find(m => m.role === 'user');

        if (systemMessage && userMessage) {
          systemMsg = systemMessage.content;
          userMsg = userMessage.content;
        } else {
          throw new Error('Missing system or user message');
        }
      } catch (e) {
        // Fallback: treat the whole thing as a user message
        systemMsg = 'You are an evaluator. Respond with only valid JSON: {"pass": bool, "score": 0.0-1.0, "reason": "string"}';
        userMsg = prompt;
      }

      const fullInput = `${systemMsg}\n\n${userMsg}`;
      const output = await callOllama(fullInput);
      console.log(output);
    } else {
      // ===== PROVIDER MODE =====
      const output = await callOllama(prompt);
      console.log(output);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
