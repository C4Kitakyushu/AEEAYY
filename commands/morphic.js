const axios = require('axios');

module.exports = {
  name: 'llama',
  description: 'interact to llama 3 ai',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗪𝗵𝗼 𝗮𝗿𝗲 𝘆𝗼𝘂?' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ 𝗟𝗹𝗮𝗺𝗮 𝟯 𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get('https://joshweb.click/api/llama-3-70b', {
        params: { q: userInput }
      });
      const llamaResponse = response.data;
      const responseString = llamaResponse.result ? llamaResponse.result : '𝗡𝗼 𝗿𝗲𝘀𝘂𝗹𝘁 𝗳𝗼𝘂𝗻𝗱.';

      const formattedResponse = `
🦙 𝗟𝗹𝗮𝗺𝗮 𝟯 𝗖𝗼𝗻𝘃𝗲𝗿𝘀𝗮𝘁𝗶𝗼𝗻𝗮𝗹
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗵𝗲 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗲.' }, pageAccessToken);
    }
  }
};
