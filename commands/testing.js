const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Send spam shares to a specified Facebook post.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const [state, url, quantity, delay] = args.join(' ').split('|').map(param => param.trim());

    // Validate inputs
    if (!state || !url || !quantity || !delay) {
      return sendMessage(senderId, {
        text: '❌ *Invalid command format!*\n\nUsage: `spamshare <STATE> | <URL> | <QUANTITY> | <DELAY>`'
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://rest-api.joshuaapostol.site/spamshare?state=${encodeURIComponent(state)}&url=${encodeURIComponent(url)}&quantity=${encodeURIComponent(quantity)}&delay=${encodeURIComponent(delay)}`;
      const response = await axios.get(apiUrl);

      if (response.data.error) {
        sendMessage(senderId, { text: `❗ *Error:* ${response.data.error}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { 
          text: `✅ *Spam Share Sent Successfully!*\n\n📋 State: ${state}\n🔗 URL: ${url}\n📈 Quantity: ${quantity}\n⏳ Delay: ${delay}s` 
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❗ Error calling Spam Share API:', error?.response?.data || error);
      sendMessage(senderId, { text: '❌ Error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};