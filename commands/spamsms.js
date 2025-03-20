const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "spamsms",
  description: "Spam OTP to a phone number",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const [phone, count, interval] = args;

    if (!phone || !count || !interval) {
      return sendMessage(
        senderId,
        { text: `❌ Please provide a phone number, count, and interval.\n\nUsage: spamsms <phone> <count> <interval>` },
        pageAccessToken
      );
    }

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/spamsms`;
      const response = await axios.get(apiUrl, {
        params: {
          phone: phone.trim(),
          count: parseInt(count),
          interval: parseInt(interval)
        }
      });

      const result = response.data;
      const successMessage = result.success
        ? `✅ Successfully sent ${result.count} messages to ${result.target_number} with an interval of ${result.interval} seconds.`
        : `❌ Failed to send messages.`;

      await sendMessage(senderId, { text: successMessage }, pageAccessToken);

    } catch (error) {
      console.error("Error in Spamsms command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};