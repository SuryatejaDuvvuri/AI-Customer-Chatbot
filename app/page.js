'use client'
import { useState } from 'react';
import { OpenAI } from "@langchain/openai";

export default function Home() {

  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const sendMessage = async () => {
    const llm = new OpenAI({ modelName: "gpt-3.5-turbo" });
    await llm.invoke("Hello, world!");
  }
  return (
  <div class="w-screen h-screen flex flex-col justify-center items-center">
  <div class="flex flex-col w-[500px] h-[700px] border border-white p-2 space-y-3">
    <div class="flex flex-col space-y-2 flex-grow overflow-auto max-h-full">
      {messages.map((message, index) => (
        <div
          key={index}
          class={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            class={`${
              message.role === 'assistant' ? 'bg-primary-main' : 'bg-secondary-main'
            } text-white rounded-xl p-3`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
    <div class="flex flex-row space-x-2">
      <input
        type="text"
        color = "black"
        placeholder="Message"
        class="w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button class="btn btn-contained" onClick={sendMessage}>
        Send
      </button>
    </div>
  </div>
</div>

  );
}
