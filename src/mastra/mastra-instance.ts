import { Mastra } from "@mastra/core";
import { speakingCoachAgent } from "./agents/speaking-coach-agent";

/**
 * Mastra 实例：
 * - Dashboard/CLI 通过 `import { mastra } from '#mastra'` 获取配置
 * - 当前仅注册一个 speakingCoach agent，后续可按需扩展
 */
export const mastra = new Mastra({
  agents: {
    speakingCoach: speakingCoachAgent,
  },
  telemetry: {
    enabled: false,
  },
});
