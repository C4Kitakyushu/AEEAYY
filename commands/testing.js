const axios = require('axios');

const EMAIL_API_URL = "https://kaiz-apis.gleeze.com/api/tempmail-create";
const INBOX_API_URL = "https://kaiz-apis.gleeze.com/api/tempmail-inbox?token=";

module.exports = {
  name: 'testing',
  description: 'Generate temporary email or check inbox',
  author: 'Kaizenji',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      if (args.length === 0) {
        return sendMessage(senderId, { text: "Use 'tempmail create' to generate an email or 'tempmail inbox <token>' to check inbox." }, pageAccessToken);
      }

      const command = args[0].toLowerCase();

      if (command === 'create') {
        let email, token;
        try {
          const response = await axios.post(EMAIL_API_URL, {
            author: "Kaizenji",
            note: "To check inbox, use the token with the endpoint."
          });

          email = response.data.address;
          token = response.data.token;

          if (!email || !token) {
            throw new Error("Failed to generate email or retrieve token.");
          }
        } catch (error) {
          console.error("❌ | Failed to generate email", error.message);
          return sendMessage(senderId, { text: `❌ | Failed to generate email. Error: ${error.message}` }, pageAccessToken);
        }

        return sendMessage(senderId, { text: `Generated email ✉️: ${email}\n🔑 Token: ${token}` }, pageAccessToken);

      } else if (command === 'inbox' && args.length === 2) {
        const token = args[1];

        let inboxMessages;
        try {
          const inboxResponse = await axios.get(`${INBOX_API_URL}${token}`);
          inboxMessages = inboxResponse.data;

          if (!Array.isArray(inboxMessages)) {
            throw new Error("Unexpected response format");
          }
        } catch (error) {
          console.error(`❌ | Failed to retrieve inbox messages`, error.message);
          return sendMessage(senderId, { text: `❌ | Failed to retrieve inbox messages. Error: ${error.message}` }, pageAccessToken);
        }

        if (inboxMessages.length === 0) {
          return sendMessage(senderId, { text: "❌ | No messages found in the inbox." }, pageAccessToken);
        }

        // Get the most recent message
        const latestMessage = inboxMessages[0];
        const from = latestMessage.from || "Unknown sender";
        const date = latestMessage.date || "Unknown date";
        const subject = latestMessage.subject || "No subject";

        const formattedMessage = `📧 From: ${from}\n📩 Subject: ${subject}\n📅 Date: ${date}\n━━━━━━━━━━━━━━━━`;
        return sendMessage(senderId, { text: `━━━━━━━━━━━━━━━━\n📬 Inbox messages:\n${formattedMessage}` }, pageAccessToken);

      } else {
        return sendMessage(senderId, { text: `❌ | Invalid command. Use 'tempmail create' to generate an email or 'tempmail inbox <token>' to check inbox.` }, pageAccessToken);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return sendMessage(senderId, { text: `❌ | An unexpected error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};