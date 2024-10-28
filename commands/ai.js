const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'ask to gpt4o model',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const userInput = args.join(" ").trim();
    if (!userInput) {
      return await sendMessage(senderId, { text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻.' }, pageAccessToken);
    }

    await handleChatResponse(senderId, userInput, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, userInput, pageAccessToken) => {
  const apiUrl = `https://joshweb.click/api/gpt-4o?q=${encodeURIComponent(userInput)}&uid=${senderId}`;

  try {
    const { data } = await axios.get(apiUrl);
    const generatedText = data.result || 'No response from the API.';
    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

    const message = `𝗚𝗣𝗧-4𝗼 𝗠𝗢𝗗𝗘𝗟 🤖\n━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

    await sendMessage(senderId, { text: message }, pageAccessToken);
  } catch (error) {
    console.error('Error calling GPT-4o API:', error.message);
    await sendError(senderId, `An error occurred while generating the text response. Error details: ${error.message}`, pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
  const formattedMessage = `𝗚𝗣𝗧-4𝗼 𝗠𝗢𝗗𝗘𝗟 🤖\n━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
