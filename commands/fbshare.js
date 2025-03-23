const axios = require("axios");

module.exports = {
  name: "fbshare",
  description: "Shares a Facebook post using user-defined parameters.",
  author: "YourName",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Validate input parameters
    if (args.length < 5) {
      return sendMessage(
        senderId,
        { text: "❗ Usage: `fbshare <postUrl> | <cookieOrToken> | <amount> | <privacy> | <interval>`" },
        pageAccessToken
      );
    }

    // Parse user input
    const [postUrl, cookieOrToken, shareAmount, privacy, intervalSeconds] = args.join(" ").split(" | ");

    if (!postUrl || !cookieOrToken || !shareAmount || !privacy || !intervalSeconds) {
      return sendMessage(
        senderId,
        { text: "⚠️ All parameters are required: postUrl, cookieOrToken, amount, privacy, intervalSeconds." },
        pageAccessToken
      );
    }

    try {
      // Call the API
      const response = await axios.get("https://haji-mix.up.railway.app/api/fbshare", {
        params: {
          postUrl: encodeURIComponent(postUrl),
          cookieOrToken,
          shareAmount,
          privacy,
          intervalSeconds,
        },
      });

      const data = response.data;

      if (data && data.status) {
        sendMessage(
          senderId,
          {
            text: `✅ Successfully shared the post ${shareAmount} times.\n\nCreator: ${data.creator}\nPost IDs:\n${data.postIds.join("\n")}`,
          },
          pageAccessToken
        );
      } else {
        sendMessage(
          senderId,
          { text: "⚠️ Sharing the post failed. Please check your parameters and try again." },
          pageAccessToken
        );
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      sendMessage(
        senderId,
        { text: "⚠️ An error occurred while processing your request. Please try again later." },
        pageAccessToken
      );
    }
  },
};