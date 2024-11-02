const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'ask to gpt4o assistant.',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const prompt = args.join(" ").trim();
    if (!prompt) {
      return await sendMessage(senderId, { text: `❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻` }, pageAccessToken);
    }

    await handleChatResponse(senderId, prompt, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://joshweb.click/gemini"; // Updated API URL

  try {
    const { data } = await axios.post(apiUrl, { prompt: input }); // Using POST to send prompt
    const result = data.answer; // Adjusted to match the expected response structure

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟐 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${input}\n━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${result}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

    await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
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
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟐 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
