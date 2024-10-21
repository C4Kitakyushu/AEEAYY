const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'ashley',
  description: 'talk to ashley masarap',
  usage: 'ashley <your message>',
  author: 'developer',
  version: '1.0.0',
  async execute(senderId, args, pageAccessToken) {
    const ashley = args.join(' ');

    if (!ashley) {
      return sendMessage(senderId, { text: 'hello baby nigga😼' }, pageAccessToken);
    }

    const typingNotification = await sendMessage(senderId, { text: '⏳ Ashley is typing, please wait...' }, pageAccessToken);

    const apiUrl = `https://markdevs-last-api-t48o.onrender.com/api/ashley?query=${encodeURIComponent(ashley)}`;

    try {
      const response = await axios.get(apiUrl);
      const ashleyResponse = response.data.result || 'No response from Ashley.';

      const formattedResponse = 
`${ashleyResponse}`;

      await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);

    } catch (maasim) {
      console.error('Error:', maasim);

      await sendMessage(senderId, { text: '❌ An error occurred. Please try again later.' }, pageAccessToken);
    }
  }
};