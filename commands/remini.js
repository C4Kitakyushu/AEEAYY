const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "remini",
  description: "image enhancer",
  author: "developer",
  usage: "Send any picture first then reply remini",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if an image URL is provided
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗿𝗲𝗺𝗶𝗻𝗶" 𝘁𝗼 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 𝗶𝘁.`
      }, pageAccessToken);
    }

    // Notify the user that enhancement is in progress
    sendMessage(senderId, { text: "⌛ 𝗘𝗻𝗵𝗮𝗻𝗰𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...." }, pageAccessToken);

    try {
      // Fetch the enhanced image from the API
      const response = await axios.get(`https://markdevs-last-api-2epw.onrender.com/new/api/remini?inputImage=${encodeURIComponent(imageUrl)}`);
      const processedImageURL = response.data.response;

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
      console.error("❌ Error processing image:", error);
      await sendMessage(senderId, {
        text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗶𝗺𝗮𝗴𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.`
      }, pageAccessToken);
    }
  }
};
