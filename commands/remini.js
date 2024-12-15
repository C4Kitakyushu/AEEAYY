const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "remini",
  description: "Enhanced photo",
  author: "Jonell Magallanes",
  usage: "Reply to an image with 'remini' to enhance it",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if an image URL is provided
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝘄𝗶𝘁𝗵 "𝗿𝗲𝗺𝗶𝗻𝗶" 𝘁𝗼 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝗶𝘁.`
      }, pageAccessToken);
    }

    // Notify the user that the enhancement is in progress
    sendMessage(senderId, { text: "⌛ 𝗬𝗼𝘂𝗿 𝗽𝗵𝗼𝘁𝗼 𝗶𝘀 𝗯𝗲𝗶𝗻𝗴 𝗲𝗻𝗵𝗮𝗻𝗰𝗲𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...." }, pageAccessToken);

    try {
      // Fetch the enhanced image from the API
      const response = await axios.get(`https://ccexplorerapisjonell.vercel.app/api/remini?imageUrl=${encodeURIComponent(imageUrl)}`);
      const processedImageURL = response.data.image_data;

      // Send the enhanced image back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: processedImageURL
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("❌ Error processing image:", error.message);
      await sendMessage(senderId, {
        text: `❌ An error occurred while processing the image. Please try again later.`
      }, pageAccessToken);
    }
  }
};
