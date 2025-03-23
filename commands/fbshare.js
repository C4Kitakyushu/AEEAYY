const axios = require("axios");

module.exports = {
  name: "fbshare",
  description: "share a facebook post multiple times using a cookie or token.",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args[0] || !args[1]) {
      return sendMessage(
        senderId,
        {
          text: "❗ Usage: `fbshare fb url | token or cookie | amount | privacy | interval ",
        },
        pageAccessToken
      );
    }

    const postUrl = args[0];
    const cookieOrToken = args[1];
    const shareAmount = args[2] || 1; // Optional default to 1 share
    const privacy = args[3] || "EVERYONE"; // Optional privacy settings
    const intervalSeconds = args[4] || 1; // Optional default interval to 1 second

    await sendMessage(
      senderId,
      {
        text: `⌛ Sharing the post... \n\n🔗 Post URL: ${postUrl} \n🔒 Privacy: ${privacy} \n🔁 Shares: ${shareAmount}`,
      },
      pageAccessToken
    );

    try {
      const response = await axios.get(
        `https://haji-mix.up.railway.app/api/fbshare?postUrl=${encodeURIComponent(
          postUrl
        )}&cookieOrToken=${encodeURIComponent(
          cookieOrToken
        )}&shareAmount=${shareAmount}&privacy=${privacy}&intervalSeconds=${intervalSeconds}`
      );

      const data = response.data;

      if (data && data.status) {
        const sharedPosts = data.postIds.join(" | "); // Adds a pipe delimiter between post IDs

        sendMessage(
          senderId,
          {
            text: `✔️ Successfully shared the post ${shareAmount} times.\n\n📄 Post IDs:\n${sharedPosts}`,
          },
          pageAccessToken
        );
      } else {
        sendMessage(
          senderId,
          {
            text: "⚠️ Sharing failed. Please ensure your cookie/token and post URL are correct.",
          },
          pageAccessToken
        );
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      sendMessage(
        senderId,
        {
          text: "⚠️ An error occurred while sharing the post. Please try again later.",
        },
        pageAccessToken
      );
    }
  },
};