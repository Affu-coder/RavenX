# WhatsApp AI Chatbot

An AI-powered WhatsApp chatbot by a Ghanaian boy called MARISEL DEV built with Node.js, running on Replit with the help of Vermin Spartan and Jay Von.

## Features

- 🤖 AI-powered conversations using OpenAI
- 📱 WhatsApp Web integration (no API costs!)
- 💬 Command system (!help, !info, !ai)
- 🧠 Conversation context tracking
- 💾 Session persistence
- 🌐 Health check dashboard

## Setup Instructions

### 1. Get OpenAI API Key
You'll need an OpenAI API key. Get one from: https://platform.openai.com/api-keys

### 2. Configure Environment Variables
The bot will ask you for the OPENAI_API_KEY when you first run it.

### 3. First Run - QR Code Scanning
1. Start the bot (it runs automatically on Replit)
2. Check the console - a QR code will appear
3. Open WhatsApp on your phone
4. Go to Settings > Linked Devices > Link a Device
5. Scan the QR code displayed in the console
6. Wait for "WhatsApp Bot is ready!" message

### 4. Using the Bot
Once connected, send messages to your WhatsApp number:

- `!help` - Show available commands
- `!info` - Get bot information
- `!ai <message>` - Chat with AI (e.g., "!ai What is JavaScript?")
- Or just send any message - the bot will respond with AI!

## Commands

| Command | Description |
|---------|-------------|
| `!help` | Display help message with all commands |
| `!info` | Show bot information |
| `!ai <message>` | Get AI-powered response to your message |

## How It Works

1. The bot connects to WhatsApp Web using puppeteer
2. You scan a QR code to authenticate
3. Session is saved locally for automatic reconnection
4. Messages are processed and sent to OpenAI
5. AI responses are sent back via WhatsApp

## Notes

- The bot stays connected as long as this Repl is running
- Session data is saved in the `session/` folder
- First-time setup requires QR code scanning
- Conversation history is kept in memory (last 10 messages per user)

## Troubleshooting

**QR Code not appearing?**
- Check the console logs
- Make sure the workflow is running

**Bot not responding?**
- Verify OPENAI_API_KEY is set
- Check console for error messages
- Ensure WhatsApp Web is not open on another browser

**Connection lost?**
- The bot will try to reconnect automatically
- You may need to scan the QR code again
