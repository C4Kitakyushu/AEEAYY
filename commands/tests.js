const axios = require('axios');

module.exports = {
  name: 'tes',
  description: 'fbreaction <token> <postLink> <reaction>.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userToken = args[0];
    const postLink = args[1];
    const reaction = args[2];

    if (!userToken || !postLink || !reaction) {
      return sendMessage(senderId, { text: 'Usage: fbreaction [token] [postLink] [reaction]' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⚙️ Processing your request to react to the Facebook post...' }, pageAccessToken);

    try {
      const response = await axios.get('https://fbapi-production.up.railway.app/reaction', {
        params: {
          token: userToken,
          post: postLink,
          react: reaction
        }
      });
      console.log('Response:', response.data);
      sendMessage(senderId, { text: `Reaction "${reaction}" has been successfully posted! ✅` }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'Failed to send the reaction. Please try again later.' }, pageAccessToken);
    }
  }
};