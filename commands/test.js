const axios = require("axios");

module.exports = {
  name: "tempmail",
  description: "Generate a temporary email and fetch inbox messages",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {

    if (!args[0]) {
      return sendMessage(
        senderId,
        { text: "❗ Please provide a valid command: `gen` or `inbox {token}`." },
        pageAccessToken
      );
    }

    if (args[0].toLowerCase() === "gen") {
      try {
        const response = await axios.get("https://kaiz-apis.gleeze.com/api/tempmail-create");
        const data = response.data;

        if (!data || !data.token) {
          return sendMessage(
            senderId,
            { text: "⚠️ Failed to generate email. Please try again later." },
            pageAccessToken
          );
        }

        const token = data.token;
        const emailPrefix = token.slice(0, 12); // Create email format by combining token
        const emailDomain = "ktxri.terriblecoffee.org"; // Custom domain for display
        const email = `${emailPrefix}@${emailDomain}`;

        sendMessage(
          senderId,
          {
            text: `📧 | **Temporary Email:** ${email}\n\n🔑 | **Token:**\n${token}\n\nUse this token to check the inbox.`
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
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/tempmail-inbox?token=${token}`);
        const inbox = response.data.inbox;

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
              text: `📥 •=====[Inbox]=====•\n👤 From: ${inboxFrom}\n🔖 Subject: ${inboxSubject}\n📅 Date: ${inboxDate}\n\n💌 Message: ${inboxBody}`
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
        { text: "❗ Please provide a valid command: `gen` or `inbox {token}`." },
        pageAccessToken
      );
    }
  }
};