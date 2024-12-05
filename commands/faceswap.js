const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

const lastImageByUser = new Map(); // Store the last image sent by each user

module.exports = {
  name: "fs",
  description: "Face swap between two images",
  author: "developer",
  usage: "Send the target image first, then the source image, and then type 'faceswap' to swap faces.",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    // Check if the user has previously sent an image
    if (!args || args.length === 0) {
      return sendMessage(senderId, {
        text: `❌ Please send the target image first, then the source image, and then type "faceswap" to swap faces.`
      }, pageAccessToken);
    }

    // Check if it's the first or second image sent by the user
    if (!lastImageByUser.has(senderId)) {
      // Store the first image as the target image
      lastImageByUser.set(senderId, { targetImageUrl: imageUrl });
      return sendMessage(senderId, {
        text: `📸 Target image received. Now send the source image and then type "faceswap" to swap the faces.`
      }, pageAccessToken);
    } else {
      // Get the target image stored earlier
      const { targetImageUrl } = lastImageByUser.get(senderId);

      // Now that we have both images, we proceed with the face swap
      try {
        sendMessage(senderId, { text: "⌛ Face swapping images, please wait...." }, pageAccessToken);

        // Fetch the face-swapped image from the API
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/faceswap-v2?targetUrl=${encodeURIComponent(targetImageUrl)}&sourceUrl=${encodeURIComponent(imageUrl)}`);
        
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

      // Clear the stored images after the swap is completed
      lastImageByUser.delete(senderId);
    }
  }
};
