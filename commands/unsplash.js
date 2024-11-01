const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  name: 'unsplash',  // Command name
  description: 'Retrieve a random Unsplash image based on a search term.',  // Command description
  usage: '!unsplash <search term>',  // Command usage example
  author: 'Your Name',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if search term arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a search term if missing
      await sendMessage(senderId, {
        text: 'Please provide a search term to find an image on Unsplash.'
      }, pageAccessToken);
      return;  // Exit the function if no search term is provided
    }

    // Concatenate arguments to form the search term
    const searchTerm = args.join(' ');
    const apiUrl = `https://betadash-uploader.vercel.app/unsplash?search=${encodeURIComponent(searchTerm)}&count=1`;  // API endpoint with the search term

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Searching for an image... Please wait.' }, pageAccessToken);

    try {
      // Fetch image URL from the API
      const response = await axios.get(apiUrl);
      const imageUrl = response.data?.url || '';

      if (imageUrl) {
        // Send the generated image to the user as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: imageUrl  // URL of the generated image
            }
          }
        }, pageAccessToken);
      } else {
        // Notify user if no image found
        await sendMessage(senderId, {
          text: 'No image found for your search term. Please try a different term.'
        }, pageAccessToken);
      }

    } catch (error) {
      // Handle and log any errors during image retrieval
      console.error('Error fetching image:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Sorry, an error occurred while retrieving the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
