import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { S as ScenarioSchema, g as getOpenAIClient, b as generateScenarioPrompt } from '../openai.mjs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import 'openai';

const ScenarioToolInputSchema = z.object({
  apiKey: z.string().optional().describe("Optional OpenAI API key override"),
  temperature: z.number().min(0).max(1).default(0.9).describe("Sampling temperature for scenario creativity")
});
const generateScenarioTool = createTool({
  id: "generate_scenario",
  description: "Generate a creative ESL speaking practice scenario with context, category, and difficulty.",
  inputSchema: ScenarioToolInputSchema,
  outputSchema: ScenarioSchema,
  execute: async ({ context }) => handleScenarioRequest(context)
});
const runGenerateScenarioTool = async (input) => {
  return handleScenarioRequest(input);
};
const handleScenarioRequest = async (input) => {
  const { apiKey, temperature } = input;
  const resolvedKey = resolveApiKey(apiKey);
  const client = getOpenAIClient(resolvedKey);
  const scenarioPrompt = generateScenarioPrompt();
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a creative ESL teaching assistant that generates engaging practice scenarios."
      },
      {
        role: "user",
        content: scenarioPrompt
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "scenario",
        strict: true,
        schema: zodToJsonSchema(ScenarioSchema, {
          target: "openApi3",
          $refStrategy: "none"
        })
      }
    },
    temperature
  });
  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }
  return JSON.parse(content);
};
const resolveApiKey = (explicitKey) => {
  if (explicitKey) {
    return explicitKey;
  }
  if (typeof process !== "undefined" && process.env?.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  throw new Error("OpenAI API key not provided");
};

export { generateScenarioTool, runGenerateScenarioTool };
