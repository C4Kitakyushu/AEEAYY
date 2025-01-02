const axios = require('axios');

module.exports = {
  name: 'react',
  description: 'react to a Facebook post with a specific reaction',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const input = args.join(" ");
    const [postLink, reactionType] = input.split(" | ");

    if (!postLink || !reactionType) {
      return sendMessage(senderId, { text: "Usage: react <post_link> | <reaction_type>" }, pageAccessToken);
    }

    try {
      const apiUrl = `https://fbapi-production.up.railway.app/reaction?token=${pageAccessToken}&post=${encodeURIComponent(postLink)}&react=${encodeURIComponent(reactionType)}`;
      const response = await axios.get(apiUrl);

      // Assuming the response contains success or error message
      const message = response.data.success
        ? `Successfully reacted to the post with reaction: ${reactionType}`
        : `Failed to react to the post. Error: ${response.data.error || 'Unknown error'}`;

      sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      console.error('Error sending reaction:', error);
      sendMessage(senderId, { text: "An error occurred while reacting to the post. Please try again." }, pageAccessToken);
    }
  }
};