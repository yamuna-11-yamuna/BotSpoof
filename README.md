
🧠 BotSpoof – AI Chatbot

BotSpoof is a full-stack AI chatbot built with React, Node.js, MongoDB, and Ollama (Llama 3.2).
It works offline, supports user authentication, and allows real-time chat with a local AI model.

⚙️ Technologies Used

      Frontend: React + Tailwind CSS
      
      Backend: Node.js + Express
      
      Database: MongoDB
      
      AI Model: Ollama (Llama3.2:3b)
      
      Authentication: JWT + bcryptjs

🚀 How to Run the Project

1️⃣ Clone the Repository
git clone https://github.com/yamuna-11-yamuna/BotSpoof.git
cd BotSpoof

2️⃣ Start the Backend
cd backend
npm install
npm start


Create a .env file inside backend/:

PORT=4002
MONGO_URI=mongodb://127.0.0.1:27017/botspoof
JWT_SECRET=your-secret-key
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3.2:3b

3️⃣ Start the Frontend
   cd ../frontend
   npm install
   npm run dev
   
   
   Then open http://localhost:5173
    in your browser.

4️⃣ Start Ollama

In a separate PowerShell window:
  
  ollama serve
  ollama pull llama3.2:3b

💡 Features

     Sign Up / Sign In Authentication
     
     Secure JWT Token Login
     
     Offline AI Chat using Ollama
     
     Stores chat history in MongoDB

Modern, responsive UI

👩‍💻 Developer

Yamuna
Information Science & Engineering
Channabasaveshwara Institute of Technology

🧾 License

This project is for educational purposes only.
