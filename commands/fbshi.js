const axios = require('axios');

module.exports = {
  name: 'enableGuard',
  description: 'Enable or disable the Facebook shield feature using a valid token.',
  usage: 'enableGuard [ token ] [ enable(true/false) ]',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userToken = args[0];
    const enableShield = args[1];

    // Check if both token and enable status are provided
    if (!userToken || (enableShield !== 'true' && enableShield !== 'false')) {
      sendMessage(senderId, { 
        text: '‼️ Provide a valid Facebook token and enable status (true/false).' 
      }, pageAccessToken);
      return;
    }

    // Construct the API URL with the token and enable parameters
    const apiUrl = `https://betadash-uploader.vercel.app/guard?token=${userToken}&enable=${enableShield}`;

    try {
      // Send a request to the API to enable/disable the shield
      const response = await axios.get(apiUrl);
      const resultMessage = response.data.message || 'Shield status updated successfully.';

      // Send success message to the user
      sendMessage(senderId, { text: resultMessage }, pageAccessToken);

    } catch (error) {
      // Log the error and notify the user of any issues
      console.error('Error enabling/disabling shield:', error.response?.data || error.message);
      sendMessage(senderId, { 
        text: '❌ Failed to update shield status. Please try again later.' 
      }, pageAccessToken);
    }
  }
};
