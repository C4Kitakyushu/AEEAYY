const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generate an image using the FLUX-Pro API.',
  usage: '-flux [image prompt]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();
    if (!prompt) {
      return sendMessage(senderId, { text: 'Please provide an image prompt.' }, pageAccessToken);
    }

    const apiUrl = `https://elevnnnx-rest-api.onrender.com/api/FLUX-pro?prompt=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);
      
      if (response.data.status) {
        const imgUrl = response.data.response;
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: imgUrl }
          }
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Failed to generate an image using the FLUX-Pro API.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      sendMessage(senderId, { text: 'An error occurred while generating the image. Please try again later.' }, pageAccessToken);
    }
  }
};
