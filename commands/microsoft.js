const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'microgen',
  description: 'Generates an account with a random email and password',
  usage: 'genaccount',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const [cmd, nameInput] = args;

    if (cmd === 'gen') {
      if (!nameInput) {
        return sendMessage(senderId, { text: 'Please enter a name.' }, pageAccessToken);
      }

      const apiUrl = `https://joshweb.click/api/genmicro?name=${encodeURIComponent(nameInput)}`;

      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.status) {
          return sendMessage(senderId, { text: 'Error generating account. Please try again.' }, pageAccessToken);
        }

        const email = `Email: ${data.result.email}`;
        const password = `Password: ${data.result.password}`;

        sendMessage(senderId, { text: `${email}\n${password}` }, pageAccessToken);
      } catch (error) {
        sendMessage(senderId, { text: 'Error fetching data. Please try again.' }, pageAccessToken);
      }
    } else {
      sendMessage(senderId, { text: 'Invalid usage. Use genaccount <name>' }, pageAccessToken);
    }
  },
};
