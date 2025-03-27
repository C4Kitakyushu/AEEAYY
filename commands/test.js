const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

// Read the token once at the top level
const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'test',
  description: 'Search and download songs from SoundCloud.',
  usage: 'soundcloud <song title>',
  author: 'dev',

  async execute(senderId, args) {
    const pageAccessToken = token;

    if (!Array.isArray(args) || args.length === 0) {
      return await sendError(senderId, 'Error: Please provide a song title.', pageAccessToken);
    }

    const searchQuery = args.join(' ').trim();
    await handleSoundCloudSearch(senderId, searchQuery, pageAccessToken);
  },
};

// Function to search for a SoundCloud track
const handleSoundCloudSearch = async (senderId, searchQuery, pageAccessToken) => {
  try {
    const apiUrl = `https://haji-mix.up.railway.app/api/soundcloud?title=${encodeURIComponent(searchQuery)}`;
    const { data } = await axios.get(apiUrl, { responseType: 'stream' });

    if (!data) {
      return await sendError(senderId, 'Error: No results found.', pageAccessToken);
    }

    // Send the audio
    const message = `🎶 | Now Playing\n━━━━━━━━━━━━━━━\n🎧 Track: ${searchQuery}\n━━━━━━━━━━━━━━━`;
    await sendMessage(senderId, { text: message }, pageAccessToken);

    const audioPayload = getAttachmentPayload('audio', apiUrl);
    await sendMessage(senderId, { attachment: audioPayload }, pageAccessToken);
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