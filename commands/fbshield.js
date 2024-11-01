const axios = require('axios');

module.exports = {
  name: 'fbshield',
  description: 'fbshield <token> <enable/disable>.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const token = args[0];
    const action = args[1]?.toLowerCase();

    if (!token || !['enable', 'disable'].includes(action)) {
      return sendMessage(senderId, { text: 'Usage: fbshield [token] [enable/disable]' }, pageAccessToken);
    }

    sendMessage(senderId, { text: `⚙️ Processing your request to ${action} guard...` }, pageAccessToken);

    try {
      const response = await axios.get('https://betadash-uploader.vercel.app/guard', {
        params: {
          token,
          enable: action === 'enable'
        }
      });
      
      sendMessage(senderId, { text: `Guard successfully ${action}d ✅.` }, pageAccessToken);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: 'An error occurred while processing your request.' }, pageAccessToken);
    }
  }
};
