const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "xmascap",
  description: "Add a Christmas cap to an image",
  author: "developer",
  usage: 'Send any picture first, then type "xmascap <color>" to apply a Christmas cap.',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if an image URL is provided
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ Please send an image first, then type "xmascap <color>" to apply a Christmas cap.`,
      }, pageAccessToken);
    }

    // Validate color input
    const validColors = ["red", "blue"];
    const color = args[0]?.toLowerCase();
    if (!validColors.includes(color)) {
      return sendMessage(senderId, {
        text: `❌ Invalid color! Please choose between "red" or "blue".`,
      }, pageAccessToken);
    }

    // Notify the user that processing is in progress
    sendMessage(senderId, {
      text: "⌛ Adding a Christmas cap to the image. Please wait...",
    }, pageAccessToken);

    try {
      // Fetch the processed image from the API
      const response = await axios.get(
        `https://kaiz-apis.gleeze.com/api/xmas-cap?imageUrl=${encodeURIComponent(imageUrl)}&color=${color}`
      );
      const processedImageURL = response.data.response;

      // Send the processed image URL back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: processedImageURL,
          },
        },
      }, pageAccessToken);
    } catch (error) {
      console.error("❌ Error processing image:", error);
      await sendMessage(senderId, {
        text: `❌ An error occurred while processing the image. Please try again later.`,
      }, pageAccessToken);
    }
  },
};
