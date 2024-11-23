const axios = require('axios');

module.exports = {
  name: 'freesms',
  description: 'freesms <phoneNumber> <message>.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const phoneNumber = args[0];
    const message = args.slice(1).join(' ');

    if (!phoneNumber || !message) {
      return sendMessage(senderId, { text: '❌ 𝗨𝘀𝗮𝗴𝗲: 𝗳𝗿𝗲𝗲𝘀𝗺𝘀 𝗽𝗵𝗼𝗻𝗲 𝗻𝘂𝗺𝗯𝗲𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝘁𝗼 𝘀𝗲𝗻𝗱 𝘀𝗺𝘀, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get('https://api.kenliejugarap.com/freesmslbc/', {
        params: {
          number: phoneNumber,
          message: encodeURIComponent(message)
        }
      });
      console.log('Response:', response.data);
      sendMessage(senderId, { text: '𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝘀𝗲𝗻𝘁 ✅' }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ Failed to send the message.' }, pageAccessToken);
    }
  }
};
