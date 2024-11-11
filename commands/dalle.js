const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'dalle',  // Command name
  description: 'generate images using openai\'s model dalle.',  // description 
  usage: '{p}dalle <prompt>',  // usage
  author: 'moskov',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: '🤔 Please provide a prompt.'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the prompt
    const prompt = args.join(' ');
    const apiUrl = `https://c-v5.onrender.com/v3/dalle?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with the prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      // Make API request to generate the image
      const response = await axios.get(apiUrl);
      const imageUrl = response.data.images;
      
      if (!imageUrl) {
        // Notify user if no image URL was returned
        await sendMessage(senderId, {
          text: '❌ No image returned from API.'
        }, pageAccessToken);
        return;
      }

      // Send the generated image to the user as an attachment
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl  // URL of the generated image
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during image generation
      console.error('Error generating image:', error.response ? error.response.data : error.message);
      
      // Notify user of the error
      await sendMessage(senderId, {
        text: '❌ Error generating image.'
      }, pageAccessToken);
    }
  }
};
