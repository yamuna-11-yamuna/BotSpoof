import MessageModel from "../models/message.model.js";
import Bot from "../models/bot.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";

// 🔹 Memory to hold recent chat context per user
const userChatHistories = new Map();

function buildPrompt(userText, userId) {
  const chatHistory = userChatHistories.get(userId) || [];
  const historyText = chatHistory
    .map((msg) => `${msg.role}: ${msg.text}`)
    .join("\n");

  return `You are BotSpoof, a friendly and knowledgeable chatbot assistant.
Continue the conversation naturally based on the context below.

${historyText}
User: ${userText}
Bot:`;
}

// 🔹 Function to ask the local Ollama model
async function askOllama(userText, userId) {
  const prompt = buildPrompt(userText, userId);

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.7, num_ctx: 2048 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return (data.response || "").trim();
}

// 🔹 Middleware to verify JWT token and extract userId
export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Controller for chat message route
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.userId;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Text cannot be empty" });
    }

    // Save user message in DB with userId
    const userMessage = await MessageModel.create({ 
      userId,
      sender: "user", 
      text: text.trim() 
    });

    // Generate AI response from Ollama
    let botResponse;
    try {
      botResponse = await askOllama(text.trim(), userId);
    } catch (error) {
      console.error("Ollama call failed:", error.message);
      botResponse = "Ollama model not running. Please open PowerShell and run: ollama serve";
    }

    // Save bot reply in DB
    const botMessage = await MessageModel.create({ 
      userId,
      sender: "bot", 
      text: botResponse 
    });

    // Also save to Bot model if you still need it
    await Bot.create({ text: botResponse });

    // Update in-memory chat context for this specific user
    let chatHistory = userChatHistories.get(userId) || [];
    chatHistory.push({ role: "User", text });
    chatHistory.push({ role: "Bot", text: botResponse });
    if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
    userChatHistories.set(userId, chatHistory);

    return res.status(200).json({
      userMessage: userMessage.text,
      botMessage: botMessage.text,
    });
  } catch (error) {
    console.error("Error in Message controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};