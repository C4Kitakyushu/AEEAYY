const axios = require('axios');

module.exports = {
  name: 'fbshield',
  description: 'toggleGuard <token> <enable/disable>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [token, action] = args;
    const isEnable = action?.toLowerCase() === 'enable';

    // Validate inputs
    if (!token || !['enable', 'disable'].includes(action?.toLowerCase())) {
      return sendMessage(
        senderId,
        { text: 'Usage: toggleGuard [token] [enable/disable]' },
        pageAccessToken
      );
    }

    // Inform the user that the request is being processed
    sendMessage(
      senderId,
      { text: `⚙️ Processing your request to ${isEnable ? 'enable' : 'disable'} guard...` },
      pageAccessToken
    );

    try {
      // API call
      const response = await axios.get(`https://betadash-uploader.vercel.app/guard`, {
        params: {
          token: token,
          enable: isEnable
        }
      });

      sendMessage(
        senderId,
        { text: `Guard successfully ${isEnable ? 'enabled' : 'disabled'} ✅.` },
        pageAccessToken
      );
      console.log('Response Data:', response.data);

    } catch (error) {
      console.error('Error:', error);

      const errorMessage = error.response
        ? `Server responded with status ${error.response.status}: ${error.response.data}`
        : 'An error occurred while processing your request. Please try again later.';

      sendMessage(
        senderId,
        { text: errorMessage },
        pageAccessToken
      );
    }
  }
};
