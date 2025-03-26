const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Fetch a recipe based on ingredients.',
  author: 'kaizenji',

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

      const { author, recipe } = response.data;

      if (recipe) {
        await sendMessage(senderId, {
          text: `✅ Recipe found for **${ingredients}**:\n\n**Author**: ${author}\n\n**Recipe**:\n${recipe}`
        }, pageAccessToken);
      } else {
        await sendMessage(senderId, {
          text: `❌ No recipes found for **${ingredients}**. Try different ingredients.`
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('❌ Error fetching recipe:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while fetching the recipe. Please try again later.'
      }, pageAccessToken);
    }
  }
};