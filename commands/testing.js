const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Upload an attachment to Google Drive and get a non-expiring link.',
  author: 'Jonell Magallanes',

  async execute(senderId, args, pageAccessToken, attachmentUrl) {
    if (!attachmentUrl) {
      return sendMessage(senderId, {
        text: '❌ Your message must contain an audio, video, or image attachment.'
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ Uploading the attachment to Google Drive. Please wait...' }, pageAccessToken);

    try {
      const apiUrl = `https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(attachmentUrl)}`;
      const response = await axios.get(apiUrl);
      const driveLink = response?.data;

      if (!driveLink) {
        throw new Error('❌ Google Drive link not found in the response.');
      }

      await sendMessage(senderId, {
        text: `☁️ 𝗚𝗼𝗼𝗴𝗹𝗲 𝗗𝗿𝗶𝘃𝗲 𝗨𝗽𝗹𝗼𝗮𝗱𝗲𝗱:\n\n🔗: ${driveLink}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error uploading file to Google Drive:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while uploading the file to Google Drive. Please try again later.'
      }, pageAccessToken);
    }
  }
};