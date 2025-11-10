import { Scenario } from "./schemas";

/**
 * 生成评估 prompt
 */
export function generateEvaluationPrompt(scenario: Scenario, transcription: string): string {
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

/**
 * 生成随机场景的 prompt
 */
export function generateScenarioPrompt(): string {
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
