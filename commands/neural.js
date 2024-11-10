const axios = require('axios');

module.exports = {
  name: 'neural',
  description: 'interact with neural Chat 7b ai',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗪𝗵𝗮𝘁 𝗶𝘀 𝘄𝗮𝘃𝗲?' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛𝗡𝗲𝘂𝗿𝗮𝗹 𝗖𝗵𝗮𝘁 𝟳𝗕 𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get('https://joshweb.click/ai/neural-chat-7b', {
        params: { q: userInput, uid: '100' }
      });
      const mapanghi = response.data;
      const responseString = mapanghi.result ? mapanghi.result : 'No result found.';

      const formattedResponse = `
🤖 𝗡𝗲𝘂𝗿𝗮𝗹 𝗖𝗵𝗮𝘁 𝟳𝗕
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
