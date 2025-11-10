import { z } from 'zod';
import OpenAI from 'openai';

const ScenarioSchema = z.object({
  prompt: z.string().describe("The scenario prompt for the user"),
  context: z.string().describe("Background context for the scenario"),
  category: z.enum([
    "daily",
    "business",
    "travel",
    "shopping",
    "dining",
    "medical",
    "social",
    "education"
  ]).describe("Category of the scenario"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).describe("Difficulty level")
});
const GrammarErrorSchema = z.object({
  original: z.string().describe("The incorrect phrase"),
  correction: z.string().describe("The corrected phrase"),
  explanation: z.string().describe("Why it's wrong and how to fix it"),
  severity: z.enum(["minor", "moderate", "major"]).describe("How serious the error is")
});
const PronunciationIssueSchema = z.object({
  word: z.string().describe("The word with pronunciation issue"),
  issue: z.string().describe("What's wrong with the pronunciation"),
  suggestion: z.string().describe("How to improve"),
  commonMistake: z.string().describe("Common mistake pattern (e.g., 'th' sounds like 's'). Use empty string if none.")
});
const RelevanceAnalysisSchema = z.object({
  isRelevant: z.boolean().describe("Whether the response fits the scenario"),
  analysis: z.string().describe("Detailed explanation of relevance"),
  missingPoints: z.array(z.string()).describe("Important points that should have been mentioned. Use an empty array when nothing is missing.")
});
const FluencyFeedbackSchema = z.object({
  issues: z.array(z.string()).describe("Fluency issues identified"),
  suggestions: z.array(z.string()).describe("How to improve fluency")
});
const ScoresSchema = z.object({
  pronunciation: z.number().min(0).max(100).describe("Pronunciation score"),
  grammar: z.number().min(0).max(100).describe("Grammar score"),
  relevance: z.number().min(0).max(100).describe("Relevance to scenario score"),
  fluency: z.number().min(0).max(100).describe("Fluency and naturalness score"),
  overall: z.number().min(0).max(100).describe("Overall score")
});
const FeedbackSchema = z.object({
  grammar: z.array(GrammarErrorSchema).describe("Grammar errors found"),
  pronunciation: z.array(PronunciationIssueSchema).describe("Pronunciation issues"),
  relevance: RelevanceAnalysisSchema.describe("Scenario relevance analysis"),
  fluency: FluencyFeedbackSchema.describe("Fluency feedback")
});
const EvaluationSchema = z.object({
  transcription: z.string().describe("The transcribed text from the audio"),
  scores: ScoresSchema.describe("Numerical scores for different aspects"),
  feedback: FeedbackSchema.describe("Detailed feedback"),
  suggestedResponse: z.string().describe("A model response for this scenario"),
  summary: z.string().describe("Overall encouraging feedback and key takeaways"),
  nextScenario: ScenarioSchema.describe("Next practice scenario")
});
const TranscriptionSchema = z.object({
  text: z.string(),
  words: z.array(z.object({
    word: z.string(),
    start: z.number(),
    end: z.number()
  })).optional()
});

function generateEvaluationPrompt(scenario, transcription) {
  return `You are an expert English speaking coach specializing in ESL (English as a Second Language) education.

SCENARIO:
Prompt: ${scenario.prompt}
Context: ${scenario.context}
Category: ${scenario.category}
Difficulty: ${scenario.difficulty}

STUDENT'S TRANSCRIPTION:
${transcription}

Please provide a comprehensive evaluation. Your task is to:

1. **Grammar Analysis**:
   - Identify all grammar errors (tense, articles, prepositions, word order, etc.)
   - Provide corrections and clear explanations
   - Rate severity: minor (doesn't affect understanding), moderate (slightly confusing), major (significantly impacts clarity)

2. **Pronunciation Analysis**:
   - Based on the transcription, identify potential pronunciation issues
   - Look for common ESL mistakes: th/s confusion, v/w confusion, l/r confusion, missing or wrong syllables
   - If words seem misspelled or odd in the transcription, they might indicate pronunciation problems
   - Example: "sank you" instead of "thank you" suggests a 'th' pronunciation issue

3. **Relevance Analysis**:
   - Does the response appropriately address the scenario?
   - Is it contextually appropriate?
   - What important points are missing (if any)? Return the \`missingPoints\` list even when it's empty (use [] when nothing is missing).

4. **Fluency Analysis**:
   - Identify issues with natural flow, word choice, or phrasing
   - Suggest more natural alternatives

5. **Suggested Response**:
   - Provide a model answer that demonstrates natural, correct English for this scenario
   - Make it appropriate for the difficulty level

6. **Overall Summary**:
   - Start with genuine praise for what they did well
   - Highlight 2-3 key areas to improve
   - End with encouragement
   - Keep it supportive and motivating

7. **Generate Next Scenario**:
   - Create a completely new, random English speaking practice scenario
   - Make it different from the current one
   - Vary the category and difficulty
   - Provide clear prompt and helpful context

Remember: Be encouraging but honest. Focus on the most impactful improvements first. Students learn best with specific, actionable feedback delivered kindly.`;
}
function generateScenarioPrompt() {
  return `Generate a random English speaking practice scenario for ESL learners.

Requirements:
- Create a realistic, practical situation
- Provide clear context and background
- Make it engaging and relevant to real-world communication
- Vary the category (daily life, business, travel, shopping, dining, medical, social, education)
- Vary the difficulty (beginner, intermediate, advanced)
- The prompt should be clear and specific about what the student should do

Examples of good scenarios:
- "You are at a coffee shop ordering your favorite drink. Describe what you want in detail." (beginner, dining)
- "You need to explain to your manager why your project is delayed. Give reasons and propose a new timeline." (advanced, business)
- "Call a doctor's office to schedule an appointment. Mention your symptoms and availability." (intermediate, medical)

Generate ONE new, creative scenario now.`;
}

let openaiClient = null;
function getOpenAIClient(apiKey) {
  if (!openaiClient || openaiClient.apiKey !== apiKey) {
    openaiClient = new OpenAI({
      apiKey
    });
  }
  return openaiClient;
}
async function transcribeAudio(apiKey, audioFile, language = "en") {
  const client = getOpenAIClient(apiKey);
  try {
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language,
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });
    return {
      text: transcription.text,
      words: transcription.words
      // TypeScript 类型可能不完整
    };
  } catch (error) {
    console.error("Whisper transcription error:", error);
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export { EvaluationSchema as E, ScenarioSchema as S, TranscriptionSchema as T, generateEvaluationPrompt as a, generateScenarioPrompt as b, getOpenAIClient as g, transcribeAudio as t };
