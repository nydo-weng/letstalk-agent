import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { evaluateSpokenEnglish, generateRandomScenario } from './agent/evaluation-agent';
import { transcribeAudio } from './utils/openai';
import { Scenario } from './agent/schemas';

// Cloudflare Worker 环境变量类型
type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS 配置
app.use('/*', cors({
  origin: '*', // 生产环境建议指定具体域名
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// 健康检查
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'English Speaking Practice API',
    version: '1.0.0'
  });
});

// 获取随机场景
app.get('/api/scenario', async (c) => {
  try {
    const apiKey = c.env.OPENAI_API_KEY;

    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }

    const scenario = await generateRandomScenario(apiKey);
    return c.json(scenario);
  } catch (error) {
    console.error('Error generating scenario:', error);
    return c.json({
      error: 'Failed to generate scenario',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// 评估音频
app.post('/api/evaluate', async (c) => {
  try {
    const apiKey = c.env.OPENAI_API_KEY;

    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }

    // 解析 form data
    const formData = await c.req.formData();
    const audioFile = formData.get('audio') as File;
    const scenarioJson = formData.get('scenario') as string;

    if (!audioFile) {
      return c.json({ error: 'No audio file provided' }, 400);
    }

    if (!scenarioJson) {
      return c.json({ error: 'No scenario provided' }, 400);
    }

    let scenario: Scenario;
    try {
      scenario = JSON.parse(scenarioJson);
    } catch {
      return c.json({ error: 'Invalid scenario JSON' }, 400);
    }

    // Step 1: 转录音频
    console.log('Transcribing audio...');
    const transcription = await transcribeAudio(apiKey, audioFile, 'en');
    console.log('Transcription:', transcription.text);

    // Step 2: 评估转录文本
    console.log('Evaluating speech...');
    const evaluation = await evaluateSpokenEnglish(apiKey, transcription.text, scenario);
    console.log('Evaluation completed');

    // 返回完整评估结果
    return c.json({
      ...evaluation,
      transcription: transcription.text // 确保返回转录文本
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    return c.json({
      error: 'Failed to evaluate speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// 仅转录音频（用于调试）
app.post('/api/transcribe', async (c) => {
  try {
    const apiKey = c.env.OPENAI_API_KEY;

    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }

    const formData = await c.req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return c.json({ error: 'No audio file provided' }, 400);
    }

    const transcription = await transcribeAudio(apiKey, audioFile, 'en');
    return c.json(transcription);
  } catch (error) {
    console.error('Transcription error:', error);
    return c.json({
      error: 'Failed to transcribe audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;
