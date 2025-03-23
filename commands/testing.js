const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Upload an image to Google Drive and return the file link.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: '❌ No image detected. Please send an image first and then type "gdrive".'
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ Uploading your image to Google Drive, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(imageUrl)}`);
      const driveLink = response?.data?.link;

      if (!driveLink) {
        return sendMessage(senderId, {
          text: '❌ Unable to retrieve the Google Drive link. Please try again later.'
        }, pageAccessToken);
      }

      await sendMessage(senderId, {
        text: `✔️ Your file has been successfully uploaded to Google Drive:\n\n🔗 ${driveLink}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error uploading image to Google Drive:', error);

      let errorMessage = '❌ An unexpected error occurred. Please try again later.';
      if (error.response?.data?.message) {
        errorMessage = `❌ ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }

      await sendMessage(senderId, {
        text: errorMessage
      }, pageAccessToken);
    }
  }
};