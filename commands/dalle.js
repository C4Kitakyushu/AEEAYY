const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  name: 'dalle',  // Command name
  description: 'Generate images using DALL-E',  // Description
  usage: 'dalle <prompt>',  // Usage
  author: 'joshweb',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: '[ ❗ ] - Missing prompt for the DALL-E command'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://joshweb.click/dalle?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      // Fetch the generated image
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const imageData = `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;

      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageData  // URL of the generated image
          }
        },
        text: `Here is the image you requested:\n\nPrompt: ${prompt}`
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error in DALL-E command:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while processing your request.'
      }, pageAccessToken);
    }
  }
};
