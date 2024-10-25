const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "cdp",
  description: "send a random couple display picture using the cdp api.",
  usage: "example: cdp",
  author: "developer",
  async execute(senderId, args, pageAccessToken) {
    const apiUrl = "https://markdevs69v2-679r.onrender.com/api/randomgambar/couplepp";

    try {
      // Notify the user that the image is being fetched
      await sendMessage(senderId, {
        text: "⌛ Fetching a random Couple DP..."
      }, pageAccessToken);

      // Fetch the couple DP URLs from the API
      const response = await axios.get(apiUrl);
      const { male, female } = response.data;

      // Send the male DP image
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: male,
            is_reusable: true
          }
        }
      }, pageAccessToken);

      // Send the female DP image
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: female,
            is_reusable: true
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Error fetching couple DP:", error);
      await sendMessage(senderId, {
        text: "An error occurred while fetching the couple DP. Please try again later."
      }, pageAccessToken);
    }
  }
};
