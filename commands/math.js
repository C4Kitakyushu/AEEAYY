const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'math',
  description: 'perform basic operation using math advance calculator .',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const input = args.join(' ').split('|');
    const operation = input[0]?.trim()?.toLowerCase();
    const num1 = parseFloat(input[1]?.trim());
    const num2 = parseFloat(input[2]?.trim());

    if (!operation || isNaN(num1) || isNaN(num2)) {
      return sendMessage(senderId, {
        text: 'Usage: math <operation> | <num1> | <num2>\n\nAvailable operations: add, subtract, multiply, divide\n\nexample: math add | 30 | 20'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: `⌛ Calculating ${operation} for ${num1} and ${num2}, please wait...`
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://jerome-web.gleeze.com/service/api/math?operation=${encodeURIComponent(operation)}&num1=${num1}&num2=${num2}`;
      const response = await axios.get(apiUrl);

      const { metadata, result } = response.data;

      if (result !== undefined) {
        await sendMessage(senderId, {
          text: `${metadata.name} 🔣\n\n𝗢𝗽𝗲𝗿𝗮𝘁𝗶𝗼𝗻: ${operation}\n𝗥𝗲𝘀𝘂𝗹𝘁: ${result}`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: '❌ Unable to calculate the result. Please check your inputs and try again.'
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error performing calculation:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while performing the calculation. Please try again later.'
      }, pageAccessToken);
    }
  }
};