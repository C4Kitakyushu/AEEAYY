const axios = require("axios");

module.exports = {
  name: "tempmailv2",
  description: "Generate a temporary email or check its inbox",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args[0]) {
      return sendMessage(
        senderId,
        { text: "Please provide a valid command: 'create' or 'inbox {email}'." },
        pageAccessToken
      );
    }

    if (args[0].toLowerCase() === "create") {
      try {
        const EMAIL_API_URL = "https://apis-markdevs69v2.onrender.com/new/api/gen";
        const response = await axios.get(EMAIL_API_URL, { timeout: 2000 });
        const email = response.data.email;

        if (!email) {
          throw new Error("Failed to generate email.");
        }

        sendMessage(
          senderId,
          { text: `✅ Here is your generated email:\n\n✉️ Email: ${email}` },
          pageAccessToken
        );
      } catch (error) {
        console.error("Error generating email:", error);
        sendMessage(
          senderId,
          { text: "❌ An error occurred while generating the email." },
          pageAccessToken
        );
      }
    } else if (args[0].toLowerCase() === "inbox" && args.length === 2) {
      const email = args[1];
      if (!email) {
        return sendMessage(
          senderId,
          { text: "❌ Please provide an email address to check the inbox." },
          pageAccessToken
        );
      }

      try {
        const INBOX_API_URL = "https://xapiz.onrender.com/tempmail/inbox?email=";
        const response = await axios.get(`${INBOX_API_URL}${encodeURIComponent(email)}`, { timeout: 2000 });
        const messages = response.data;

        if (!Array.isArray(messages) || messages.length === 0) {
          return sendMessage(
            senderId,
            { text: "🔴 No messages found in the inbox for this email." },
            pageAccessToken
          );
        }

        const messageList = messages
          .map(
            (msg, index) =>
              `#${index + 1} 📧 From: ${msg.from || "Unknown"}\n📩 Subject: ${
                msg.subject || "No Subject"
              }\n📅 Date: ${msg.date || "Unknown"}`
          )
          .join("\n\n");

        sendMessage(
          senderId,
          { text: `📬 Checked Inbox for ${email}:\n\n${messageList}` },
          pageAccessToken
        );
      } catch (error) {
        console.error("Error fetching inbox:", error);
        sendMessage(
          senderId,
          { text: "❌ An error occurred while fetching the inbox." },
          pageAccessToken
        );
      }
    } else {
      sendMessage(
        senderId,
        {
          text: "❌ Invalid command. Use 'create' to generate an email or 'inbox {email}' to check the inbox.",
        },
        pageAccessToken
      );
    }
  },
};
