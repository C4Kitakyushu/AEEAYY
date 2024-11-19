const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'interact with starling assistant',
  usage: '-starling <your message>',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const userInput = (args.join(' ') || '').trim();
    if (!userInput) {
      return await sendError(senderId, '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗪𝗵𝗮𝘁 𝗶𝘀 𝘄𝗮𝘃𝗲?', pageAccessToken);
    }

    await handleStarlingResponse(senderId, userInput, pageAccessToken);
  },
};

const handleStarlingResponse = async (senderId, userInput, pageAccessToken) => {  const apiUrl = `https://joshweb.click/ai/starling-lm-7b?q=${encodeURIComponent(userInput)}&uid=100`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseString = data.result || 'No result found.';
    const formattedResponse = `
🌟 𝗦𝘁𝗮𝗿𝗹𝗶𝗻𝗴 🌟
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
    `;

    await sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);
  } catch (error) {
    console.error('Error reaching the API:', error);
    await sendError(senderId, 'An error occurred while fetching the response.', pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const formattedMessage = `🌟 𝗦𝘁𝗮𝗿𝗹𝗶𝗻𝗴 🌟\n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━`;
  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
