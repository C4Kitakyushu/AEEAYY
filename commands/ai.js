const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
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

    await handleChatResponse(senderId, query, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://api.kenliejugarap.com/blackbox";

  try {
    const { data } = await axios.get(apiUrl, { params: { text: input } });
    let response = data.response;

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${input}\n━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${response}\n━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

    // Check if response contains image URL
    if (response.includes('TOOL_CALL: generateImage')) {
      const imageUrlMatch = response.match(/\!\[.*?\]\((https:\/\/.*?)\)/);
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
    await sendError(senderId, '❌ Ahh sh1t error again.', pageAccessToken);
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
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖 \n━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
