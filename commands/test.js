const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Shares a post on Facebook using a cookie or token.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const input = args.join(' ').split('|');
    const postUrl = input[0]?.trim();
    const cookieOrToken = input[1]?.trim();
    const shareAmount = input[2]?.trim();
    const privacy = input[3]?.trim();
    const intervalSeconds = input[4]?.trim();

    // Validation: Ensure all required parameters are provided
    if (!postUrl || !cookieOrToken || !shareAmount || !privacy || !intervalSeconds) {
      return sendMessage(senderId, {
        text: '❌ Please provide all the required parameters in the format:\n\n**fbshare <postUrl> | <cookieOrToken> | <shareAmount> | <privacy> | <intervalSeconds>**'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: '⌛ Sharing the post, please wait...'
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://haji-mix.up.railway.app/api/fbshare`;
      const response = await axios.post(apiUrl, {
        postUrl,
        cookieOrToken,
        shareAmount: parseInt(shareAmount),
        privacy,
        intervalSeconds: parseInt(intervalSeconds),
      });

      // Parse API response
      const { status, message } = response.data;

      if (status) {
        await sendMessage(senderId, {
          text: `✅ Post shared successfully! Details:\n- Post URL: ${postUrl}\n- Share Amount: ${shareAmount}\n- Privacy: ${privacy}\n- Interval: ${intervalSeconds} seconds`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `❌ Failed to share the post. Message: ${message || 'Unknown error'}.`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error sharing post:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while sharing the post. Please try again later.'
      }, pageAccessToken);
    }
  }
};