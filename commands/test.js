const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'generate temporary email or check inbox',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      if (args.length === 0) {
        return sendMessage(senderId, { text: "tempmail create and tempmail inbox <email>" }, pageAccessToken);
      }

      const command = args[0].toLowerCase();

      if (command === 'create') {
        let email;
        try {
          // Generate a random temporary email
          const response = await axios.get(HIDE);
          email = response.data.email;

          if (!email) {
            throw new Error("Failed to generate email");
          }
        } catch (error) {
          console.error("❌ | Failed to generate email", error.message);
          return sendMessage(senderId, { text: `❌ | Failed to generate email. Error: ${error.message}` }, pageAccessToken);
        }
        return sendMessage(senderId, { text: `generated email ✉️: ${email}` }, pageAccessToken);
      } else if (command === 'inbox' && args.length === 2) {
        const email = args[1];
        if (!email) {
          return sendMessage(senderId, { text: "❌ | Please provide an email address to check the inbox." }, pageAccessToken);
        }

        let inboxMessages;
        try {
          // Retrieve messages from the specified email
          const inboxResponse = await axios.get(`${RANKEDMATCHED}${email}`);
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
        return sendMessage(senderId, { text: `━━━━━━━━━━━━━━━━\n📬 Inbox messages for ${email}:\n${formattedMessage}` }, pageAccessToken);
      } else {
        return sendMessage(senderId, { text: `❌ | Invalid command. Use 'tempmail create (generate email)\ntempmail inbox <email>. (to inbox code)` }, pageAccessToken);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return sendMessage(senderId, { text: `❌ | An unexpected error occurred: ${error.message}` }, pageAccessToken);

// API FOR EMAIL & INBOX
const HIDE = "https://apis-markdevs69v2.onrender.com/new/api/gen";
const RANKEDMATCHED = "https://xapiz.onrender.com/tempmail/inbox?email=";

    }
  }
};