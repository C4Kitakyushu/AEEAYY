const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "fs",
  description: "Face swap between two images",
  author: "developer",
  usage: "Send the target image first, then the source image, and then type 'faceswap' to swap faces.",

  async execute(senderId, args, pageAccessToken, targetImageUrl, sourceImageUrl) {
    // Check if both image URLs are provided
    if (!targetImageUrl || !sourceImageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝘁𝗵𝗲 𝘁𝗮𝗿𝗴𝗲𝘁 𝗮𝗻𝗱 𝘀𝗼𝘂𝗿𝗰𝗲 𝗶𝗺𝗮𝗴𝗲𝘀 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗳𝗮𝗰𝗲𝘀𝘄𝗮𝗽" 𝘁𝗼 𝗳𝗮𝗰𝗲 𝘀𝘄𝗮𝗽.`
      }, pageAccessToken);
    }

    // Notify the user that the face swapping is in progress
    sendMessage(senderId, { text: "⌛ 𝗙𝗮𝗰𝗲 𝘀𝘄𝗮𝗽𝗽𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲𝘀, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...." }, pageAccessToken);

    try {
      // Fetch the face-swapped image from the API
      const response = await axios.get(`https://kaiz-apis.gleeze.com/api/faceswap-v2?targetUrl=${encodeURIComponent(targetImageUrl)}&sourceUrl=${encodeURIComponent(sourceImageUrl)}`);
      
      if (response.data && response.data.response) {
        const swappedImageURL = response.data.response;

        // Send the swapped image URL back to the user
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: {
              url: swappedImageURL
            }
          }
        }, pageAccessToken);
      } else {
        throw new Error("No image response from API");
      }
      
    } catch (error) {
      console.error("❌ Error processing face swap:", error);
      await sendMessage(senderId, {
        text: `❌ An error occurred while processing the face swap. Please try again later.`
      }, pageAccessToken);
    }
  }
};
