const axios = require("axios");

module.exports = {
  name: "test",
  description: "generate a temporary email and fetch inbox messages",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {

    if (!args[0]) {
      return sendMessage(
        senderId,
        { text: "❗ Usage: `tempmailv2 gen` or `tempmailv2 inbox <token>`." },
        pageAccessToken
      );
    }

    if (args[0].toLowerCase() === "gen") {
      try {
        const response = await axios.get("https://haji-mix.up.railway.app/api/tempgen");
        const data = response.data;

        if (!data || !data.token || !data.address) {
          return sendMessage(
            senderId,
            { text: "⚠️ Failed to generate email. Please try again later." },
            pageAccessToken
          );
        }

        const token = data.token;
        const email = data.address;

        sendMessage(
          senderId,
          {
            text: `📧 | Generated Email: ${email}\n\n🔑 | COPY YOUR TOKEN⬇️\n${token} \n\n Check inbox using token example:\ntempmail inbox dywmalagdaimwd7jkwbwr8.`
          },
          pageAccessToken
        );
      } catch (error) {
        console.error("Error generating email:", error);
        sendMessage(
          senderId,
          { text: "⚠️ An error occurred while generating the email." },
          pageAccessToken
        );
      }
    } 

    else if (args[0].toLowerCase() === "inbox" && args.length === 2) {
      const token = args[1];
      try {
        const response = await axios.get(`https://haji-mix.up.railway.app/api/tempinbox?token=${token}`);
        const inbox = response.data.emails;

        if (!inbox || inbox.length === 0) {
          sendMessage(
            senderId,
            { text: "📭 No messages found in your inbox." },
            pageAccessToken
          );
        } else {
          const firstMail = inbox[0];
          const inboxFrom = firstMail.from || "Unknown Sender";
          const inboxSubject = firstMail.subject || "No Subject";
          const inboxBody = firstMail.body || "No content available.";
          const inboxDate = firstMail.date || "Unknown Date";

          sendMessage(
            senderId,
            {
              text: `🛡️ | TOKEN VERIFIED V2✅\n\n\EMAIL INBOX
━━━━━━━━━━━━━━━━
👤 From: ${inboxFrom}\n🔖 Subject: ${inboxSubject}
━━━━━━━━━━━━━━━━`
            },
            pageAccessToken
          );
        }
      } catch (error) {
        console.error("Error fetching inbox:", error);
        sendMessage(
          senderId,
          { text: "⚠️ An error occurred while fetching the inbox." },
          pageAccessToken
        );
      }
    } 

    else {
      sendMessage(
        senderId,
        { text: "❗ Usage `tempmailv2 gen` or `tempmailv2 inbox <token>`." },
        pageAccessToken
      );
    }
  }
};