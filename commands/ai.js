const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'ask to claude sonnet 3.5',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return await sendError(senderId, '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻.', pageAccessToken);
    }

    await handleClaudeResponse(senderId, prompt, pageAccessToken);
  },
};

const handleClaudeResponse = async (senderId, prompt, pageAccessToken) => {
  const apiUrl = `https://rest-api.joshuaapostol.site/blackbox/model/claude-sonnet-3.5?prompt=${encodeURIComponent(prompt)}`;

  try {
    const { data } = await axios.get(apiUrl);
    const answer = data.response || 'No response from the API.';
    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

    const formattedMessage = `✨ 𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

    await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
  } catch (error) {
    console.error('Error calling Claude Sonnet API:', error);
    await sendError(senderId, 'An error occurred while fetching the response.', pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
