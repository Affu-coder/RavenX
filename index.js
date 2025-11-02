const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const OpenAI = require('openai');
const config = require('./config');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const app = express();
const PORT = config.PORT;

let botReady = false;
let qrGenerated = false;
let openai = null;
let client = null;

const conversationHistory = new Map();

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

async function initializeWhatsAppClient() {
  try {
    const { stdout: chromiumPath } = await execAsync('which chromium');
    
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './session'
      }),
      puppeteer: {
        headless: true,
        executablePath: chromiumPath.trim(),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });
    
    setupEventHandlers();
    
    return client;
  } catch (error) {
    console.error('❌ Error finding chromium:', error.message);
    throw error;
  }
}

function setupEventHandlers() {
  client.on('qr', (qr) => {
    console.log('\n🔐 WhatsApp QR Code Generated!');
    console.log('📱 Scan this QR code with your WhatsApp app:\n');
    qrcode.generate(qr, { small: true });
    console.log('\n✅ Waiting for scan...\n');
    qrGenerated = true;
  });

  client.on('ready', () => {
    console.log('✅ WhatsApp Bot is ready!');
    botReady = true;
  });

  client.on('authenticated', () => {
    console.log('✅ WhatsApp authenticated successfully!');
  });

  client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
  });

  client.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp disconnected:', reason);
    botReady = false;
  });

  client.on('message', async (message) => {
    try {
      const chat = await message.getChat();
      const contact = await message.getContact();
      const messageBody = message.body.trim();

      console.log(`📨 Message from ${contact.pushname || contact.number}: ${messageBody}`);

      if (messageBody.startsWith(config.commands.help)) {
        await message.reply(config.messages.help);
        return;
      }

      if (messageBody.startsWith(config.commands.info)) {
        await message.reply(config.messages.info);
        return;
      }

      if (messageBody.startsWith(config.commands.ai)) {
        const userMessage = messageBody.substring(config.commands.ai.length).trim();
        
        if (!userMessage) {
          await message.reply('Please provide a message after !ai command.\nExample: !ai What is the weather like?');
          return;
        }

        await handleAIMessage(message, userMessage, contact.number);
        return;
      }

      await handleAIMessage(message, messageBody, contact.number);

    } catch (error) {
      console.error('❌ Error handling message:', error);
      await message.reply('Sorry, I encountered an error processing your message. Please try again.');
    }
  });
}

async function handleAIMessage(message, userMessage, userId) {
  try {
    const aiClient = getOpenAIClient();
    
    if (!aiClient) {
      await message.reply('⚠️ OpenAI API key is not configured. Please set OPENAI_API_KEY in environment variables.');
      return;
    }

    await message.reply('🤔 Thinking...');

    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }

    const history = conversationHistory.get(userId);
    
    history.push({
      role: 'user',
      content: userMessage
    });

    if (history.length > 10) {
      history.shift();
      history.shift();
    }

    const completion = await aiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful WhatsApp assistant. Keep responses concise and friendly. Use emojis occasionally to make conversations engaging.'
        },
        ...history
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    history.push({
      role: 'assistant',
      content: aiResponse
    });

    conversationHistory.set(userId, history);

    await message.reply(aiResponse);

  } catch (error) {
    console.error('❌ Error with AI response:', error.message);
    await message.reply('Sorry, I had trouble generating a response. Please try again later.');
  }
}

app.get('/', (req, res) => {
  const status = {
    status: botReady ? 'ready' : qrGenerated ? 'waiting_for_scan' : 'initializing',
    bot: 'WhatsApp AI Chatbot',
    timestamp: new Date().toISOString()
  };
  
  res.json(status);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    whatsapp: botReady ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🌐 Express server running on http://0.0.0.0:${PORT}`);
  console.log('🚀 Starting WhatsApp bot...\n');
  
  try {
    await initializeWhatsAppClient();
    client.initialize();
  } catch (error) {
    console.error('❌ Failed to initialize WhatsApp client:', error.message);
  }
});

process.on('SIGINT', async () => {
  console.log('\n⚠️ Shutting down gracefully...');
  if (client) {
    await client.destroy();
  }
  process.exit(0);
});
