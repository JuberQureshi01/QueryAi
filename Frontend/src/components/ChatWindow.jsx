import Chat from "./Chat.jsx";
import { useChat } from '../context/ChatContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import { v1 as uuidv1 } from "uuid";
import api from '../service/api.js';

// Accept the onMenuClick prop from ChatPage.jsx
function ChatWindow({ onMenuClick }) {
    const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, setPrevChats, setNewChat, setAllThreads } = useChat();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);
        setReply(null);

        setPrevChats(prev => [...prev, { role: 'user', content: prompt }]);

        const threadIdToUse = currThreadId || uuidv1();
        if (!currThreadId) {
            setCurrThreadId(threadIdToUse);
        }

        const payload = {
            message: prompt,
            threadId: threadIdToUse
        };

        try {
            const response = await api.post("/chat", payload);
            const assistantReply = response.data.reply;
            setReply(assistantReply);

            if (!currThreadId) {
                setAllThreads(prev => [{ threadId: threadIdToUse, title: prompt }, ...prev]);
            }
        } catch (err) {
            console.log("Error fetching reply:", err);
        }
        setLoading(false);
        setPrompt("");
    }

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="relative flex flex-col h-screen w-full bg-[#212121] text-white items-center">
            
            {/* Navbar */}
            <div className="w-full flex justify-between items-center p-4 md:p-6">
                <div className="flex items-center gap-4">
                    {/* Hamburger menu icon, only visible on screens smaller than lg */}
                    <button onClick={onMenuClick} className="lg:hidden text-2xl text-white/80 hover:text-white">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <span className="text-lg font-semibold">QueryAI <i className="fa-solid fa-chevron-down text-xs"></i></span>
                </div>
                <div className="relative">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer" onClick={handleProfileClick}>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-[#323232] rounded-md shadow-lg z-10 p-2">
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer">
                                <i className="fa-solid fa-gear"></i> Settings
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer">
                                <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer" onClick={logout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Component */}
            <div className="flex-grow w-full overflow-y-auto custom-scrollbar">
                <Chat />
            </div>

            {/* Loader */}
            {loading && (
                <div className="absolute bottom-24">
                    <ScaleLoader color="#fff" />
                </div>
            )}
            
            {/* Chat Input Area */}
            <div className="w-full max-w-3xl p-4 flex flex-col items-center">
                <div className="relative w-full">
                    <input 
                        placeholder="Ask anything"
                        className="w-full bg-white/5 border-none rounded-2xl p-5 pr-14 text-base text-white shadow-lg focus:outline-none"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div 
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center text-xl cursor-pointer hover:text-gray-300"
                        onClick={getReply}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="text-xs text-gray-400 pt-2">
                    QueryAI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;