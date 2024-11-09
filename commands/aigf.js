const axios = require('axios');

module.exports = {
  name: 'aigf',
  description: 'Talk to virtual AI girlfriend',
  author: 'Deku',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗶𝗻𝗽𝘂𝘁.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗳𝗹𝗶𝗿𝘁 𝗺𝗲 𝗹𝗼𝘃𝗲😚' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ AI girlfriend is processing your input, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get('https://joshweb.click/api/ai-gf', {
        params: { q: userInput }
      });
      const responseData = response.data;
      const responseString = responseData.result ? responseData.result : '❌ No result found.';

      const formattedResponse = `
💬 AI Girlfriend Conversation
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
