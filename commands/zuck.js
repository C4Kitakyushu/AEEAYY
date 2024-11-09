const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'zuck',
  description: 'zuck <text>',
  usage: 'zuck <text>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: '❌ Please provide the text ' }, pageAccessToken);
      return;
    }

    const text = args.join(' ');
    const apiUrl = `https://api-canvass.vercel.app/zuck?text=${encodeURIComponent(text)}`;

    try {
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate canvas image.' }, pageAccessToken);
    }
  }
};