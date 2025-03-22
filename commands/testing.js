const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read the token once at the top level
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Search for a SoundCloud track using a keyword',
  usage: 'soundcloud <search query>',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    if (!Array.isArray(args) || args.length === 0) {
      return await sendError(senderId, 'Error: Please provide a search query.', pageAccessToken);
    }

    const searchQuery = args.join(' ').trim();
    await handleSoundCloudSearch(senderId, searchQuery, pageAccessToken);
  },
};

// Function to search for a SoundCloud track
const handleSoundCloudSearch = async (senderId, searchQuery, pageAccessToken) => {
  try {
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/sc?search=${encodeURIComponent(searchQuery)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.url) {
      return await sendError(senderId, 'Error: No results found or invalid response.', pageAccessToken);
    }

    const { url: audioUrl } = data;

    // Send track details
    const message = `🎶 | Now Playing\n━━━━━━━━━━━━━━━\n🔗 [Listen on SoundCloud]\n${audioUrl}\n━━━━━━━━━━━━━━━`;
    await sendMessage(senderId, { text: message }, pageAccessToken);

    // Send the audio attachment
    const audioPayload = getAttachmentPayload('audio', audioUrl);
    if (audioPayload) {
      await sendMessage(senderId, { attachment: audioPayload }, pageAccessToken);
    }
  } catch (error) {
    console.error('Error fetching SoundCloud track:', error);
    await sendError(senderId, 'Error: An unexpected error occurred. Please try again.', pageAccessToken);
  }
};

// Function to get attachment payload based on type
const getAttachmentPayload = (type, url) => {
  const supportedTypes = {
    audio: { type: 'audio', payload: { url } },
  };

  return supportedTypes[type] || null;
};

// Centralized error handler for sending error messages
const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};