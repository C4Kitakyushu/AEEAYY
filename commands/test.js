const axios = require('axios');
const { sendMessage, listenForReplies } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch trivia quiz questions and allow the user to answer.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const limit = args[0];

    if (!limit || isNaN(limit) || limit <= 0 || limit > 10) {
      return sendMessage(senderId, {
        text: '❌ Invalid or missing limit parameter! Please provide a number between 1 and 10.'
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

        const message = `📚 **Category**: ${category}\n🎯 **Difficulty**: ${difficulty}\n\n❓ **Question**:\n${text}\n\n💡 **Choices**:\n${formattedChoices}\n\n📥 Reply with your answer (A, B, C, or D):`;

        await sendMessage(senderId, { text: message }, pageAccessToken);

        // Listen for the user's answer
        await listenForReplies(senderId, async (userReply) => {
          const userAnswer = userReply.toUpperCase();

          if (userAnswer === correct_answer) {
            await sendMessage(senderId, {
              text: `✅ Correct! Well done!`
            }, pageAccessToken);
          } else {
            await sendMessage(senderId, {
              text: `❌ Incorrect. The correct answer is **${correct_answer}. ${choices[correct_answer]}**.`
            }, pageAccessToken);
          }
        });
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