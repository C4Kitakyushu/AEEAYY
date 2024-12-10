const { addXmasCap } = require("../services/xmasCapService");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "xmascap",
  description: "Add a Christmas hat to an image",
  author: "developer",
  usage: "Send any picture first, then reply 'xmascap <red|blue>' to apply the effect.",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if an image URL is provided
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ Please send an image first, then type 'xmascap <red|blue>' to apply the Christmas hat effect.`,
      }, pageAccessToken);
    }

    // Validate the color argument
    const color = args[0]?.toLowerCase();
    if (!["red", "blue"].includes(color)) {
      return sendMessage(senderId, {
        text: `❌ Invalid color choice. Please choose either 'red' or 'blue'.`,
      }, pageAccessToken);
    }

    // Notify the user that the process is in progress
    sendMessage(senderId, { text: "🎅 Adding Christmas hat, please wait..." }, pageAccessToken);

    try {
      // Process the image with the Xmas Cap service
      const processedImageURL = await addXmasCap(imageUrl, color);

      // Send the processed image back to the user
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
