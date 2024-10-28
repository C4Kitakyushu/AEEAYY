const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const pageAccessToken = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'uid',
  description: 'retrieve your uid',
  author: 'developer',

  async execute(senderId) {
    try {
      await sendMessage(senderId, { text: `🪪 : ${senderId}` }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error sending UID:', error);
      await sendMessage(senderId, { text: 'Error: Unable to retrieve your UID.' }, pageAccessToken);
    }
  },
};