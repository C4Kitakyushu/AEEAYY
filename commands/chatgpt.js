const axios = require('axios');

module.exports = {
  name: 'chat',
  description: 'Generates AI responses using different models',
  usage: '/ai?model=<model_name>&system=<system_message>&question=<your_question>',
  author: 'Lance Cochangco',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const { model, system, question } = args;

    if (!model || !system || !question) {
      return sendMessage(senderId, "Please provide all required parameters: 'model', 'system', and 'question'. Example usage: /ai?model=gpt-4-turbo-2024-04-09&system=You%20are%20a%20helpful%20assistant&question=Hello");
    }

    const availableModels = [
      'gpt-4o-mini-free', 'gpt-4o-mini', 'gpt-4o-free', 'gpt-4-turbo-2024-04-09',
      'gpt-4o-2024-08-06', 'grok-2', 'grok-2-mini', 'claude-3-opus-20240229',
      'claude-3-opus-20240229-gcp', 'claude-3-sonnet-20240229', 'claude-3-5-sonnet-20240620',
      'claude-3-haiku-20240307', 'claude-2.1', 'gemini-1.5-flash-exp-0827', 'gemini-1.5-pro-exp-0827'
    ];

    if (!availableModels.includes(model)) {
      return sendMessage(senderId, `The model '${model}' is not supported. Please select from the available models: ${availableModels.join(', ')}`);
    }

    try {
      // Sending GET request to AI API
      const response = await axios.get(`https://mekumi-rest-api.onrender.com/api/ai?`, {
        params: {
          model,
          system,
          question
        }
      });

      // Sending back the response from the AI model
      if (response.data.success) {
        sendMessage(senderId, `AI Response: ${response.data.response}`);
      } else {
        sendMessage(senderId, "Error: Could not generate response from AI.");
      }
    } catch (error) {
      console.error("Error in AI API request:", error);
      sendMessage(senderId, "An error occurred while processing your request. Please try again later.");
    }
  }
};
