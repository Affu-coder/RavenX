# WhatsApp AI Chatbot

## Overview
This is an AI-powered WhatsApp chatbot that uses the WhatsApp Web protocol to send and receive messages. It integrates with OpenAI to provide intelligent, conversational responses.

## Current State
- **Status**: Active WhatsApp bot implementation
- **Platform**: WhatsApp Web (no official API required)
- **AI Provider**: OpenAI GPT-3.5-turbo
- **Server**: Express.js health check server on port 5000

## Recent Changes
- 2025-01-02: Initial WhatsApp bot setup with AI integration
- Project structure created with session persistence
- Command system implemented (!help, !info, !ai)
- Conversation context tracking added

## Project Architecture

### Main Components
1. **index.js** - Main application file
   - WhatsApp client initialization
   - Express server for health checks
   - Message routing and command handling
   - OpenAI integration for AI responses

2. **config.js** - Configuration settings
   - Bot commands
   - Response messages
   - Environment variable management

3. **Session Management**
   - Uses LocalAuth strategy
   - Sessions saved in `./session/` directory
   - Automatic reconnection on restart

### Dependencies
- `whatsapp-web.js` - WhatsApp Web API wrapper
- `qrcode-terminal` - QR code display in console
- `openai` - OpenAI API client
- `express` - Web server for health checks
- `dotenv` - Environment variable management

## Environment Variables
- `OPENAI_API_KEY` - Required for AI features
- `BOT_ADMIN` - Admin phone number (optional)
- `PORT` - Server port (default: 5000)

## User Preferences
None specified yet.

## How to Use

### First Time Setup
1. Ensure OPENAI_API_KEY is set
2. Run the bot
3. Scan QR code with WhatsApp on your phone
4. Wait for "Bot is ready!" message

### Sending Messages
The bot responds to:
- Direct messages (automatically gets AI response)
- `!help` - Show help
- `!info` - Bot information
- `!ai <text>` - Explicit AI chat

## Notes
- QR code scanning required on first run
- Session persists across restarts
- Conversation history kept in memory (last 10 messages)
- Bot works on both individual and group chats
