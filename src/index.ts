import { createBot } from './bot';
import { validateConfig } from './config';

async function main(): Promise<void> {
  try {
    // Проверяем конфигурацию
    validateConfig();

    console.log('🤖 Запуск Telegram бота...');
    
    // Создаем и запускаем бота
    const bot = createBot();

    console.log('✅ Бот успешно запущен');
    console.log('📝 Используется модель:', process.env.OLLAMA_MODEL || 'qwen3:0.6b');
    console.log('🔗 Ollama URL:', process.env.OLLAMA_URL || 'http://localhost:11434');

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n🛑 Остановка бота...');
      await bot.stopPolling();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('❌ Ошибка запуска:', error);
    process.exit(1);
  }
}

main();