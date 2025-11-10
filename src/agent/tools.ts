import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { transcribeAudio } from "../utils/openai";
import { TranscriptionSchema } from "./schemas";

/**
 * Whisper 语音转文本工具
 */
type ToolContext = {
  openaiApiKey?: string;
};

const isFileInput = (value: unknown): value is File => {
  return typeof value === "object" && value !== null && "arrayBuffer" in (value as any) && "name" in (value as any);
};

export const transcribeTool = createTool({
  id: "transcribe-audio",
  description: "Convert speech audio to text using OpenAI Whisper. Returns transcribed text with optional word-level timestamps.",
  inputSchema: z.object({
    audioFile: z.any().describe("Audio file to transcribe"),
    language: z.string().default("en").describe("Language code (e.g., 'en' for English)")
  }),
  outputSchema: TranscriptionSchema,
  execute: async (executionContext) => {
    const { audioFile, language } = executionContext.context;

    // 从 context 获取 API key
    const apiKey =
      (executionContext as ToolContext).openaiApiKey ?? (executionContext as any).openaiApiKey;

    if (!apiKey) {
      throw new Error("OpenAI API key not found in context");
    }

    if (!isFileInput(audioFile)) {
      throw new Error("audioFile must be a File instance");
    }

    const result = await transcribeAudio(apiKey, audioFile, language);
    return result;
  }
});
