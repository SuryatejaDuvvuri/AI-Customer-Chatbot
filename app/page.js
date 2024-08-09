'use client'
import { useState } from 'react';
import { OpenAI } from "openai";
import dotenv from 'dotenv';

dotenv.config();

export default function Home() {

  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const sendMessage = async () => {

    
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENAI_API_KEY,
    })
    // await llm.invoke("Hello, world!");
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
      {
        role: 'user',
        content: "Hi! How are you doing?",
      }
      ],
    })

    console.log(completion.choices[0].message)
  }
  return (
  <div className="w-screen h-screen flex flex-col justify-center items-center">
  <div className="flex flex-col w-[500px] h-[700px] border border-white p-2 space-y-3">
    <div className="flex flex-col space-y-2 flex-grow overflow-auto max-h-full">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`${
              message.role === 'assistant' ? 'bg-primary-main' : 'bg-secondary-main'
            } text-white rounded-xl p-3`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
    <div className="flex flex-row space-x-2">
      <input
        type="text"
        placeholder="Message"
        color='black'
        className="w-full border border-white text-black rounded-xl p-3" // make the text black
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="btn btn-contained" onClick={sendMessage}>
        Send
      </button>
    </div>
  </div>
</div>

  );
}
