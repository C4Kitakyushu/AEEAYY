const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'fbdl',  // Command name
  description: 'Downloads a video from a Facebook URL.',  // description 
  usage: 'downloadFacebookVideo <Facebook_Video_URL>',  // usage
  author: 'Ali',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if URL argument is provided
    if (!args || args.length === 0) {
      // Send message requesting a URL if missing
      await sendMessage(senderId, {
        text: 'Please provide a Facebook video URL.'
      }, pageAccessToken);
      return;  // Exit the function if no URL is provided
    }

    // Concatenate arguments to form the video URL
    const facebookVideoUrl = args.join(' ');
    const apiUrl = `https://markdevs-last-api-2epw.onrender.com/facebook?url=${encodeURIComponent(facebookVideoUrl)}`;  // API endpoint with the Facebook video URL

    // Notify user that the video is being fetched
    await sendMessage(senderId, { text: 'Downloading video... Please wait.' }, pageAccessToken);

    try {
      // Make the API call to fetch the video download link
      const response = await axios.get(apiUrl);

      // Check if the response has a valid video URL
      if (response.data && response.data.videoUrl) {
        // Send the fetched video to the user as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              url: response.data.videoUrl  // URL of the downloaded video
            }
          }
        }, pageAccessToken);
      } else {
        // Notify user if no video URL is found in the response
        await sendMessage(senderId, {
          text: 'No video found at the provided URL.'
        }, pageAccessToken);
      }

    } catch (error) {
      // Handle and log any errors during the API call
      console.error('Error downloading video:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while downloading the video. Please try again later.'
      }, pageAccessToken);
    }
  }
};
