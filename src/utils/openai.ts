import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

/**
 * 获取或创建 OpenAI 客户端实例
 */
export function getOpenAIClient(apiKey: string): OpenAI {
  if (!openaiClient || openaiClient.apiKey !== apiKey) {
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openaiClient;
}

/**
 * 使用 Whisper 进行语音转文本
 */
export async function transcribeAudio(
  apiKey: string,
  audioFile: File,
  language: string = "en"
): Promise<{ text: string; words?: Array<{ word: string; start: number; end: number }> }> {
  const client = getOpenAIClient(apiKey);

  try {
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: language,
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    return {
      text: transcription.text,
      words: (transcription as any).words, // TypeScript 类型可能不完整
    };
  } catch (error) {
    console.error("Whisper transcription error:", error);
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
