// src/pages/ChatPage.jsx
import React, { useState } from 'react'; // Import useState
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import ChatWindow from '../components/ChatWindow'; // Import ChatWindow component

const ChatPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className='relative flex w-full h-screen'>
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <ChatWindow onMenuClick={() => setSidebarOpen(true)} />
        </div>
    );
};

export default ChatPage;