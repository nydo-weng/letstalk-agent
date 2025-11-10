import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { transcribeAudio } from "../utils/openai";
import { TranscriptionSchema } from "./schemas";

const TranscribeToolInputSchema = z.object({
  audioFile: z.any().describe("Audio file to transcribe"),
  language: z.string().default("en").describe("Language code (e.g., 'en' for English)"),
  apiKey: z.string().optional().describe("Optional OpenAI API key override")
});

/**
 * Whisper 语音转文本工具
 */
export const transcribeTool = createTool({
  id: "transcribe-audio",
  description: "Convert speech audio to text using OpenAI Whisper. Returns transcribed text with optional word-level timestamps.",
  inputSchema: TranscribeToolInputSchema,
  outputSchema: TranscriptionSchema,
  execute: async ({ context }) => handleTranscriptionRequest(context)
});

export const runTranscribeTool = async (input: z.infer<typeof TranscribeToolInputSchema>) => {
  return handleTranscriptionRequest(input);
};

const handleTranscriptionRequest = async (input: z.infer<typeof TranscribeToolInputSchema>) => {
  const { audioFile, language, apiKey } = input;
  const resolvedKey = resolveApiKey(apiKey);

  if (!isFileInput(audioFile)) {
    throw new Error("audioFile must be a File instance");
  }

  const result = await transcribeAudio(resolvedKey, audioFile, language);
  return result;
};

const isFileInput = (value: unknown): value is File => {
  return typeof value === "object" && value !== null && "arrayBuffer" in (value as any) && "name" in (value as any);
};

const resolveApiKey = (explicitKey?: string): string => {
  if (explicitKey) {
    return explicitKey;
  }
  if (typeof process !== "undefined" && process.env?.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  throw new Error("OpenAI API key not provided");
};
