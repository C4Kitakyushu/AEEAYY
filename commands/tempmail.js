const axios = require('axios');

module.exports = {
  name: "tempmail",
  version: "1.0.0",
  description: "generates a temporary email address and optionally checks the inbox",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const command = args[0]; // 'check' or empty

    if (!command || command === "create") {
      // Generate a new temporary email address
      try {
        const response = await axios.get('https://c-v1.onrender.com/tempmail/gen', {
          timeout: 3000  // Set a 3-second timeout
        });
        const email = response.data.email;

        sendMessage(senderId, { text: `📩 your generated email: ${email}` }, pageAccessToken);
      } catch (error) {
        console.error("Error generating temporary email:", error.message);
        sendMessage(senderId, { text: 'An error occurred while generating the temporary email.' }, pageAccessToken);
      }
    } else if (command === "inbox") {
      const email = args[1]; // Email to check, should be provided in the second argument

      if (!email) {
        return sendMessage(senderId, { text: 'Please provide the temporary email address to check.' }, pageAccessToken);
      }

      // Check the inbox for the provided temporary email address
      try {
        const response = await axios.get(`https://c-v1.onrender.com/tempmail/inbox?email=${encodeURIComponent(email)}`, {
          timeout: 5000  // Set a 5-second timeout
        });
        const messages = response.data;

        if (messages.length > 0) {
          let messageList = messages.map((msg, index) => `#${index + 1} From: ${msg.from}\nSubject: ${msg.subject}\nDate: ${msg.date}`).join('\n\n');
          sendMessage(senderId, { text: `📬 Checked Inbox for ${email}:\n\n${messageList}` }, pageAccessToken);
        } else {
          sendMessage(senderId, { text: 'Your inbox is empty.' }, pageAccessToken);
        }
      } catch (error) {
        console.error("Error checking inbox:", error.message);
        sendMessage(senderId, { text: '❌ An error occurred while checking the inbox.' }, pageAccessToken);
      }
    } else {
      sendMessage(senderId, { text: '❌ Invalid command. Use tempmail to generate a new email or tempmail check <email> to check the inbox.' }, pageAccessToken);
    }
  }
};
