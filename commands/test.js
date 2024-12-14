const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Get a random recipe!',
  author: 'Developer', // Replace with the desired author name if needed
  async execute(senderId, args, pageAccessToken, sendMessage) {
    sendMessage(senderId, { text: "🍳 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗿𝗮𝗻𝗱𝗼𝗺 𝗿𝗲𝗰𝗶𝗽𝗲..." }, pageAccessToken);

    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      const recipe = response.data.meals[0];

      if (!recipe) {
        return sendMessage(senderId, { text: "🥺 𝗦𝗼𝗿𝗿𝘆, 𝗜 𝗰𝗼𝘂𝗹𝗱𝗻'𝘁 𝗳𝗶𝗻𝗱 𝗮 𝗿𝗲𝗰𝗶𝗽𝗲." }, pageAccessToken);
      }

      const {
        strMeal: title,
        strCategory: category,
        strArea: area,
        strInstructions: instructions,
        strMealThumb: thumbnail,
        strYoutube: youtubeLink
      } = recipe;

      const recipeMessage = `
🍽 𝗥𝗲𝗰𝗶𝗽𝗲 𝗧𝗶𝘁𝗹𝗲: ${title}
📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${category}
🌍 𝗔𝗿𝗲𝗮: ${area}
📋 𝗜𝗻𝘀𝘁𝗿𝘂𝗰𝘁𝗶𝗼𝗻𝘀: ${instructions}
${youtubeLink ? `▶️ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗟𝗶𝗻𝗸: ${youtubeLink}` : ''}
${thumbnail ? `🖼 𝗧𝗵𝘂𝗺𝗯𝗻𝗮𝗶𝗹: ${thumbnail}` : ''}
      `;

      sendMessage(senderId, { text: recipeMessage }, pageAccessToken);
    } catch (error) {
      console.error(error);
      sendMessage(senderId, { text: `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${error.message}` }, pageAccessToken);
    }
  }
};
