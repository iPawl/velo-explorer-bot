# 🤖 Telegram AI Chat Bot with Local LLM

Telegram-бот для общения с локальной языковой моделью через Ollama.

## 🚀 Функции

- ✨ Чат с AI на базе локальной LLM
- 🔒 Полностью локальная обработка (без облачных API)
- ⚡ Быстрые ответы от Qwen 3 (0.6B)
- 🛡️ Надёжная обработка ошибок
- 📝 Настраиваемый системный промпт

## 📋 Требования

- Node.js 20+
- npm или yarn
- [Ollama](https://ollama.ai/) установленная и запущенная
- Telegram Bot Token (получить у [@BotFather](https://t.me/BotFather))

## 🛠️ Установка

### 1. Установка Ollama и модели

```bash
# Установите Ollama (если ещё не установлена)
# macOS/Linux:
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: скачайте с https://ollama.ai/download

# Запустите Ollama
ollama serve

# В отдельном терминале скачайте модель
ollama pull qwen3:0.6b
```

### Запуск

```bash
# Режим разработки
npm run dev

# Или production режим
npm run build
npm start
```