const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Generate artwork based on a given prompt.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length === 0) {
      sendMessage(senderId, { text: '❌ Please provide a prompt to generate artwork. Example: art A cat with a collar and the tag is Ace' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://elevnnnx-rest-api.onrender.com/api/art?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.imageUrl) {
        const imageUrl = response.data.imageUrl;

        // Send the generated artwork
        sendMessage(
          senderId,
          {
            attachment: {
              type: 'image',
              payload: { url: imageUrl },
            },
          },
          pageAccessToken
        );
      } else {
        console.error('Error: No image URL found in API response.');
        sendMessage(senderId, { text: '❌ No artwork could be generated. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling the Art API:', error);
      sendMessage(senderId, { text: '❌ An error occurred while generating the artwork. Please try again later.' }, pageAccessToken);
    }
  },
};