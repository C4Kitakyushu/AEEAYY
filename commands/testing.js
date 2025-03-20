const axios = require("axios");

module.exports = {
  name: "test",
  description: "Generate a temporary email and fetch inbox messages",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (!args[0]) {
      return sendMessage(
        senderId,
        { text: "❗ Please provide a valid command: `gen`, `inbox {email}`, or `read {email} {id}`." },
        pageAccessToken
      );
    }

    if (args[0].toLowerCase() === "gen") {
      try {
        const response = await axios.get("https://elevnnnx-rest-api.onrender.com/api/yopmail?q=create");
        const data = response.data;

        if (!data || !data.email) {
          return sendMessage(
            senderId,
            { text: "⚠️ Failed to generate email. Please try again later." },
            pageAccessToken
          );
        }

        const email = data.email;

        sendMessage(
          senderId,
          {
            text: `📧 | Generated Email: ${email}\n\nUse this email to check the inbox with:\n\`tempmail inbox ${email}\``
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
      const email = args[1];
      try {
        const response = await axios.get(`https://elevnnnx-rest-api.onrender.com/api/yopmail?q=inbox&email=${email}`);
        const inbox = response.data.messages;

        if (!inbox || inbox.length === 0) {
          sendMessage(
            senderId,
            { text: "📭 No messages found in your inbox." },
            pageAccessToken
          );
        } else {
          const firstMail = inbox[0];
          const inboxFrom = firstMail.sender || "Unknown Sender";
          const inboxSubject = firstMail.subject || "No Subject";
          const inboxId = firstMail.id || "Unknown ID";

          sendMessage(
            senderId,
            {
              text: `🛡️ | EMAIL INBOX\n━━━━━━━━━━━━━━━━\n👤 From: ${inboxFrom}\n🔖 Subject: ${inboxSubject}\n🆔 Message ID: ${inboxId}\n━━━━━━━━━━━━━━━━\n\nTo read the message, use:\n\`tempmail read ${email} ${inboxId}\``
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

    else if (args[0].toLowerCase() === "read" && args.length === 3) {
      const email = args[1];
      const id = args[2];
      try {
        const response = await axios.get(`https://elevnnnx-rest-api.onrender.com/api/yopmail?q=read&email=${email}&id=${id}`);
        const mailContent = response.data;

        if (!mailContent || !mailContent.content) {
          sendMessage(
            senderId,
            { text: "📭 Message content not found." },
            pageAccessToken
          );
        } else {
          sendMessage(
            senderId,
            {
              text: `📩 | MESSAGE CONTENT\n━━━━━━━━━━━━━━━━\n📝 ${mailContent.content}\n━━━━━━━━━━━━━━━━`
            },
            pageAccessToken
          );
        }
      } catch (error) {
        console.error("Error reading message:", error);
        sendMessage(
          senderId,
          { text: "⚠️ An error occurred while reading the message." },
          pageAccessToken
        );
      }
    }

    else {
      sendMessage(
        senderId,
        { text: "❗ Please provide a valid command: `gen`, `inbox {email}`, or `read {email} {id}`." },
        pageAccessToken
      );
    }
  }
};