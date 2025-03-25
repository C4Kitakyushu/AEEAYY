const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'React to a post using the Facebook API.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const input = args.join(' ').split('|');
    const postId = input[0]?.trim();
    const reactionType = input[1]?.trim();
    const token = input[2]?.trim(); // Added token as a required input

    if (!postId || !reactionType || !token) {
      return sendMessage(senderId, {
        text: '❌ Please provide the post ID, reaction type, and token in the format:\n\n**reaction <post_id> | <reaction_type> | <token>**'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: '⌛ Processing your reaction, please wait...'
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://fbapi-production.up.railway.app/reaction?id=${encodeURIComponent(postId)}&reaction=${encodeURIComponent(reactionType)}&token=${encodeURIComponent(token)}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { status, message } = response.data;

      if (status) {
        await sendMessage(senderId, {
          text: `✅ Reaction **${reactionType}** added successfully to post **${postId}**!`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `❌ Failed to add reaction. Message: ${message || 'Unknown error'}.`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error adding reaction:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while processing your reaction. Please try again later.'
      }, pageAccessToken);
    }
  }
};