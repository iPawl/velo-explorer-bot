import TelegramBot from 'node-telegram-bot-api';
import { queryLLM } from './llm';
import { botConfig } from './config';

export function createBot(): TelegramBot {
  const bot = new TelegramBot(botConfig.telegramToken, { polling: true });

  // Обработка команды /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = [
      '👋 Привет! Я AI-бот, работающий на локальной LLM.',
      '',
      '🤖 Модель: Qwen 3 (0.6B)',
      '💻 Локальный запуск через Ollama',
      '',
      'Просто отправь мне текстовое сообщение, и я отвечу!',
      'Каждое сообщение обрабатывается независимо.',
    ].join('\n');

    await bot.sendMessage(chatId, welcomeMessage);
  });

  // Обработка всех текстовых сообщений
  bot.on('message', async (msg) => {
    // Игнорируем команды и нетекстовые сообщения
    if (!msg.text || msg.text.startsWith('/')) {
      return;
    }

    const chatId = msg.chat.id;
    const userMessage = msg.text.trim();

    if (!userMessage) {
      return;
    }

    try {
      // Отправляем индикатор набора текста
      await bot.sendChatAction(chatId, 'typing');

      // Запрос к LLM
      const response = await queryLLM(
        userMessage,
        botConfig.systemPrompt,
        botConfig.ollamaUrl,
        botConfig.ollamaModel,
        botConfig.requestTimeout
      );

      // Отправляем ответ частями, если он слишком длинный
      if (response.length > 4096) {
        const chunks = response.match(/[\s\S]{1,4096}/g) || [];
        for (const chunk of chunks) {
          await bot.sendMessage(chatId, chunk);
        }
      } else {
        await bot.sendMessage(chatId, response);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      let errorMessage = 'Извините, произошла ошибка при обработке запроса.';
      
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          errorMessage = '⏱️ Модель не успела ответить. Попробуйте ещё раз.';
        } else if (error.message.includes('Ollama')) {
          errorMessage = '🔌 Сервис LLM временно недоступен. Попробуйте позже.';
        }
      }

      await bot.sendMessage(chatId, errorMessage);
    }
  });

  // Обработка ошибок polling
  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
  });

  return bot;
}