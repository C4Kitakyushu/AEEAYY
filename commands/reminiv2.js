const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "reminiv2",
  description: "Enhance an image using the Remini API",
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
      const response = await axios.get(`https://c-v5.onrender.com/v1/remini?url=${encodeURIComponent(imageUrl)}`);
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
      console.error("Error enhancing image", error);
      await sendMessage(senderId, {
        text: `⚠️ 𝗦𝗼𝗿𝗿𝘆, 𝘄𝗲 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝘁𝗵𝗲 𝗶𝗺𝗮𝗴𝗲 𝗱𝘂𝗲 𝘁𝗼 𝗮𝗻 𝗲𝗿𝗿𝗼𝗿. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.`
      }, pageAccessToken);
    }
  }
};
