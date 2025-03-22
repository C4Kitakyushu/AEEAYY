const axios = require('axios');

module.exports = {
  name: 'text',
  description: 'Generate an image from text using the Text2Image API.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length === 0) {
      sendMessage(senderId, { text: '❌ Please provide a prompt to generate an image. Example: text2image dog' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/text2image?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.imageUrl) {
        const imageUrl = response.data.imageUrl;

        // Send the generated image
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
        sendMessage(senderId, { text: '❌ No image could be generated. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Text2Image API:', error);
      sendMessage(senderId, { text: '❌ An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  },
};