const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gdrive',
  description: 'Upload media to Google Drive link.',
  author: 'Jonell Magallanes',

  async execute(senderId, args, pageAccessToken, attachmentUrl) {
    if (!attachmentUrl) {
      return sendMessage(senderId, {
        text: '❌ No attachment detected. Please send an image or video first.'
      }, pageAccessToken);
    }

    await sendMessage(senderId, { 
      text: '⌛ Uploading the attachment to Google Drive... Please wait.' 
    }, pageAccessToken);

    try {
      const apiUrl = `https://ccprojectapis.ddns.net/api/gdrive?url=${encodeURIComponent(attachmentUrl)}`;
      const response = await axios.get(apiUrl);
      const gdriveLink = response?.data;

      if (!gdriveLink) {
        throw new Error('❌ Google Drive link not found in the response');
      }

      await sendMessage(senderId, {
        text: `☁️ 𝗚𝗼𝗼𝗴𝗹𝗲 𝗗𝗿𝗶𝘃𝗲 𝗨𝗽𝗹𝗼𝗮𝗱 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱:\n\n🔗 ${gdriveLink}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error uploading to Google Drive:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while uploading to Google Drive. Please try again later.'
      }, pageAccessToken);
    }
  }
};