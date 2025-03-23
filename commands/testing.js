const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Automatically create a Facebook account.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    await sendMessage(senderId, { text: '⌛ Creating Facebook account, please wait...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://ccprojectapis.ddns.net/api/fbcreate`);
      const accountDetails = response?.data;

      if (!accountDetails || !accountDetails.email || !accountDetails.password) {
        return sendMessage(senderId, {
          text: '❌ Unable to create a Facebook account at the moment. Please try again later.'
        }, pageAccessToken);
      }

      const email = accountDetails.email;
      const password = accountDetails.password;

      await sendMessage(senderId, {
        text: `✔️ Facebook account successfully created:\n\n📧 Email: ${email}\n🔑 Password: ${password}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error creating Facebook account:', error);

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