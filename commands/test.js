const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'test',  // Command name
  description: 'Generates a random hentai video.',  // Description
  usage: 'random-hentai-video',  // Usage
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    const apiUrl = 'https://api.joshweb.click/api/randhntai';  // API endpoint

    // Notify user that the video is being fetched
    await sendMessage(senderId, { text: 'Fetching a random hentai video... Please wait.' }, pageAccessToken);

    try {
      // Call the API to fetch the video URL
      const response = await axios.get(apiUrl);

      // Check if the response contains a valid video URL
      if (response.data && response.data.url) {
        // Send the generated video to the user as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: response.data.url  // URL of the generated video
            }
          }
        }, pageAccessToken);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      // Handle and log any errors during the process
      console.error('Error fetching video:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while fetching the video. Please try again later.'
      }, pageAccessToken);
    }
  }
};
