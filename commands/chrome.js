const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const pageAccessToken = 'YOUR_PAGE_ACCESS_TOKEN'; // Replace this with your actual token

module.exports = {
  name: 'ai3',
  description: 'Ask the GPT-4 assistant.',
  author: 'developer',

  async execute(senderId, args) {
    const prompt = args.join(" ").trim();
    if (!prompt) {
      return await sendMessage(senderId, { text: `❌ Provide your question` }, pageAccessToken);
    }

    await handleChatResponse(senderId, prompt, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://apis-markdevs69v2.onrender.com/new/v2/gpt4";

  try {
    const { data } = await axios.get(apiUrl, { params: { ask: input } });
    const result = data.response;

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `🤖 𝗚𝗣𝗧-𝟰 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲🤍\n━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${input}\n━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${result}\n━━━━━━━━━━━━━━━━━━\n⏰ Respond Time: ${responseTime}`;

    if (result.includes('TOOL_CALL: generateImage')) {
      const imageUrlMatch = result.match(/\!\[.*?\]\((https:\/\/.*?)\)/);

      if (imageUrlMatch && imageUrlMatch[1]) {
        const imageUrl = imageUrlMatch[1];
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: imageUrl }
          }
        }, pageAccessToken);
      } else {
        await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
      }
    } else {
      await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
    }
  } catch (error) {
    console.error('Error while processing AI response:', error.message);
    await sendError(senderId, '❌ Error occurred.', pageAccessToken);
  }
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
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ Respond Time: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
