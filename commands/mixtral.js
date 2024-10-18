const axios = require('axios');
module.exports = {
  name: 'mixtral',
  description: 'ask to mixtral ai',
  author: 'developee',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');
    try {
      const apiUrl = `https://deku-rest-apis.ooguy.com/api/mixtral-8b?q=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const text = response.data.result;

      sendMessage(senderId, { text }, pageAccessToken);
    } catch (error) {
      console.error('Error calling Mixtral API:', error);
      sendMessage(senderId, { text: 'Please Enter Your Valid Question?.' }, pageAccessToken);
    }
  }
};
