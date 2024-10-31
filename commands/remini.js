const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "remini",
  description: "enhance image quality",
  author: "developer",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗿𝗲𝗺𝗶𝗻𝗶" 𝘁𝗼 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝗶𝘁.`
      }, pageAccessToken);
    }

    // Send initial response without waiting
    sendMessage(senderId, { text: "⌛ 𝗘𝗻𝗵𝗮𝗻𝗰𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁.." }, pageAccessToken);

    try {
      // Enhance the image in the background
      const response = await axios.get(`https://markdevs-last-api-2epw.onrender.com/api/remini?inputImage=${encodeURIComponent(imageUrl)}`);
      const processedImageURL = response.data.image_data;

      // Send the enhanced image URL
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
