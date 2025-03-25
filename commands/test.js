const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch word definitions using Merriam API.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const word = args.join(' ').trim();

    if (!word) {
      return sendMessage(senderId, {
        text: '❌ Please provide a word to define. Example:\n\n**define dangerous**'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: '⌛ Searching for the definition, please wait...'
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://jerome-web.gleeze.com/service/api/merriam?word=${encodeURIComponent(word)}`;
      const response = await axios.get(apiUrl);

      // Parse API response
      const { word: fetchedWord, results } = response.data;

      if (!results || results.length === 0) {
        return sendMessage(senderId, {
          text: `❌ No definitions found for the word: **${word}**.`
        }, pageAccessToken);
      }

      // Format message as per the API response
      let message = `**Word:** ${fetchedWord}\n\n**Results:**\n`;

      results.forEach((result) => {
        message += `\n**Part of Speech:** ${result.partOfSpeech}\n`;
        message += `**Definitions:**\n`;
        result.definitions.forEach((definition) => {
          message += `• ${definition}\n`;
        });

        if (result.detailedDefinitions && result.detailedDefinitions.length > 0) {
          message += `\n**Detailed Examples:**\n`;
          result.detailedDefinitions.forEach((detailed) => {
            for (const key in detailed) {
              detailed[key].forEach((example) => {
                message += `- ${example.t.replace(/{it}/g, '')}\n`;
              });
            }
          });
        }
      });

      await sendMessage(senderId, {
        text: message
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error fetching word definition:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching the definition. Please try again later.'
      }, pageAccessToken);
    }
  }
};