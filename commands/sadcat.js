const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'sadcat',
  description: 'sadcat <text>',
  usage: 'sadcat <text>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Please provide the text.' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');
    const apiUrl = `https://kaiz-apis.gleeze.com/api/sadcat?text=${encodeURIComponent(text)}`;

    try {
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate sad cat image.' }, pageAccessToken);
    }
  }
};
