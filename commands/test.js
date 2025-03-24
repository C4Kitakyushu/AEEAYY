const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Send a reaction on a Facebook post using the API.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    // Expect parameters: postUrl | token | reactionType
    const input = args.join(' ').split(' | ');
    const postUrl = input[0]?.trim();
    const token = input[1]?.trim();
    const reactionType = input[2]?.trim();

    if (!postUrl || !token || !reactionType) {
      return sendMessage(
        senderId,
        {
          text: '❗ Usage: `reaction <postUrl> | <token> | <reactionType>`\nExample:\nreaction https://facebook.com/post123 | abc123 | love',
        },
        pageAccessToken
      );
    }

    if (!/^([A-Za-z0-9-_]{20,})$/.test(token)) {
      return sendMessage(
        senderId,
        { text: '❗ Invalid token format. Please provide a valid access token.' },
        pageAccessToken
      );
    }

    await sendMessage(
      senderId,
      { text: `⌛ Sending your reaction "${reactionType}" for the post, please wait...` },
      pageAccessToken
    );

    try {
      const apiUrl = `https://fbapi-production.up.railway.app/reaction`;
      const response = await axios.get(apiUrl, {
        params: {
          postUrl: postUrl,
          token: token,
          reaction: reactionType,
        },
      });

      const data = response.data;

      if (data.status === true) {
        await sendMessage(
          senderId,
          { text: `✅ Reaction "${reactionType}" was successfully sent for the post!` },
          pageAccessToken
        );
      } else {
        await sendMessage(
          senderId,
          { text: `❌ Failed to send reaction. Message: ${data.message || 'Unknown error'}.` },
          pageAccessToken
        );
      }
    } catch (error) {
      console.error('❌ Error sending reaction:', error.response?.data || error.message);
      await sendMessage(
        senderId,
        { text: '❌ An error occurred while sending your reaction. Please try again later.' },
        pageAccessToken
      );
    }
  },
};