import { getOpenAIClient } from "../utils/openai";
import { Scenario, Evaluation, EvaluationSchema, ScenarioSchema } from "./schemas";
import { generateEvaluationPrompt, generateScenarioPrompt } from "./prompts";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * 执行完整的英语口语评估
 */
export async function evaluateSpokenEnglish(
  apiKey: string,
  transcription: string,
  scenario: Scenario
): Promise<Evaluation> {
  const client = getOpenAIClient(apiKey);

  const evaluationPrompt = generateEvaluationPrompt(scenario, transcription);

  try {
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
          }) as any
        }
      },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);
    return result as Evaluation;
  } catch (error) {
    console.error("Evaluation error:", error);
    throw new Error(`Failed to evaluate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 生成随机场景
 */
export async function generateRandomScenario(apiKey: string): Promise<Scenario> {
  const client = getOpenAIClient(apiKey);

  const scenarioPrompt = generateScenarioPrompt();

  try {
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
          }) as any
        }
      },
      temperature: 0.9, // Higher temperature for more variety
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content);
    return result as Scenario;
  } catch (error) {
    console.error("Scenario generation error:", error);
    throw new Error(`Failed to generate scenario: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
