const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

const availableModels = [
  "gpt-4o-mini-free",
  "gpt-4o-mini",
  "gpt-4o-free",
  "gpt-4-turbo-2024-04-09",
  "gpt-4o-2024-08-06",
  "grok-2",
  "grok-2-mini",
  "claude-3-opus-20240229",
  "claude-3-opus-20240229-gcp",
  "claude-3-sonnet-20240229",
  "claude-3-5-sonnet-20240620",
  "claude-3-haiku-20240307",
  "claude-2.1",
  "gemini-1.5-flash-exp-0827",
  "gemini-1.5-pro-exp-0827"
];

module.exports = {
  name: 'test',
  description: 'interact with ai.',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const query = args.join(" ").toLowerCase();
    if (!query) {
      return await sendMessage(senderId, { text: "𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━\nHow can I help you?\n━━━━━━━━━━━━━━━━" }, pageAccessToken);
    }

    if (query === "hello" || query === "hi") {
      return await sendMessage(senderId, { text: "𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━\nHello! How can I help you?\n━━━━━━━━━━━━━━━━" }, pageAccessToken);
    }

    // Command to show all available models
    if (query === "models") {
      return await showAvailableModels(senderId, pageAccessToken);
    }

    await handleChatResponse(senderId, query, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://mekumi-rest-api.onrender.com/api/ai";

  try {
    const { data } = await axios.get(apiUrl, {
      params: {
        model: "gpt-4-turbo-2024-04-09", // Example model, replace if needed
        system: "You are a helpful assistant",
        question: input
      }
    });
    let response = data.response;

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${input}\n━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${response}\n━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

    await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
  } catch (error) {
    console.error('Error while processing AI response:', error.message);
    await sendError(senderId, '❌ Ahh sh1t error again.', pageAccessToken);
  }
};

const showAvailableModels = async (senderId, pageAccessToken) => {
  const modelsList = availableModels.join("\n- ");
  const modelsMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━\nAvailable Models:\n━━━━━━━━━━━━━━━━\n- ${modelsList}`;

  await sendMessage(senderId, { text: modelsMessage }, pageAccessToken);
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖 \n━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
