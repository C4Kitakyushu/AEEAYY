const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'xmaslist',
  description: 'xmaslist <text1> <text2> <text3> <text4>',
  usage: 'xmaslist <text1> <text2> <text3> <text4>',
  author: 'Santa  Clause (Saint Nicholas)',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length < 4) {
      await sendMessage(senderId, { text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 4 𝘄𝗶𝘀𝗵𝗲𝘀 𝘀𝗲𝗽𝗮𝗿𝗮𝘁𝗲 𝗯𝘆 𝗰𝗼𝗺𝗺𝗮𝘀.\n\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲:\n
𝘅𝗺𝗮𝘀𝗹𝗶𝘀𝘁 𝗱𝗼𝗴𝗳𝗼𝗼𝗱, 𝗱𝗶𝗹𝗱𝗼, 𝘁𝗮𝗹𝗼𝗻𝗴, 𝘀𝗰𝗮𝘁𝘁𝗲𝗿' }, pageAccessToken);
      return;
    }

    const [text1, text2, text3, text4] = args;
    const apiUrl = `https://kaiz-apis.gleeze.com/api/xmas-list?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&text3=${encodeURIComponent(text3)}&text4=${encodeURIComponent(text4)}`;

    try {
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate Christmas list image.' }, pageAccessToken);
    }
  }
};
