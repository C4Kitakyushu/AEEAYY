const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');
const path = require('path');

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
      // Fetch the video URL from the API
      const response = await axios.get(apiUrl);

      // Check if the response contains a valid video URL
      if (response.data && response.data.url) {
        const videoUrl = response.data.url;

        // Download the video file locally
        const videoPath = path.resolve(__dirname, 'temp_video.mp4');
        const videoStream = fs.createWriteStream(videoPath);

        await axios({
          method: 'get',
          url: videoUrl,
          responseType: 'stream',
        }).then((res) => {
          res.data.pipe(videoStream);
          return new Promise((resolve, reject) => {
            videoStream.on('finish', resolve);
            videoStream.on('error', reject);
          });
        });

        // Send the video as an attachment
        await sendMessage(senderId, {
          attachment: {
            type: 'video',
            payload: {
              is_reusable: true,
              filedata: fs.createReadStream(videoPath),
            },
          },
        }, pageAccessToken);

        // Clean up the temporary video file
        fs.unlinkSync(videoPath);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      // Handle and log any errors during the process
      console.error('Error fetching video:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while fetching the video. Please try again later.',
      }, pageAccessToken);
    }
  },
};
