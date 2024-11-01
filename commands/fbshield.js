const fetch = require('node-fetch');

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
      const response = await fetch(`https://betadash-uploader.vercel.app/guard?token=${token}&enable=${isEnable}`, {
        method: 'GET'
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      sendMessage(
        senderId,
        { text: `Guard successfully ${isEnable ? 'enabled' : 'disabled'} ✅.` },
        pageAccessToken
      );
      console.log('Response Data:', data);

    } catch (error) {
      console.error('Error:', error);
      sendMessage(
        senderId,
        { text: 'An error occurred while processing your request. Please try again later.' },
        pageAccessToken
      );
    }
  }
};
