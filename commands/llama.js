const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'llama',
  description: 'Fetches response from the Llama 3.2 API based on user input.',
  author: 'YourName',

  async execute(senderId, args) {
    const pageAccessToken = token;
    const input = (args.join(' ') || '').trim();

    if (!input) {
      await sendMessage(senderId, { text: "Please provide a query." }, pageAccessToken);
      return;
    }

    try {
      const response = await axios.get(`https://joshweb.click/ai/llama-3.2-11b-vision-instruct?q=${encodeURIComponent(input)}&uid=${senderId}`);
      const data = response.data;

      if (!data || !data.success) {
        throw new Error(data.error || 'An unknown error occurred.');
      }

      const formattedMessage = `${data.result}`;

      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching data:', error);
      await sendMessage(senderId, { text: 'An error occurred while processing your request.' }, pageAccessToken);
    }
  }
};
