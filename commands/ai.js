const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');
const token = fs.readFileSync('token.txt', 'utf8');

// [ true if turn on font & false if turn off ]
const useFontFormatting = false;

module.exports = {
  name: "ai",
  description: "Recognize or generate images using AI",
  author: "developer",

  async execute(senderId, args, event) {
    const pageAccessToken = token;
    const userPrompt = args.join(" ").trim();
    let imageUrl = "";

    if (!userPrompt && !event) {
      const defaultMessage = "❌ Provide a description for image generation or an image URL for recognition.";
      const formattedMessage = useFontFormatting ? formatResponse(defaultMessage) : defaultMessage;
      return await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    }

    const processingMessage = "⌛ Processing your request, please wait...";
    const formattedProcessingMessage = useFontFormatting ? formatResponse(processingMessage) : processingMessage;
    await sendMessage(senderId, { text: formattedProcessingMessage }, pageAccessToken);

    try {
      if (!imageUrl) {
        if (event.message?.reply_to?.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments?.[0]?.type === "image") {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      const apiUrl = "https://kaiz-apis.gleeze.com/api/gpt-4o-pro";
      const response = await handleAI3Request(apiUrl, userPrompt, imageUrl);
      const result = response.response;

      if (result.includes("TOOL_CALL: generateImage")) {
        const imageUrlMatch = result.match(/\!\[.*?\]\((https:\/\/.*?)\)/);
        if (imageUrlMatch && imageUrlMatch[1]) {
          const generatedImageUrl = imageUrlMatch[1];
          return await sendMessage(
            senderId,
            {
              attachment: {
                type: "image",
                payload: { url: generatedImageUrl },
              },
            },
            pageAccessToken
          );
        }
      }

      const defaultMessage = `${result}`;
      const formattedMessage = useFontFormatting ? formatResponse(defaultMessage) : defaultMessage;

      await sendConcatenatedMessage(senderId, formattedMessage, pageAccessToken);
    } catch (error) {
      console.error("Error in AI3 command:", error.message);
      const errorMessage = "❌ Error: Something went wrong.";
      const formattedMessage = useFontFormatting ? formatResponse(errorMessage) : errorMessage;
      await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
    }
  },
};

async function handleAI3Request(apiUrl, query, imageUrl) {
  const { data } = await axios.get(apiUrl, {
    params: {
      q: query || "",
      uid: "conversational",
      imageUrl: imageUrl || "",
    },
  });

  return data;
}

async function getRepliedImage(mid, pageAccessToken) {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken },
  });

  if (data?.data?.[0]?.image_data?.url) {
    return data.data[0].image_data.url;
  }

  return "";
}

async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}

function formatResponse(responseText) {
  const fontMap = {
    " ": " ",
    "a": "𝗮",
    "b": "𝗯",
    "c": "𝗰",
    "d": "𝗱",
    "e": "𝗲",
    "f": "𝗳",
    "g": "𝗴",
    "h": "𝗵",
    "i": "𝗶",
    "j": "𝗷",
    "k": "𝗸",
    "l": "𝗹",
    "m": "𝗺",
    "n": "𝗻",
    "o": "𝗼",
    "p": "𝗽",
    "q": "𝗾",
    "r": "𝗿",
    "s": "𝘀",
    "t": "𝘁",
    "u": "𝘂",
    "v": "𝘃",
    "w": "𝘄",
    "x": "𝘅",
    "y": "𝘆",
    "z": "𝘇",
    "A": "𝗔",
    "B": "𝗕",
    "C": "𝗖",
    "D": "𝗗",
    "E": "𝗘",
    "F": "𝗙",
    "G": "𝗚",
    "H": "𝗛",
    "I": "𝗜",
    "J": "𝗝",
    "K": "𝗞",
    "L": "𝗟",
    "M": "𝗠",
    "N": "𝗡",
    "O": "𝗢",
    "P": "𝗣",
    "Q": "𝗤",
    "R": "𝗥",
    "S": "𝗦",
    "T": "𝗧",
    "U": "𝗨",
    "V": "𝗩",
    "W": "𝗪",
    "X": "𝗫",
    "Y": "𝗬",
    "Z": "𝗭",
  };

  return responseText.split("").map((char) => fontMap[char] || char).join("");
}
