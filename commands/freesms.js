const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'freesms',
  description: 'send free message from lbc (please dont abuse).',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const input = args.join(' ').split('|');
    const messageText = input[0]?.trim();
    const phoneNumber = input[1]?.trim();

    if (!messageText || !phoneNumber) {
      return sendMessage(senderId, {
        text: 'Usage: freesms message | number'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: '⌛ Sending your message , please wait...'
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://haji-mix.up.railway.app/api/lbcsms?text=${encodeURIComponent(messageText)}&number=${phoneNumber}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { status, message } = response.data;

      if (status === 'success') {
        await sendMessage(senderId, {
          text: `✅ SMS sent successfully to ${phoneNumber}\n\ This is for educational purposes only please don't abuse`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `✅SMS sent successfully to ${phoneNumber}`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error sending SMS:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while sending your SMS. Please try again later.'
      }, pageAccessToken);
    }
  }
};