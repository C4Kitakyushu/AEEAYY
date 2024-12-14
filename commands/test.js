const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'get a random recipe with an image!',
  usage: '/recipe',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    // Notify user that the recipe is being fetched
    await sendMessage(senderId, { text: '🍳 Fetching a random recipe... Please wait.' }, pageAccessToken);

    try {
      // Fetch the recipe from the API
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      const recipe = response.data.meals[0];

      if (!recipe) {
        await sendMessage(senderId, { text: '🥺 Sorry, I couldn\'t find a recipe.' }, pageAccessToken);
        return;
      }

      const {
        strMeal: title,
        strCategory: category,
        strArea: area,
        strInstructions: instructions,
        strMealThumb: thumbnail,
        strYoutube: youtubeLink
      } = recipe;

      // Construct the recipe message
      const recipeMessage = `
🍽 𝗥𝗲𝗰𝗶𝗽𝗲 𝗧𝗶𝘁𝗹𝗲: ${title}
📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${category}
🌍 𝗔𝗿𝗲𝗮: ${area}
📋 𝗜𝗻𝘀𝘁𝗿𝘂𝗰𝘁𝗶𝗼𝗻𝘀: ${instructions}
${youtubeLink ? `▶️ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗟𝗶𝗻𝗸: ${youtubeLink}` : ''}
      `;

      // Send the recipe message along with the thumbnail image
      await sendMessage(senderId, {
        text: recipeMessage,
        attachment: {
          type: 'image',
          payload: {
            url: thumbnail
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('Error fetching recipe:', error);
      // Notify user of the error
      await sendMessage(senderId, { text: '❌ An error occurred while fetching the recipe. Please try again later.' }, pageAccessToken);
    }
  }
};
