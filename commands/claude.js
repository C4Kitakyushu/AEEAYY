module.exports = {
  name: 'claude',
  description: 'ask to Claude Sonnet 3.5',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const prompt = args.join(' ');

    if (!prompt) {
      sendMessage(senderId, { text: 'Please provide a valid question.' }, pageAccessToken);
      return;
    }

    try {
      const apiUrl = `https://rest-api.joshuaapostol.site/blackbox/model/claude-sonnet-3.5?prompt=${encodeURIComponent(prompt)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const answer = data?.response;

      if (!answer) {
        throw new Error('No valid response received from the API');
      }

      sendMessage(senderId, { 
        text: `🤖 CLAUDE SONNET 3.5 AI\n━━━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━━━` 
      }, pageAccessToken);

    } catch (error) {
      console.error('Error calling Claude Sonnet API:', error.message || error);

      // Provide a detailed error message
      sendMessage(senderId, { 
        text: '❌ | An error occurred while processing your request. Please try again later.' 
      }, pageAccessToken);
    }
  }
};
