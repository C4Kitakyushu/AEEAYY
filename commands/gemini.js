const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "gemini",
  description:
    "Interact with GPT‑4 for text responses and Gemini Vision for image recognition",
  author: "developer",

  async execute(senderId, args, event) {
    const pageAccessToken = token;
    const userPrompt = (args.join(" ") || "Hello").trim();

    let finalPrompt = userPrompt;
    if (
      event &&
      event.message &&
      event.message.reply_to &&
      event.message.reply_to.message
    ) {
      finalPrompt = `${event.message.reply_to.message} ${userPrompt}`.trim();
    }

    if (!finalPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide your message." },
        pageAccessToken
      );
    }

    // Keywords for Gemini Vision trigger
    const geminiKeywords = ["sagutan", "answer this", "analyze", "recognize"];
    const useGemini = geminiKeywords.some((keyword) =>
      finalPrompt.toLowerCase().includes(keyword)
    );

    let imageUrl = null;
    if (event && event.message) {
      if (
        event.message.attachments &&
        event.message.attachments[0]?.type === "image"
      ) {
        imageUrl = event.message.attachments[0].payload.url;
      } else if (event.message.reply_to && event.message.reply_to.mid) {
        try {
          imageUrl = await getRepliedImage(
            event.message.reply_to.mid,
            pageAccessToken
          );
        } catch (error) {
          console.error("Error retrieving replied image:", error);
        }
      }
    }

    if (useGemini || imageUrl) {
      try {
        const apiUrl = "https://kaiz-apis.gleeze.com/api/gemini-vision";
        const response = await handleImageRecognition(
          apiUrl,
          finalPrompt,
          imageUrl,
          senderId
        );
        const result = response.response;
        await sendConcatenatedMessage(senderId, result, pageAccessToken);
      } catch (error) {
        console.error("Error in Gemini Vision command:", error);
        return sendMessage(
          senderId,
          { text: `❌ Error: ${error.message || "Something went wrong."}` },
          pageAccessToken
        );
      }
    } else {
      try {
        const apiUrl = `https://ccprojectapis.ddns.net/api/gpt4?ask=${encodeURIComponent(
          finalPrompt
        )}&id=${encodeURIComponent(senderId)}`;
        const { data } = await axios.get(apiUrl);
        const responseText = data || "No response from the AI.";
        await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
      } catch (error) {
        console.error("Error in GPT‑4 command:", error);
        return sendMessage(
          senderId,
          { text: "❌ Error: Something went wrong." },
          pageAccessToken
        );
      }
    }
  },
};

async function handleImageRecognition(apiUrl, prompt, imageUrl, senderId) {
  try {
    const { data } = await axios.get(apiUrl, {
      params: {
        q: prompt,
        uid: senderId,
        imageUrl: imageUrl || "",
      },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to connect to the Gemini Vision API.");
  }
}

async function getRepliedImage(mid, pageAccessToken) {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v21.0/${mid}/attachments`,
      { params: { access_token: pageAccessToken } }
    );
    return data?.data[0]?.image_data?.url || "";
  } catch (error) {
    throw new Error("Failed to retrieve replied image.");
  }
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