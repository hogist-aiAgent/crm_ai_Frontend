import React, { useEffect, useState } from 'react';
import { BiUser } from 'react-icons/bi';

export const WhatsappChatBot = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatData, setChatData] = useState({});

    useEffect(() => {
        const fetchAllChats = async () => {
            try {
                const res = await fetch("https://hogist.com/app/get-all-chats/",{
                    method: "GET",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                });
                const data = await res.json(); 
                setChatData(data);
                console.log(data);
                
                setContacts(Object.keys(data));
            } catch (err) {
                console.error("❌ Failed to fetch chat data:", err);
            }
        };

        fetchAllChats();
    }, []);

    const fetchConversation = (number) => {
        const chatLines = chatData[number] || [];
        const parsed = chatLines.map((line) => {
            const [sender, ...rest] = line.split(":");
            return {
                sender: sender?.trim().toLowerCase() === "user" ? "user" : "model",
                message: rest.join(":").trim()
            };
        });
        setSelectedNumber(number);
        setMessages(parsed);
    };

    return (
        <div className="py-6 px-4">
            <div className="flex w-full h-[93vh] text-white border-2 border-gray-800">
                {/* Left Panel - Contact List */}
                <div className="w-1/3 border-r border-gray-800 overflow-y-auto">
                    <h2 className="text-lg font-semibold p-4 border-b border-gray-800">Chat Contacts</h2>
                    {contacts.map((number) => (
                        <button
                            key={number}
                            onClick={() => fetchConversation(number)}
                            className={`w-full text-left px-4 py-4 cursor-pointer ${
                                selectedNumber === number ? 'bg-gray-800 font-bold' : ''
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                {/* Right Panel - Conversation */}
                <div className="w-2/3 px-6 overflow-y-auto">
                    <div className="flex items-center gap-2 py-4">
                        <div className="bg-green-600 p-2 rounded-full"><BiUser size={20} /></div>
                        <h2 className="text-lg font-semibold">Conversation with {selectedNumber}</h2>
                    </div>

                    <div className="space-y-2 pb-10">
                        {messages.length === 0 && <p>Select a contact to view the chat</p>}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xl whitespace-pre-wrap px-4 py-2 rounded-lg text-sm ${
                                        msg.sender === "user"
                                            ? "bg-green-600 text-white rounded-br-none"
                                            : "bg-gray-200 text-black rounded-bl-none"
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
