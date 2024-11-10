const axios = require('axios');

module.exports = {
  name: 'discolm',
  description: 'interact with discolm-german ai',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝗻𝗼𝘂𝗻𝗰𝗲 𝗬𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗪𝗵𝗮𝘁 𝗶𝘀 𝘄𝗮𝘃𝗲?' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ 𝗗𝗶𝘀𝗰𝗼𝗹𝗺-𝗚𝗲𝗿𝗺𝗮𝗻 𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get('https://joshweb.click/ai/discolm-german', {
        params: { q: userInput, uid: '100' }
      });

      const mapanghi = response.data;
      const responseString = mapanghi.result ? mapanghi.result : 'No result found.';

      const formattedResponse = `
📦 𝗗𝗶𝘀𝗰𝗼𝗹𝗺 𝗚𝗲𝗿𝗺𝗮𝗻
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
