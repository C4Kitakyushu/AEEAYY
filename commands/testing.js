const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Search and retrieve audio from SoundCloud.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    // Validate if a search query is provided
    if (!args || args.length === 0) {
      console.log('No search query provided.');
      await sendMessage(senderId, { text: 'Please provide a search term for SoundCloud.' }, pageAccessToken);
      return;
    }

    const searchQuery = args.join(' ');
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/sc?search=${encodeURIComponent(searchQuery)}`;

    console.log(`Generated API URL: ${apiUrl}`); // Debugging log

    try {
      // Send request to the API
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data); // Debug log for response

      // Check if the API returned valid audio data
      if (response.data && response.data.url) {
        const audioUrl = response.data.url; // Assuming the API provides an audio URL

        console.log('Sending audio URL:', audioUrl); // Debugging log
        // Send the audio player link to the user
        await sendMessage(
          senderId,
          {
            text: `Here is your SoundCloud audio for "${searchQuery}":\n\n${audioUrl}`,
          },
          pageAccessToken
        );
      } else {
        console.log('Invalid API response structure:', response.data);
        await sendMessage(senderId, { text: 'Failed to fetch SoundCloud audio. Please try again.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error fetching SoundCloud audio:', error.message); // Log the error for debugging
      await sendMessage(senderId, { text: 'An error occurred while retrieving the audio. Please try again later.' }, pageAccessToken);
    }
  },
};