const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'xmaslist',
  description: 'xmaslist <text1> <text2> <text3> <text4>',
  usage: 'xmaslist <text1> <text2> <text3> <text4>',
  author: 'Santa  Clause (Saint Nicholas)',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length < 4) {
      await sendMessage(senderId, { text: '❌ Please provide four text values separated by commas. Example: 'xmaslist pera, money, kwarta, arep'' }, pageAccessToken);
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
