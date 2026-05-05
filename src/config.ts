import { config } from 'dotenv';

config();

export const botConfig = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen3:0.6b',
  systemPrompt: process.env.SYSTEM_PROMPT || 'You are a helpful assistant.',
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
};

export function validateConfig(): void {
  if (!botConfig.telegramToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is required in .env file');
  }
}