const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'generateImage',  // Command name
  description: 'Generates an image based on a prompt',  // description
  usage: '!generateImage <prompt>',  // usage
  author: 'Your Name',  // Author of the command

  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: 'Please provide a prompt to generate an image.'
      }, pageAccessToken);
      return;
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://c-v5.onrender.com/v1/dalle?prompt=${encodeURIComponent(prompt)}`;

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      // Call the API to generate the image
      const response = await axios.get(apiUrl);

      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: response.data.url  // Assuming response includes image URL in `data.url`
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Log the error for debugging
      console.error('Error generating image:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Sorry, there was an error generating your image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
