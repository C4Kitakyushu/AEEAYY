const axios = require("axios");

module.exports = {
  name: "fbshare",
  description: "Share a Facebook post multiple times using a cookie or token.",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length < 5) {
      return sendMessage(
        senderId,
        {
          text: "❗ Usage: `fbshare <postUrl> | <cookieOrToken> | <amount> | <privacy> | <interval>`\n\nExample:\nfbshare https://facebook.com/postURL | token_or_cookie | 100 | EVERYONE | 1",
        },
        pageAccessToken
      );
    }

    const [postUrl, cookieOrToken, shareAmount, privacy, intervalSeconds] = args.join(" ").split(" | ");

    if (!postUrl || !cookieOrToken || !shareAmount || !privacy || !intervalSeconds) {
      return sendMessage(
        senderId,
        {
          text: "❗ All parameters are required. Please provide:\n`<postUrl> | <cookieOrToken> | <amount> | <privacy> | <interval>`",
        },
        pageAccessToken
      );
    }

    await sendMessage(
      senderId,
      {
        text: `⌛ Sharing the post...\n\n🔗 Post URL: ${postUrl} \n🔑 Token/Cookie: Provided \n🔁 Shares: ${shareAmount} \n🔒 Privacy: ${privacy} \n⏱️ Interval: ${intervalSeconds} seconds`,
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