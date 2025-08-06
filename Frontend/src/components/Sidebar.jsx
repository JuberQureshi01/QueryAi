import { useEffect } from "react";
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import api from '../service/api.js';

function Sidebar({ isSidebarOpen, setSidebarOpen }) {
    const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setPrevChats, setNewChat, setPrompt, setReply } = useChat();
    const { logout } = useAuth();

    useEffect(() => {
        const getAllThreads = async () => {
            try {
                const response = await api.get("/thread");
                const filteredData = response.data.map(thread => ({ threadId: thread.threadId, title: thread.title }));
                setAllThreads(filteredData);
            } catch (err) {
                console.log("Failed to fetch threads", err);
            }
        };
        getAllThreads();
    }, []);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(null);
        setPrevChats([]);
        setSidebarOpen(false); // Close sidebar on mobile when new chat is created
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await api.get(`/thread/${newThreadId}`);
            setPrevChats(response.data);
            setNewChat(false);
            setReply(null);
            setSidebarOpen(false); // Close sidebar on mobile when a thread is selected
        } catch (err) {
            console.log("Failed to change thread", err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            await api.delete(`/thread/${threadId}`);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log("Failed to delete thread", err);
        }
    }

    return (
        <>
            {/* Overlay for mobile view when sidebar is open */}
            <div 
                className={`fixed inset-0 bg-black/50 z-10 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* The Sidebar */}
            <section 
                className={`fixed top-0 left-0 h-full bg-[#171717] text-gray-400 w-80 flex flex-col justify-between z-20 transition-transform duration-300 ease-in-out 
                           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                           lg:relative lg:translate-x-0`}
            >
                <div>
                    {/* New Chat Button */}
                    <button 
                        onClick={createNewChat} 
                        className="flex justify-between items-center m-2.5 p-2.5 rounded border border-white/20 hover:bg-white/5 transition-colors duration-200 w-[calc(100%-20px)]"
                    >
                        <div className="flex items-center gap-3">
                            <img src="/src/assets/blacklogo.png" alt="gpt logo" className="h-7 w-7 bg-white rounded-full object-cover" />
                            <span>New Chat</span>
                        </div>
                        <span><i className="fa-solid fa-pen-to-square text-xl"></i></span>
                    </button>

                    {/* History */}
                    <ul className="m-2.5 p-2.5 h-full overflow-y-auto">
                        {allThreads?.map((thread) => (
                            <li 
                                key={thread.threadId}
                                onClick={() => changeThread(thread.threadId)}
                                // The 'group' class is used to show the trash icon on hover
                                className={`group relative text-sm p-2.5 my-1 rounded-lg cursor-pointer hover:bg-white/5 transition-colors duration-200 truncate
                                            ${thread.threadId === currThreadId ? "bg-white/10" : ""}`}
                            >
                                {thread.title}
                                {/* The 'group-hover' class makes this visible only when hovering the parent li */}
                                <i 
                                    className="fa-solid fa-trash absolute right-2 top-1/2 -translate-y-1/2  group-hover:opacity-100 text-white/60 hover:!text-red-400 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer / User Actions */}
                <div className="p-2.5 m-2.5 border-t border-white/20">
                    <button className="flex items-center gap-3 p-2.5 rounded-lg w-full hover:bg-white/5 transition-colors duration-200" onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Log Out</span>
                    </button>
                    <p className="text-xs text-center pt-2">By Juber Qureshi &hearts;</p>
                </div>
            </section>
        </>
    )
}

export default Sidebar;