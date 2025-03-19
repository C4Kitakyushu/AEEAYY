const axios = require("axios");

module.exports = {
  name: "tempmail",
  description: "Generate random email and fetch inbox",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {

    if (!args[0]) {
      return sendMessage(senderId, { 
        text: "Please provide a valid command: 'gen' or 'inbox {token}'." 
      }, pageAccessToken);
    }

    if (args[0] === "gen") {
      try {
        const apiUrl = "https://kaiz-apis.gleeze.com/api/tempmail-create";
        const response = await axios.get(apiUrl);

        const email = response.data.email;
        const token = response.data.token;

        sendMessage(senderId, {
          text: `📧 | Temporary Email: ${email}\n\n🔑 | Token: ${token}\n\nUse this token to check the inbox.`
        }, pageAccessToken);

      } catch (error) {
        console.error("Error generating email:", error);
        sendMessage(senderId, { text: "An error occurred while generating the email." }, pageAccessToken);
      }
    } else if (args[0].toLowerCase() === "inbox" && args.length === 2) {
      const token = args[1];
      try {
        const apiUrl = `https://kaiz-apis.gleeze.com/api/tempmail-inbox?token=${token}`;
        const response = await axios.get(apiUrl);
        const messages = response.data.emails;

        if (messages && messages.length > 0) {
          const inboxFrom = messages[0].from;
          const inboxSubject = messages[0].subject;
          const inboxBody = messages[0].body;
          const inboxDate = messages[0].date;

          sendMessage(
            senderId,
            { text: `•=====[Inbox]=====•\n👤 From: ${inboxFrom}\n🔖 Subject: ${inboxSubject}\n📅 Date: ${inboxDate}\n\n💌 Message: ${inboxBody}` },
            pageAccessToken
          );
        } else {
          sendMessage(senderId, { text: "🔴 No messages found in the inbox for this token." }, pageAccessToken);
        }
      } catch (error) {
        console.error("Error fetching inbox:", error);
        sendMessage(senderId, { text: "An error occurred while fetching the inbox." }, pageAccessToken);
      }
    } else {
      sendMessage(senderId, { text: "Please provide a valid command: 'gen' or 'inbox {token}'." }, pageAccessToken);
    }
  }
};