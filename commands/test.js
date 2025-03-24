const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch trivia quiz questions.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const limit = args[0] || 5; // Default limit is 5 if no argument is provided

    if (isNaN(limit) || limit <= 0 || limit > 10) {
      return sendMessage(senderId, {
        text: '❌ Invalid limit parameter! Please provide a number between 1 and 10.'
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ Fetching trivia questions, please wait...' }, pageAccessToken);

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/quiz?limit=${limit}`;
      const response = await axios.get(apiUrl);
      const questions = response.data?.questions;

      if (!questions || questions.length === 0) {
        throw new Error('No questions found in the response.');
      }

      for (const question of questions) {
        const { question: text, category, difficulty, choices, correct_answer } = question;
        const formattedChoices = Object.entries(choices)
          .map(([key, value]) => `${key}. ${value}`)
          .join('\n');

        const message = `📚 **Category**: ${category}\n🎯 **Difficulty**: ${difficulty}\n\n❓ **Question**:\n${text}\n\n💡 **Choices**:\n${formattedChoices}`;
        
        await sendMessage(senderId, { text: message }, pageAccessToken);
      }
      
      await sendMessage(senderId, { text: '✅ All questions have been sent!' }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error fetching quiz questions:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching trivia questions. Please try again later.'
      }, pageAccessToken);
    }
  }
};