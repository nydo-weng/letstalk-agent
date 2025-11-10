import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { S as ScenarioSchema, E as EvaluationSchema, g as getOpenAIClient, a as generateEvaluationPrompt } from '../openai.mjs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import 'openai';

const EvaluationToolInputSchema = z.object({
  apiKey: z.string().optional().describe("Optional OpenAI API key override"),
  scenario: ScenarioSchema.describe("Scenario used for the student's response"),
  transcription: z.string().min(1, "Transcription is required").describe("Transcribed student response"),
  temperature: z.number().min(0).max(1).default(0.7).describe("Sampling temperature when generating evaluation")
});
const evaluateSpeechTool = createTool({
  id: "evaluate_spoken_english",
  description: "Evaluate a spoken English response, returning structured scores, feedback, and next scenario.",
  inputSchema: EvaluationToolInputSchema,
  outputSchema: EvaluationSchema,
  execute: async ({ context }) => handleEvaluationRequest(context)
});
const runEvaluateSpeechTool = async (input) => {
  return handleEvaluationRequest(input);
};
const handleEvaluationRequest = async (input) => {
  const { apiKey, scenario, transcription, temperature } = input;
  const resolvedKey = resolveApiKey(apiKey);
  const client = getOpenAIClient(resolvedKey);
  const evaluationPrompt = generateEvaluationPrompt(scenario, transcription);
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert English speaking coach. Provide detailed, structured evaluations in JSON format."
      },
      {
        role: "user",
        content: evaluationPrompt
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "evaluation_result",
        strict: true,
        schema: zodToJsonSchema(EvaluationSchema, {
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
  const parsed = JSON.parse(content);
  parsed.transcription = transcription;
  return parsed;
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

export { evaluateSpeechTool, runEvaluateSpeechTool };
