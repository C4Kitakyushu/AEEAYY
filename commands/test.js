const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch a recipe based on ingredients.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const ingredients = args.join(' ').trim();

    if (!ingredients) {
      return sendMessage(senderId, {
        text: '❌ Please provide ingredients to search for a recipe.\n\nFormat:\n**recipe <ingredients>**'
      }, pageAccessToken);
    }

    // Notify the user about the ongoing process
    await sendMessage(senderId, {
      text: `⌛ Searching for recipes with **${ingredients}**, please wait...`
    }, pageAccessToken);

    try {
      // API request
      const apiUrl = `https://kaiz-apis.gleeze.com/api/recipe?ingredients=${encodeURIComponent(ingredients)}`;
      const response = await axios.get(apiUrl);

      const { status, data } = response.data;

      if (status === 'success' && data && data.length > 0) {
        // Format recipes into a readable list
        const recipes = data.map((recipe, index) => `**${index + 1}. ${recipe.name}**\n${recipe.instructions}`).join('\n\n');

        await sendMessage(senderId, {
          text: `✅ Here are some recipes for **${ingredients}**:\n\n${recipes}`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `❌ No recipes found for **${ingredients}**. Try different ingredients.`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error fetching recipes:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching recipes. Please try again later.'
      }, pageAccessToken);
    }
  }
};