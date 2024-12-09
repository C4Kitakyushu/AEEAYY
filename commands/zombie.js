const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "zombie",
  description: "Convert an image into a zombie version",
  author: "developer",
  usage: "Send any picture first then reply 'makeazombie'",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if an image URL is provided
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗺𝗮𝗸𝗲𝗮𝘇𝗼𝗺𝗯𝗶𝗲" 𝘁𝗼 𝗰𝗼𝗻𝘃𝗲𝗿𝘁 𝗶𝘁.`,
      }, pageAccessToken);
    }

    // Notify the user that the zombie transformation is in progress
    sendMessage(senderId, { text: "⌛ 𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗶𝗻𝘁𝗼 𝗮 𝘇𝗼𝗺𝗯𝗶𝗲 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...." }, pageAccessToken);

    try {
      // Fetch the zombie image from the API
      const response = await axios.get(`https://api.kenliejugarap.com/makeazombie-classic/?imageurl=${encodeURIComponent(imageUrl)}`);
      const processedImageURL = response.data.response;

      // Send the zombie image URL back to the user
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
        text: `❌ An error occurred while processing the image. Please try again later.`
      }, pageAccessToken);
    }
  }
};
