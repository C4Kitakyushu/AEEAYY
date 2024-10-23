const axios = require("axios");

module.exports = {
  name: "tempmailv2",
  description: "generate random email and fetch inbox",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {

    if (!args[0]) {
      return sendMessage(senderId, { text: "Please provide a valid command: 'create' or 'inbox {email}'." }, pageAccessToken);
    }

    if (args[0] === "create") {
      try {
        const apiUrl = "https://c-v1.onrender.com/tempmail/gen";
        const response = await axios.get(apiUrl, { timeout: 2000 });
        const email = response.data.email;

        sendMessage(senderId, { text: `✅ Here is your generated email:\n\n✉️ Email: ${email}` }, pageAccessToken);
      } catch (error) {
        console.error("Error generating email:", error);
        sendMessage(senderId, { text: "An error occurred while generating the email." }, pageAccessToken);
      }
    } else if (args[0].toLowerCase() === "inbox" && args.length === 2) {
      const email = args[1];
      try {
        const apiUrl = `https://c-v1.onrender.com/tempmail/inbox?email=${encodeURIComponent(email)}`;
        const response = await axios.get(apiUrl, { timeout: 2000 });
        const messages = response.data;

        if (messages.length > 0) {
          const messageList = messages.map((msg, index) => 
            `#${index + 1} From: ${msg.from}\nSubject: ${msg.subject}\nDate: ${msg.date}`
          ).join('\n\n');
          
          sendMessage(
            senderId,
            { text: `📬 Checked Inbox for ${email}:\n\n${messageList}` },
            pageAccessToken
          );
        } else {
          sendMessage(senderId, { text: "🔴 No messages found in the inbox for this email." }, pageAccessToken);
        }
      } catch (error) {
        console.error("Error fetching inbox:", error);
        sendMessage(senderId, { text: "An error occurred while fetching the inbox." }, pageAccessToken);
      }
    } else {
      sendMessage(senderId, { text: "Please provide a valid command: 'create' or 'inbox {email}'." }, pageAccessToken);
    }
  }
};
