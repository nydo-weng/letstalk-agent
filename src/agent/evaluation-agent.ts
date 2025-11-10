import { Scenario, Evaluation } from "./schemas";
import { runEvaluateSpeechTool, runGenerateScenarioTool } from "../mastra";

/**
 * 执行完整的英语口语评估
 */
export async function evaluateSpokenEnglish(
  apiKey: string,
  transcription: string,
  scenario: Scenario
): Promise<Evaluation> {
  try {
    const evaluation = await runEvaluateSpeechTool({
      apiKey,
      scenario,
      transcription,
      temperature: 0.7
    });
    return evaluation as Evaluation;
  } catch (error) {
    console.error("Evaluation error:", error);
    throw new Error(`Failed to evaluate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 生成随机场景
 */
export async function generateRandomScenario(apiKey: string): Promise<Scenario> {
  try {
    const scenario = await runGenerateScenarioTool({
      apiKey,
      temperature: 0.9
    });
    return scenario as Scenario;
  } catch (error) {
    console.error("Scenario generation error:", error);
    throw new Error(`Failed to generate scenario: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
