const axios = require("axios");

module.exports = {
  name: "test",
  description: "Generate multiple Facebook accounts.",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args[0] || isNaN(args[0])) {
      return sendMessage(
        senderId,
        {
          text: "❗ Usage: `fbcreate <amount>`\n\nExample: `fbcreate 2` to generate 2 accounts.",
        },
        pageAccessToken
      );
    }

    const amount = parseInt(args[0]);
    if (amount <= 0) {
      return sendMessage(
        senderId,
        { text: "❗ Please enter a valid amount greater than 0." },
        pageAccessToken
      );
    }

    await sendMessage(
      senderId,
      { text: "⌛ Generating Facebook accounts. Please wait..." },
      pageAccessToken
    );

    try {
      const response = await axios.get(`https://haji-mix.up.railway.app/api/fbcreate?amount=${amount}`);
      const data = response.data;

      if (!data || !data.accounts || data.accounts.length === 0) {
        return sendMessage(
          senderId,
          { text: "⚠️ No accounts were generated. Please try again later." },
          pageAccessToken
        );
      }

      const accounts = data.accounts
        .map(
          (acc, index) =>
            `📄 Account ${index + 1}:\n📧 Email: ${acc.email}\n👤 Name: ${acc.firstName} ${acc.lastName}\n🔑 Password: ${acc.password}\n━━━━━━━━━━━━━`
        )
        .join("\n\n");

      sendMessage(
        senderId,
        {
          text: `✔️ Successfully Generated ${amount} Facebook Accounts:\n\n${accounts}`,
        },
        pageAccessToken
      );
    } catch (error) {
      console.error("Error generating Facebook accounts:", error);
      sendMessage(
        senderId,
        { text: "⚠️ An error occurred while generating the Facebook accounts. Please try again later." },
        pageAccessToken
      );
    }
  },
};