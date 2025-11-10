# English Speaking Practice AI Agent

基于 Mastra + OpenAI 的情景英语口语练习 AI Agent，部署在 Cloudflare Workers。

## 功能特性

- 🎤 **语音转文本**：使用 OpenAI Whisper API 进行高精度转录
- 📝 **语法评估**：识别并纠正语法错误
- 🗣️ **发音分析**：基于转录结果推断发音问题
- 🎯 **内容相关性**：评估回答是否符合场景要求
- 💡 **智能反馈**：提供鼓励性的改进建议
- 🎲 **随机场景**：AI 自动生成多样化的练习场景

## 技术栈

- **框架**：Mastra (AI Agent Framework)
- **API**：OpenAI (Whisper + GPT-4o-mini)
- **Web 框架**：Hono
- **部署平台**：Cloudflare Workers
- **语言**：TypeScript

## 项目结构

```
noagent/
├── src/
│   ├── index.ts              # Worker 入口和 API 路由
│   ├── agent/
│   │   ├── evaluation-agent.ts  # 评估 Agent 核心逻辑
│   │   ├── schemas.ts           # Zod schemas 和类型定义
│   │   ├── tools.ts             # Mastra 工具定义
│   │   └── prompts.ts           # Prompt 模板
│   └── utils/
│       └── openai.ts            # OpenAI 客户端工具
├── wrangler.toml             # Cloudflare Worker 配置
├── tsconfig.json             # TypeScript 配置
└── package.json
```

## 安装依赖

```bash
npm install
```

## 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 OpenAI API Key：
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. 如果要部署到 Cloudflare，需要设置 secret：
```bash
wrangler secret put OPENAI_API_KEY
```

## 本地开发

启动开发服务器：
```bash
npm run dev
```

API 将在 `http://localhost:8787` 运行。

## API 端点

### 1. 健康检查
```
GET /
```

### 2. 获取随机场景
```
GET /api/scenario
```

响应示例：
```json
{
  "prompt": "You are at a coffee shop ordering your favorite drink.",
  "context": "It's a busy morning and you want to order quickly.",
  "category": "dining",
  "difficulty": "beginner"
}
```

### 3. 评估音频
```
POST /api/evaluate
Content-Type: multipart/form-data

Fields:
- audio: File (音频文件)
- scenario: JSON string (场景对象)
```

响应示例：
```json
{
  "transcription": "I want a large coffee please",
  "scores": {
    "pronunciation": 85,
    "grammar": 90,
    "relevance": 95,
    "fluency": 88,
    "overall": 89
  },
  "feedback": {
    "grammar": [],
    "pronunciation": [
      {
        "word": "coffee",
        "issue": "Slightly unclear pronunciation",
        "suggestion": "Emphasize the first syllable: COF-fee"
      }
    ],
    "relevance": {
      "isRelevant": true,
      "analysis": "Good response, appropriate for the scenario"
    },
    "fluency": {
      "issues": [],
      "suggestions": ["Try adding 'Could I have' for a more polite request"]
    }
  },
  "suggestedResponse": "Could I have a large coffee, please? And could you make it to go?",
  "summary": "Great job! Your request was clear and appropriate...",
  "nextScenario": { ... }
}
```

### 4. 仅转录音频（调试用）
```
POST /api/transcribe
Content-Type: multipart/form-data

Fields:
- audio: File
```

## 部署到 Cloudflare

1. 登录 Cloudflare：
```bash
wrangler login
```

2. 部署到开发环境：
```bash
npm run deploy
```

3. 部署到生产环境：
```bash
npm run deploy:prod
```

## 测试

使用 curl 测试 API：

```bash
# 获取场景
curl http://localhost:8787/api/scenario

# 评估音频
curl -X POST http://localhost:8787/api/evaluate \
  -F "audio=@test-audio.webm" \
  -F 'scenario={"prompt":"Order coffee","context":"At a cafe","category":"dining","difficulty":"beginner"}'
```

## 成本估算

使用 OpenAI API 的成本：
- Whisper: ~$0.006/分钟
- GPT-4o-mini: ~$0.001/次评估
- **总计**: ~$0.007/次完整评估

每月 300 次练习约 $2.1，非常经济！

## 连接前端

前端需要实现：
1. 录音功能（MediaRecorder API）
2. 发送 FormData 到 `/api/evaluate`
3. 展示评估结果

参考前端集成代码：
```typescript
// 发送音频进行评估
const formData = new FormData();
formData.append('audio', audioBlob);
formData.append('scenario', JSON.stringify(scenario));

const response = await fetch('https://your-worker.workers.dev/api/evaluate', {
  method: 'POST',
  body: formData
});

const evaluation = await response.json();
```

## License

MIT
