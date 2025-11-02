require('dotenv').config();

module.exports = {
  BOT_ADMIN: process.env.BOT_ADMIN || '',
  PORT: parseInt(process.env.PORT) || 5000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  commands: {
    help: '!help',
    info: '!info',
    ai: '!ai'
  },
  
  messages: {
    welcome: '👋 Hello! I\'m your AI-powered WhatsApp assistant. Type !help to see available commands.',
    help: `📋 *Available Commands:*\n\n!help - Show this help message\n!info - Get bot information\n!ai <message> - Chat with AI\n\nYou can also just send me a message and I'll respond with AI!`,
    info: '🤖 *WhatsApp AI Bot*\n\nPowered by OpenAI\nBuilt on Replit\n\nI can help answer questions, have conversations, and assist with various tasks!'
  }
};
