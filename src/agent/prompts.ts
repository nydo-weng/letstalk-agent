import { Scenario } from "./schemas";

/**
 * 生成评估 prompt
 */
export function generateEvaluationPrompt(scenario: Scenario, transcription: string): string {
 return `You are an expert English speaking coach specializing in ESL (English as a Second Language) education.

SCENARIO:
Prompt (English): ${scenario.prompt}
Prompt (Chinese): ${scenario.promptZh}
Context (English): ${scenario.context}
Context (Chinese): ${scenario.contextZh}
Category: ${scenario.category}
Difficulty: ${scenario.difficulty}

STUDENT'S TRANSCRIPTION:
${transcription}

 Please provide a comprehensive evaluation. Your task is to:

Overall scoring rules (IMPORTANT):
- All numerical scores (pronunciation, grammar, relevance, fluency, overall) must be on a 0-100 scale where 0 means “very weak” and 100 means “excellent”.
- Return integers only (no decimals).
- The overall score should roughly reflect the weighted average of the other sub-scores.

1. **Grammar Analysis**:
   - Identify all grammar errors (tense, articles, prepositions, word order, etc.)
   - Provide corrections and clear explanations (in English, but you may add a short Chinese explanation if needed)
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
   - Suggest more natural alternatives. Provide short Chinese hints if it helps clarity.

5. **Suggested Response**:
   - Provide a model answer that demonstrates natural, correct English for this scenario
   - Also include a Simplified Chinese translation of the model answer so learners understand the meaning
   - Map these to the JSON fields \`suggestedResponse\` (English) and \`suggestedResponseZh\` (Chinese)
   - Make it appropriate for the difficulty level

6. **Overall Summary**:
   - Start with genuine praise for what they did well (in Simplified Chinese)
   - Highlight 2-3 key areas to improve (in Simplified Chinese, you may reference English phrases if needed)
   - End with encouragement (in Simplified Chinese)
   - Keep it supportive and motivating

7. **Generate Next Scenario**:
   - Create a completely new, random English speaking practice scenario
   - Make it different from the current one
   - Vary the category and difficulty
   - Provide clear prompt and helpful context
   - Output both English and Simplified Chinese fields (\`prompt\`, \`promptZh\`, \`context\`, \`contextZh\`)

Remember: Be encouraging but honest. Focus on the most impactful improvements first. Students learn best with specific, actionable feedback delivered kindly.`;
}

/**
 * 生成随机场景的 prompt
 */
export function generateScenarioPrompt(): string {
  return `Generate a random English speaking practice scenario for ESL learners.

Requirements:
- Create a realistic, practical situation
- Provide clear context and background
- Make it engaging and relevant to real-world communication
- You MUST output both English and Simplified Chinese versions of the prompt and context.
- Vary the category (daily life, business, travel, shopping, dining, medical, social, education)
- Vary the difficulty (beginner, intermediate, advanced)
- The prompt should be clear and specific about what the student should do
- Output JSON fields:
  - prompt: English version of the prompt.
  - promptZh: Simplified Chinese version of the prompt.
  - context: English version of the context/background.
  - contextZh: Simplified Chinese version of the context/background.
  - category: one of the allowed categories.
  - difficulty: one of the allowed levels.

Examples of good scenarios:
- "You are at a coffee shop ordering your favorite drink. Describe what you want in detail." (beginner, dining)
- "You need to explain to your manager why your project is delayed. Give reasons and propose a new timeline." (advanced, business)
- "Call a doctor's office to schedule an appointment. Mention your symptoms and availability." (intermediate, medical)

Generate ONE new, creative scenario now.`;
}
