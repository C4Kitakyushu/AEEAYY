const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai',
  description: 'ask to ai',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const userInput = (args.join(" ") || 'hello').trim();
    if (!userInput) {
      return sendMessage(senderId, { text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻.' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '🕧 | 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝗮𝗻 𝗮𝗻𝘀𝘄𝗲𝗿, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);
    
    // Wait for 2 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 2000));

    await handleChatResponse(senderId, userInput, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, userInput, pageAccessToken) => {
  const systemRole = 'you are an AI assistant.';
  const apiUrl = `https://personal-ai-phi.vercel.app/kshitiz?prompt=${encodeURIComponent(userInput)}&content=${encodeURIComponent(systemRole)}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.code === 2 && response.data.message === "success") {
      const generatedText = response.data.answer;
      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
      const message = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

      await sendMessage(senderId, { text: message }, pageAccessToken);
    } else {
      console.error('API response did not contain expected data:', response.data);
      await sendError(senderId, '❌ An error occurred while generating the text response. Please try again later.', pageAccessToken);
    }
  } catch (error) {
    console.error('Error:', error);
    await sendError(senderId, `❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}`, pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const formattedMessage = `❌ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n・───────────・\n${errorMessage}\n・──── >ᴗ< ─────・`;
  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
