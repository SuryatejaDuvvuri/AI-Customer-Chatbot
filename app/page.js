'use client'
import { useState, useRef, useEffect } from 'react';
import {NextResponse} from 'next/server'
import { OpenAI } from "openai";

export default function Home() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [loading, setLoading] = useState(false);
  const sendMessage = async () => {
    if(message === '') return;
    setLoading(true);
    setMessage('');
    setMessages([...messages, { role: 'user', content: message }]);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        console.error('The OPENAI_API_KEY environment variable is missing or empty.');
        return;
      }
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      })
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
      { role: 'assistant', content: "Hi! I'm the Headstarter support assistant. How can I help you today?" },
      { role: 'user', content: message }
        ],
      });

      const response = completion.choices[0].message.content;
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: response }
      ]);
    }catch (error) {
        console.error(error);
        setMessages([
          ...messages,
          {
            role: 'assistant',
            content: 'I am sorry but I am unable to process your message at the moment.'
      }])
    }
    setLoading(false);
  }

  const keyHandler = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const messageEnding = useRef(null);
  const scroll = () => {
    messageEnding.current.scrollIntoView({ behavior: 'smooth' });
  }
    useEffect(() => {
      scroll();
  }, [messages]);

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
        onChange={(e) => setMessage(e.target.value)} disabled = {loading}
      />
      <button className="btn btn-contained" onClick={sendMessage} disabled = {loading}>
        Send
      </button>
    </div>
    <div ref={messageEnding}></div>
  </div>
</div>

  );
}
