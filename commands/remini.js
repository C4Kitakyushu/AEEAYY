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
    sendMessage(senderId, { text: "⌛ Enhancing image, please wait..." }, pageAccessToken);

    try {
      // Fetch the enhanced image from the API
      const upscaleUrl = `https://ccprojectapis.ddns.net/api/upscale?url=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(upscaleUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data, "utf-8");

      // Create a base64-encoded data URI for the enhanced image
      const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

      // Send the enhanced image back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: base64Image
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
