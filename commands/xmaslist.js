const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "xmaslist",
  description: "Create a customized Christmas list image",
  author: "developer",
  usage: "Reply with 'xmaslist' followed by four text values separated by commas.",

  async execute(senderId, args, pageAccessToken) {
    // Check if four arguments are provided
    if (args.length < 4) {
      return sendMessage(senderId, {
        text: "❌ Please provide four text values separated by commas. Example: 'xmaslist Item1, Item2, Item3, Item4'"
      }, pageAccessToken);
    }

    const [text1, text2, text3, text4] = args;

    // Notify the user that the Christmas list creation is in progress
    sendMessage(senderId, { text: "⌛ Creating your Christmas list image, please wait..." }, pageAccessToken);

    try {
      // Fetch the Christmas list image from the API
      const response = await axios.get(
        `https://kaiz-apis.gleeze.com/api/xmas-list?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&text3=${encodeURIComponent(text3)}&text4=${encodeURIComponent(text4)}`
      );

      const processedImageURL = response.data.response;

      // Send the Christmas list image URL back to the user
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: processedImageURL,
          },
        },
      }, pageAccessToken);

    } catch (error) {
      console.error("❌ Error processing request:", error);
      await sendMessage(senderId, {
        text: "❌ An error occurred while creating your Christmas list. Please try again later."
      }, pageAccessToken);
    }
  }
};
