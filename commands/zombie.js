const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "zombie",
  description: "Transform an image into a zombie-themed version.",
  author: "Developer",
  usage: "Send any picture first then reply with 'zombie'",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if an image URL is provided
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ Please send an image first, then type "zombie" to transform it into a zombie version.`,
      }, pageAccessToken);
    }

    // Notify the user that transformation is in progress
    sendMessage(senderId, { text: "🧟 Transforming the image into a zombie version, please wait..." }, pageAccessToken);

    try {
      // Fetch the zombie-transformed image from the API
      const apiUrl = `https://kaiz-apis.gleeze.com/api/zombie-v2?imageUrl=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);
      const processedImageUrl = response.data?.url;

      if (!processedImageUrl) {
        throw new Error("No transformed image URL received from the API.");
      }

      // Send the transformed image back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: processedImageUrl,
          },
        },
      }, pageAccessToken);

    } catch (error) {
      console.error("❌ Error processing zombie image:", error.response?.data || error.message);
      await sendMessage(senderId, {
        text: `❌ An error occurred while processing the image. Please try again later.`,
      }, pageAccessToken);
    }
  },
};