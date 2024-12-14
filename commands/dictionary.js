const axios = require('axios');

module.exports = {
  name: 'dictionary',
  description: 'search for a word definition!',
  author: 'developer', // Replace with the desired author name if needed

  async execute(senderId, args, pageAccessToken, sendMessage) {
    // Check if a word is provided
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: '❗ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘄𝗼𝗿𝗱 𝘁𝗼 𝘀𝗲𝗮𝗿𝗰𝗵 𝗳𝗼𝗿.' }, pageAccessToken);
      return;
    }

    const word = args.join(' '); // Combine args to form the word
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

    // Notify the user that the word is being searched
    await sendMessage(senderId, { text: `🔍 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗱𝗲𝗳𝗶𝗻𝗶𝘁𝗶𝗼𝗻 𝗼𝗳 "${word}"...` }, pageAccessToken);

    try {
      // Fetch the word definition
      const response = await axios.get(apiUrl);
      const data = response.data[0];

      const { word: wordTitle, phonetics, meanings } = data;
      let phoneticsMessage = '';
      let meaningsMessage = '';

      // Process phonetics
      if (phonetics.length > 0) {
        phonetics.forEach((item) => {
          if (item.text) {
            phoneticsMessage += `\n📖 𝗣𝗿𝗼𝗻𝘂𝗻𝗰𝗶𝗮𝘁𝗶𝗼𝗻: /${item.text}/`;
          }
        });
      }

      // Process meanings
      meanings.forEach((meaning) => {
        const { partOfSpeech, definitions } = meaning;
        const definition = definitions[0]?.definition || '';
        const example = definitions[0]?.example
          ? `\n📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: "${definitions[0].example}"`
          : '';

        meaningsMessage += `\n• 🌟 𝗣𝗮𝗿𝘁 𝗼𝗳 𝗦𝗽𝗲𝗲𝗰𝗵: *${partOfSpeech}*\n   - ${definition}${example}`;
      });

      // Construct the final message
      const message = `🎓 𝗪𝗼𝗿𝗱: *${wordTitle.toUpperCase()}*\n${phoneticsMessage}\n\n📚 𝗠𝗲𝗮𝗻𝗶𝗻𝗴𝘀:${meaningsMessage}`;

      // Send the message to the user
      await sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      // Handle errors
      console.error(error);
      if (error.response?.status === 404) {
        await sendMessage(senderId, { text: `❌ 𝗡𝗼 𝗱𝗲𝗳𝗶𝗻𝗶𝘁𝗶𝗼𝗻𝘀 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿 "${word}".` }, pageAccessToken);
      } else {
        await sendMessage(senderId, { text: '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗵𝗲 𝗱𝗲𝗳𝗶𝗻𝗶𝘁𝗶𝗼𝗻. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.' }, pageAccessToken);
      }
    }
  },
};
