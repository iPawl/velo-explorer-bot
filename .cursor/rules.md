# Контекст проекта Telegram LLM Bot

## 🎯 Цель
Telegram-бот для общения с локальной LLM через Ollama

## 🔧 Стек
- TypeScript 5.x (strict mode)
- Runtime: Node.js 20+
- Telegram Bot API: node-telegram-bot-api
- LLM: Ollama (qwen3:0.6b)
- HTTP клиент: встроенный fetch (Node 18+)

## 📋 Спецификации

### Модель данных
\`\`\`typescript
interface BotConfig {
  telegramToken: string;
  ollamaUrl: string;
  ollamaModel: string;
  systemPrompt: string;
}

interface LLMResponse {
  text: string;
  error?: string;
}
\`\`\`

### API контракты
- GET /api/generate в Ollama
- Формат запроса: { model, prompt, system, stream: false }
- Формат ответа: { response: string }

### Обработка ошибок
- LLM недоступна → сообщение пользователю "Извините, сервис временно недоступен"
- Пустое сообщение → игнорировать
- Ошибка Telegram API → retry 3 раза с exponential backoff
- Timeout LLM: 30 секунд

### Команды бота
- /start → приветственное сообщение с описанием
- Любой текст → отправить в LLM и вернуть ответ

## 🚫 Ограничения
- Без базы данных
- Без хранения истории диалога
- Без webhook (только polling)
- Каждый запрос независим (stateless)