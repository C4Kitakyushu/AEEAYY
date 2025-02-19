const axios = require("axios");

module.exports = {
  name: "test",
  description: "Generate a temporary email and check its inbox",
  author: "YourName",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    
    if (!args[0]) {
      return sendMessage(senderId, { text: "❌ Please use 'create' to generate an email or 'inbox {token}' to check inbox." }, pageAccessToken);
    }

    if (args[0].toLowerCase() === "create") {
      try {
        const response = await axios.get("https://kaiz-apis.gleeze.com/api/tempmail-create", { timeout: 3000 });
        const { email, token } = response.data;

        sendMessage(senderId, { 
          text: `✅ Your temporary email:\n\n✉️ Email: ${email}\n🔑 Token: ${token}\n\nUse 'inbox ${token}' to check your inbox.` 
        }, pageAccessToken);

      } catch (error) {
        console.error("Error generating email:", error);
        sendMessage(senderId, { text: "⚠️ Failed to generate an email. Please try again later." }, pageAccessToken);
      }

    } else if (args[0].toLowerCase() === "inbox" && args[1]) {
      const token = args[1];
      try {
        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/tempmail-inbox?token=${token}`, { timeout: 3000 });
        const messages = response.data;

        if (messages.length > 0) {
          const messageList = messages.map((msg, index) => 
            `📩 #${index + 1}\nFrom: ${msg.from}\nSubject: ${msg.subject}\nDate: ${msg.date}`
          ).join('\n\n');

          sendMessage(senderId, { text: `📬 Inbox Messages:\n\n${messageList}` }, pageAccessToken);
        } else {
          sendMessage(senderId, { text: "📭 No messages found in this inbox yet." }, pageAccessToken);
        }

      } catch (error) {
        console.error("Error fetching inbox:", error);
        sendMessage(senderId, { text: "⚠️ Failed to fetch inbox messages. Please check your token and try again." }, pageAccessToken);
      }

    } else {
      sendMessage(senderId, { text: "❌ Invalid command! Use 'create' to generate an email or 'inbox {token}' to check inbox." }, pageAccessToken);
    }
  }
};