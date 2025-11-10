import { z } from "zod";

// 场景定义
export const ScenarioSchema = z.object({
  prompt: z.string().describe("The scenario prompt for the user"),
  context: z.string().describe("Background context for the scenario"),
  category: z.enum([
    'daily',
    'business',
    'travel',
    'shopping',
    'dining',
    'medical',
    'social',
    'education'
  ]).describe("Category of the scenario"),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe("Difficulty level")
});

export type Scenario = z.infer<typeof ScenarioSchema>;

// 语法错误
export const GrammarErrorSchema = z.object({
  original: z.string().describe("The incorrect phrase"),
  correction: z.string().describe("The corrected phrase"),
  explanation: z.string().describe("Why it's wrong and how to fix it"),
  severity: z.enum(['minor', 'moderate', 'major']).describe("How serious the error is")
});

export type GrammarError = z.infer<typeof GrammarErrorSchema>;

// 发音问题
export const PronunciationIssueSchema = z.object({
  word: z.string().describe("The word with pronunciation issue"),
  issue: z.string().describe("What's wrong with the pronunciation"),
  suggestion: z.string().describe("How to improve"),
  commonMistake: z.string().describe("Common mistake pattern (e.g., 'th' sounds like 's'). Use empty string if none.")
});

export type PronunciationIssue = z.infer<typeof PronunciationIssueSchema>;

// 相关性分析
export const RelevanceAnalysisSchema = z.object({
  isRelevant: z.boolean().describe("Whether the response fits the scenario"),
  analysis: z.string().describe("Detailed explanation of relevance"),
  missingPoints: z.array(z.string()).describe("Important points that should have been mentioned. Use an empty array when nothing is missing.")
});

export type RelevanceAnalysis = z.infer<typeof RelevanceAnalysisSchema>;

// 流畅度反馈
export const FluencyFeedbackSchema = z.object({
  issues: z.array(z.string()).describe("Fluency issues identified"),
  suggestions: z.array(z.string()).describe("How to improve fluency")
});

export type FluencyFeedback = z.infer<typeof FluencyFeedbackSchema>;

// 评分
export const ScoresSchema = z.object({
  pronunciation: z.number().min(0).max(100).describe("Pronunciation score"),
  grammar: z.number().min(0).max(100).describe("Grammar score"),
  relevance: z.number().min(0).max(100).describe("Relevance to scenario score"),
  fluency: z.number().min(0).max(100).describe("Fluency and naturalness score"),
  overall: z.number().min(0).max(100).describe("Overall score")
});

export type Scores = z.infer<typeof ScoresSchema>;

// 反馈
export const FeedbackSchema = z.object({
  grammar: z.array(GrammarErrorSchema).describe("Grammar errors found"),
  pronunciation: z.array(PronunciationIssueSchema).describe("Pronunciation issues"),
  relevance: RelevanceAnalysisSchema.describe("Scenario relevance analysis"),
  fluency: FluencyFeedbackSchema.describe("Fluency feedback")
});

export type Feedback = z.infer<typeof FeedbackSchema>;

// 完整评估结果
export const EvaluationSchema = z.object({
  transcription: z.string().describe("The transcribed text from the audio"),
  scores: ScoresSchema.describe("Numerical scores for different aspects"),
  feedback: FeedbackSchema.describe("Detailed feedback"),
  suggestedResponse: z.string().describe("A model response for this scenario"),
  summary: z.string().describe("Overall encouraging feedback and key takeaways"),
  nextScenario: ScenarioSchema.describe("Next practice scenario")
});

export type Evaluation = z.infer<typeof EvaluationSchema>;

// Whisper 转录结果
export const TranscriptionSchema = z.object({
  text: z.string(),
  words: z.array(z.object({
    word: z.string(),
    start: z.number(),
    end: z.number()
  })).optional()
});

export type Transcription = z.infer<typeof TranscriptionSchema>;
