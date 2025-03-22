const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'fluxlora',
  description: 'generate images using flux lora. Prompt and model 1-7 ',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length < 2) {
      await sendMessage(senderId, { text: '❌ Please provide both a prompt and a model number (1-7).\n Example:\n flux-lora dog 2' }, pageAccessToken);
      return;
    }

    const prompt = args.slice(0, -1).join(' ');
    const model = parseInt(args[args.length - 1]);

    // Validate model range
    if (isNaN(model) || model < 1 || model > 7) {
      await sendMessage(senderId, { text: '❌ Invalid model number. Please choose a model between 1 and 7\n 🖼️: AVAILABLE MODEL\n
Default 
Cyberpunk
Anime 
Chibi
Pixel Art
Oil Painting 
3D' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/flux-lora?prompt=${encodeURIComponent(prompt)}&model=${encodeURIComponent(model)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result_url) {
        const imageUrl = response.data.result_url;
        const selectedModel = response.data.selected_model || 'Unknown';

        // Send the generated image
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: imageUrl }
          }
        }, pageAccessToken);

        // Optionally send model info
        await sendMessage(senderId, { text: `🖼️•Selected Model: ${selectedModel}` }, pageAccessToken);
      } else {
        console.error('Error: No valid result returned from API.');
        await sendMessage(senderId, { text: '❌ Could not generate the image. Please check your input.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Flux Lora API:', error);
      await sendMessage(senderId, { text: '❌ There was an error processing your request. Please try again later.' }, pageAccessToken);
    }
  }
};