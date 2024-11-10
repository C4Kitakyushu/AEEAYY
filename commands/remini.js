const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "remini",
  description: "enhance image quality",
  author: "developer",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if an image URL is provided
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `Please send an image first, then type "upscale" to enhance it.`
      }, pageAccessToken);
    }

    // Notify the user that enhancement is in progress
    sendMessage(senderId, { text: "⏱️ | Your Photo is Enhancing. Please Wait...." }, pageAccessToken);

    try {
      // Fetch the enhanced image from the API
      const response = await axios.get(`https://hiroshi-api.onrender.com/image/upscale?url=${encodeURIComponent(imageUrl)}`);
      const processedImageURL = response.data;

      // Send the enhanced image URL back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: processedImageURL
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Error processing image:", error);
      await sendMessage(senderId, {
        text: `An error occurred while processing the image. Please try again later.`
      }, pageAccessToken);
    }
  }
};
