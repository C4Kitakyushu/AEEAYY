const axios = require('axios');

module.exports = {
  name: 'aigf',
  description: 'interact to ai girlfriend ',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userInput = args.join(' ').trim();

    if (!userInput) {
      return sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗛𝗼𝘄 𝗮𝗿𝗲 𝘆𝗼𝘂 𝗳𝗲𝗲𝗹𝗶𝗻𝗴?' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⌛ 𝗔𝗜 𝗚𝗶𝗿𝗹𝗳𝗿𝗶𝗲𝗻𝗱 𝗶𝘀 𝘁𝗵𝗶𝗻𝗸𝗶𝗻𝗴... 𝗣𝗹𝗲𝗮𝘀𝗲 𝗵𝗼𝗹𝗱 𝗼𝗻!' }, pageAccessToken);

    try {
      const response = await axios.get('https://api.joshweb.click/ai-gf', {
        params: { q: userInput, uid: senderId }
      });
      const apiResponse = response.data;
      const responseString = apiResponse.result ? apiResponse.result : 'No result found.';

      const formattedResponse = `
❤️ 𝗔𝗜 𝗚𝗶𝗿𝗹𝗳𝗿𝗶𝗲𝗻𝗱 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
      `;

      sendMessage(senderId, { text: formattedResponse.trim() }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ 𝗦𝗼𝗿𝗿𝘆! 𝗦𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴 𝘄𝗲𝗻𝘁 𝘄𝗿𝗼𝗻𝗴. 𝗧𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.' }, pageAccessToken);
    }
  }
};
