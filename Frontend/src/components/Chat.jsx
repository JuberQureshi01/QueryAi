import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
// You might not need this specific highlight.js CSS anymore because the typography plugin can handle it,
// but it's fine to keep for now.
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply, setPrevChats } = useChat();
  const [typingReply, setTypingReply] = useState("");
  const chatEndRef = useRef(null);

  // This useEffect handles auto-scrolling to the latest message. No changes needed.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, typingReply]);

  // These useEffects handle the typing animation. No changes needed to the logic.
  useEffect(() => {
    if (reply) {
      setPrevChats((prev) => [...prev, { role: "assistant", content: "" }]);
      setTypingReply(reply);
    }
  }, [reply]);

  useEffect(() => {
    if (typingReply) {
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < typingReply.length) {
          setPrevChats((prev) => {
            const newChats = [...prev];
            if (newChats.length > 0) {
              newChats[newChats.length - 1].content = typingReply.substring(
                0,
                charIndex + 1
              );
            }
            return newChats;
          });
          charIndex++;
        } else {
          clearInterval(interval);
          setTypingReply("");
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [typingReply, setPrevChats]);

  return (
    // Main container for the chat history, allows scrolling
    <div className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 overflow-y-auto">
      {/* Conditional "New Chat" message */}
      {newChat && !prevChats.length && (
        <div className="flex h-full items-center justify-center">
          <h1 className="text-2xl mt-12 sm:text-4xl font-bold text-gray-400">
            Start a New Chat!
          </h1>
        </div>
      )}

      {/* Container for all the message bubbles */}
      <div className="flex flex-col space-y-4 py-8">
        {prevChats?.map((chat, idx) => (
          // Each message bubble container
          <div
            key={idx}
            // This div aligns the bubble to the left (assistant) or right (user)
            className={`flex ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-lg">
              {chat.role === "user" ? (
                // User's message bubble
                <p className="bg-[#323232] px-4 py-2 rounded-2xl">
                  {chat.content}
                </p>
              ) : (
                // Assistant's message bubble, styled by the 'prose' class
                <div className="prose prose-invert prose-p:my-2 prose-pre:bg-[#282c34] prose-pre:rounded-lg">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {chat.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Invisible element at the end of the chat to enable auto-scrolling */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default Chat;
