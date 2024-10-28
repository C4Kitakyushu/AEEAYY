const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'interact to blackbox ai',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return await sendError(senderId, '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗪𝗵𝗮𝘁 𝗶𝘀 𝘄𝗮𝘃𝗲?', pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛𝗕𝗹𝗮𝗰𝗸𝗯𝗼𝘅 𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);
    await handleBlackboxResponse(senderId, userInput, pageAccessToken);
  },
};

const handleBlackboxResponse = async (senderId, userInput, pageAccessToken) => {
  try {
    const response = await axios.get('https://joshweb.click/api/blackboxai', {
      params: { q: userInput, uid: '100' }
    });
    const mapanghi = response.data;
    const responseString = mapanghi.result || 'No result found.';

    const formattedResponse = `
𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗔𝗜 🤖
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
    `;

    await sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

  } catch (error) {
    console.error('Error:', error);
    await sendError(senderId, 'An error occurred while fetching the response.', pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗔𝗜 🤖 \n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
