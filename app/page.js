'use client';

import { useState, useRef, useEffect } from 'react';
import { OpenAI } from "openai";
// import { PineconeClient } from "@pinecone-database/pinecone"; 
// import { OpenAIEmbeddings } from "langchain";

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messageEnding = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEnding.current.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setLoading(true);
    const userMessage = message;
    setMessage('');
    setMessages([...messages, { role: 'user', content: userMessage }]);

    try {
      // Initialize Pinecone
      // const pinecone = new PineconeClient({
      //   apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      // });


      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      // const embeddings = new OpenAIEmbeddings({ openai });
      // const queryEmbedding = await embeddings.embedQuery(userMessage);

      // const index = pinecone.index("chatbot");
      // const response = await index.query({
      //   vector: queryEmbedding,
      //   topK: 1,
      // });

      // const contexts = response.matches.map(match => match.metadata.text).join("\n\n-------\n\n");
      // const augmentedQuery = `<CONTEXT>\n${contexts}\n-------\n</CONTEXT>\n\nMY QUESTION:\n${userMessage}`;

      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: 'system',
            content: "You are a Headstarter AI assistant that is expert in coding, and answering any computer science concepts and questions. Answer any questions I have about the provided context.",
          },
          {
            role: 'user',
            content: message,
          },
        ],
      });

      const assistantMessage = completion.choices[0].message.content;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: assistantMessage },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'I am sorry, but I am unable to process your message at the moment.',
        },
      ]);
    }

    setLoading(false);
  };

  const keyHandler = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
          <div ref={messageEnding}></div>
        </div>
        <div className="flex flex-row space-x-2">
          <input
            type="text"
            placeholder="Message"
            color="black"
            className="w-full border border-white text-black rounded-xl p-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={keyHandler}
            disabled={loading}
          />
          <button className="btn btn-contained" onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
