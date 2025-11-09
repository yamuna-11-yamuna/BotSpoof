import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatbotRoutes from './routes/chatbot.route.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// Defining routes
app.use("/bot/v1/", chatbotRoutes);
app.use("/auth/v1/", authRoutes);

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});