const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Send a reaction using the API.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const token = args[0]; // The first argument is the token
    const reactionType = args[1]?.toLowerCase(); // The second argument is the reaction type (e.g., like, love, etc.)

    if (!token) {
      return sendMessage(senderId, {
        text: '❌ Please provide a valid token. Example:\n\n**reaction <token> <reactionType>**'
      }, pageAccessToken);
    }

    if (!reactionType) {
      return sendMessage(senderId, {
        text: '❌ Please provide a reaction type. Example:\n\n**reaction <token> <reactionType>**'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: `⌛ Sending your reaction **${reactionType}**, please wait...`
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://fbapi-production.up.railway.app/reaction?token=${token}&reaction=${reactionType}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { status, message } = response.data;

      if (status === true) {
        await sendMessage(senderId, {
          text: `✅ Reaction **${reactionType}** sent successfully!`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `❌ Failed to send reaction. Message: ${message || 'Unknown error'}.`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error sending reaction:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while sending your reaction. Please try again later.'
      }, pageAccessToken);
    }
  }
};