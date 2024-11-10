const axios = require('axios');

module.exports = {
  name: 'zephyr',
  description: 'interact with the zephyr-7b ai',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀. 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗪𝗵𝗼 𝗮𝗿𝗲 𝘆𝗼𝘂?' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛𝗭𝗲𝗽𝗵𝘆𝗿-𝟳𝗕 𝗶𝘀 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get('https://joshweb.click/ai/zephyr-7b', {
        params: { q: userInput, uid: '100' }
      });
      const resultData = response.data;
      const responseString = resultData.result ? resultData.result : 'No result found.';

      const formattedResponse = `
🤖 𝗭𝗲𝗽𝗵𝘆𝗿-𝟳𝗕 
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while fetching the response.' }, pageAccessToken);
    }
  }
};
