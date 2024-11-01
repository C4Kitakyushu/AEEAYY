const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'randomhentai',  // Command name
  description: 'generates a random hentai image.',  // description
  usage: 'randomHentai',  // usage
  author: 'YourName',  // Author of the command

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      // Notify user if prompt arguments are missing
      await sendMessage(senderId, {
        text: 'Please provide a prompt.'
      }, pageAccessToken);
      return;
    }

    // Concatenate arguments into a single prompt
    const prompt = args.join(' ');
    const apiUrl = `https://joshweb.click/api/randhntai?prompt=${encodeURIComponent(prompt)}`;  // API endpoint with encoded prompt

    // Notify user that the image is being generated
    await sendMessage(senderId, { text: 'Generating image... Please wait.' }, pageAccessToken);

    try {
      const response = await axios.get(apiUrl);
      const imageUrl = response.data.url;  // Extract image URL from API response

      // Send the image to the user
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error generating image:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'Failed to generate image. Please try again later.'
      }, pageAccessToken);
    }
  }
};
