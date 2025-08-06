// src/context/ChatContext.jsx
import React, { createContext, useState, useContext } from 'react';
// We no longer need uuidv1 here, the backend will provide the IDs
// import {v1 as uuidv1} from "uuid"; 

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    // The current thread ID will now be managed by the URL or by clicking on a thread
    const [currThreadId, setCurrThreadId] = useState(null); 
    const [prevChats, setPrevChats] = useState([]); // stores all chats of curr threads
    const [allThreads, setAllThreads] = useState([]); // List of all user's threads
 const [newChat, setNewChat] = useState(true); 

    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        prevChats, setPrevChats,
        allThreads, setAllThreads,
        newChat, setNewChat
    };

    return (
        <ChatContext.Provider value={providerValues}>
            {children}
        </ChatContext.Provider>
    );
};