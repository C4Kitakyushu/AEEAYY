const axios = require("axios");

module.exports = {
  name: "test",
  description: "Automatically create a Facebook account.",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args[0]) {
      return sendMessage(
        senderId,
        { text: "❗ Usage: `fbcreate gen` to generate a Facebook account." },
        pageAccessToken
      );
    }

    if (args[0].toLowerCase() === "gen") {
      try {
        const response = await axios.get("https://ccprojectapis.ddns.net/api/fbcreate");
        const account = response.data;

        if (!account || !account.email || !account.password) {
          return sendMessage(
            senderId,
            { text: "⚠️ Failed to generate Facebook account. Please try again later." },
            pageAccessToken
          );
        }

        const email = account.email;
        const password = account.password;

        sendMessage(
          senderId,
          {
            text: `✔️ Facebook Account Generated:\n\n📧 Email: ${email}\n🔑 Password: ${password}\n\nYou can now use it for any purpose!`
          },
          pageAccessToken
        );
      } catch (error) {
        console.error("Error creating Facebook account:", error);
        sendMessage(
          senderId,
          { text: "⚠️ An error occurred while generating the Facebook account." },
          pageAccessToken
        );
      }
    } else {
      sendMessage(
        senderId,
        { text: "❗ Usage: `fbcreate gen` to generate a Facebook account." },
        pageAccessToken
      );
    }
  }
};