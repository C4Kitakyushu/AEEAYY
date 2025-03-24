const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "imgbb",
  description: "upload an image to imgbb and get the link.",
  author: "developer",

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(
        senderId,
        { text: "No attachment detected. Please send an image or video first." },
        pageAccessToken
      );
    }

    await sendMessage(
      senderId,
      { text: "⌛ Uploading the image to IMGBB, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/imgbb?url=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);
      const imgbbLink = response?.data?.uploaded?.image;

      if (!imgbbLink) {
        throw new Error("❌ IMGBB link not found in the response");
      }

      await sendMessage(
        senderId,
        { text: `𝗜𝗺𝗴𝗯𝗯 𝘂𝗽𝗹𝗼𝗮𝗱𝗲𝗱:\n\n🔗: ${imgbbLink}` },
        pageAccessToken
      );
    } catch (error) {
      console.error("❌ Error uploading image to IMGBB:", error.response?.data || error.message);
      await sendMessage(
        senderId,
        { text: "❌ An error occurred while uploading the image to IMGBB. Please try again later." },
        pageAccessToken
      );
    }
  }
};