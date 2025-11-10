import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { evaluateSpeechTool } from "../tools/evaluation-tool";
import { generateScenarioTool } from "../tools/scenario-tool";
import { transcribeTool } from "../../agent/tools";

/**
 * Speaking Coach Agent
 * 可以在 Mastra Dashboard 中加载，提供场景生成、录音转录、评估等工具。
 */
export const speakingCoachAgent = new Agent({
  name: "speaking-coach",
  description: "Helps ESL learners practise speaking, evaluate responses, and suggest new scenarios.",
  instructions: `
You are an encouraging ESL speaking coach. Use the provided tools to:
- Generate creative practice scenarios when the learner needs something new.
- Transcribe uploaded audio before evaluating it.
- Evaluate the transcription with detailed feedback and scores.

Always be supportive, actionable, and reference the feedback returned by the tools.`,
  model: openai("gpt-4o-mini"),
  tools: {
    generateScenario: generateScenarioTool,
    evaluateSpeech: evaluateSpeechTool,
    transcribeAudio: transcribeTool
  }
});
