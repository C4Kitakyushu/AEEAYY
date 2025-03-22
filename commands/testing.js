const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read token from file
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Search for a YouTube video and retrieve its download link',
  usage: 'video [search term]',
  author: 'developer',

  execute: async (senderId, args) => {
    const pageAccessToken = token;

    // Validate input: Ensure the user provides a query
    if (!args.length) {
      return sendError(
        senderId,
        '🎥 Invalid format! Use the command like this:\n\nvideo [search term]\nExample: video Tibok',
        pageAccessToken
      );
    }

    // Combine arguments into a single search query
    const searchQuery = args.join(' ').trim();
    const apiUrl = `https://kaiz-apis.gleeze.com/api/video?query=${encodeURIComponent(searchQuery)}`;

    try {
      // Fetch video data from the API
      const { data } = await axios.get(apiUrl);

      // Check if API response contains valid data
      if (data.download_url) {
        const videoMessage = {
          attachment: {
            type: 'video',
            payload: { url: data.download_url },
          },
        };

        await sendMessage(senderId, videoMessage, pageAccessToken);
      } else {
        await sendError(
          senderId,
          `❌ No results found for "${searchQuery}".`,
          pageAccessToken
        );
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      await sendError(
        senderId,
        '❌ An error occurred while fetching the video. Please try again later.',
        pageAccessToken
      );
    }
  },
};

// Centralized error handler for sending error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};