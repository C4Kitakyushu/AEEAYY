const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "remini",
  description: "enhance image quality .",
  author: "developer",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `Provide an image to enhance by replying with "remini".`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: "Generating..." }, pageAccessToken);

    try {
      const response = await axios.get(`https://markdevs-last-api-2epw.onrender.com/api/remini?inputImage=${encodeURIComponent(imageUrl)}`);
      const processedImageURL = response.data.image_data;

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