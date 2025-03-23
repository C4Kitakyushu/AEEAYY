const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Upload to Google Drive and return the file link.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: '❌ No attachment detected. Please send an image first.'
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ Processing the image for Google Drive upload, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(imageUrl)}`);
      // Assume the API returns an object with a "link" property containing the Google Drive link
      const driveLink = response?.data?.link;

      if (!driveLink) {
        throw new Error('Google Drive link not found in the response');
      }

      await sendMessage(senderId, {
        text: `Google Drive uploaded:\n\n🔗 ${driveLink}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error uploading image to Google Drive:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while uploading the image to Google Drive. Please try again later.'
      }, pageAccessToken);
    }
  }
};