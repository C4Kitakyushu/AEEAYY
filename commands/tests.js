const axios = require('axios');

module.exports = {
  name: 'fbreaction',
  description: 'fbreaction <token> <postLink> <reaction>.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userToken = args[0];
    const postLinks = args[1] ? args[1].split('|') : [];
    const reactions = args[2] ? args[2].split('|') : [];

    if (!userToken || postLinks.length === 0 || reactions.length === 0) {
      return sendMessage(senderId, { text: 'Usage: fbreaction [token] [postLinks] [reactions]' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⚙️ Processing your request to react to the Facebook posts...' }, pageAccessToken);

    for (let i = 0; i < postLinks.length; i++) {
      const postLink = postLinks[i];
      const reaction = reactions[i] || reactions[0]; // Default to the first reaction if no specific one is provided for this post

      try {
        const response = await axios.get('https://fbapi-production.up.railway.app/reaction', {
          params: {
            token: userToken,
            post: postLink,
            react: reaction
          }
        });

        // Handle successful response
        console.log('Response:', response.data);
        sendMessage(senderId, { text: `Reaction "${reaction}" has been successfully posted on ${postLink}! ✅` }, pageAccessToken);
      } catch (error) {
        // Handle error
        console.error('Error:', error);
        sendMessage(senderId, { text: `Failed to send the reaction "${reaction}" on ${postLink}. Please try again later.` }, pageAccessToken);
      }

      // Add a slight delay between requests to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between requests
    }
  }
};