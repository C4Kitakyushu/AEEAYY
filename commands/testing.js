const axios = require('axios');

module.exports = {
  name: 'flux',
  description: 'Generate an AI image using Flux with a given prompt.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args || args.length === 0) {
      sendMessage(senderId, { text: '❌ Please provide a prompt for image generation. Example: flux dog' }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/flux?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.ok && response.data.data && response.data.data.imageUrl) {
        const resultUrl = response.data.data.imageUrl;

        // Send the response with prompt and result
        const message = `🎨 **Flux Image Generation**\n\n📌 **Prompt**: ${prompt}\n\n🌐 **Result**: ${resultUrl}`;
        sendMessage(senderId, { text: message }, pageAccessToken);

        // Send the generated image
        sendMessage(
          senderId,
          {
            attachment: {
              type: 'image',
              payload: { url: resultUrl },
            },
          },
          pageAccessToken
        );
      } else {
        console.error('Error: No image URL found in API response.');
        sendMessage(senderId, { text: '❌ Sorry, no image was generated. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Flux API:', error);
      sendMessage(senderId, { text: '❌ An error occurred while processing your request. Please try again later.' }, pageAccessToken);
    }
  },
};