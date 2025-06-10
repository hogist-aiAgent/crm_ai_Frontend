import React, { useEffect, useState, useRef } from 'react';
import { BiUser } from 'react-icons/bi';
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai';
import { FiMessageSquare, FiArrowLeft } from 'react-icons/fi';

export const UserChartConversation = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingNumber, setPlayingNumber] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [showChat, setShowChat] = useState(!isMobileView);
    const audioRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobileView(mobile);
            if (!mobile) setShowChat(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await fetch("https://hogist.com/food-api/outsource/");
                const data = await res.json();
                const cleaned = data.filter((data)=>data.status==="called"||data.status==="initiated").map((entry) => ({
                    contact_number: entry.contact_number || "none"
                }));
                console.log(cleaned,data)
                setContacts(cleaned);
                setFilteredContacts(cleaned);
              
            } catch (err) {
                console.error("❌ Failed to fetch contacts:", err);
            }
        };
        fetchContacts();
      
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        console.log(contacts,"contacts")
        const filtered = contacts.filter(c =>
            c.contact_number.toLowerCase().includes(query)
        );
        setFilteredContacts(filtered);
    }, [searchQuery, contacts]);

    const fetchConversation = async (contact) => {
        setSelectedNumber(contact.contact_number);
        if (isMobileView) setShowChat(true);
        setLoading(true);
        setMessages([]);
        setAudioURL(null);

        try {
//        https://hogist.com/food-api/get_latest_call_id_by_number/9677240444/

// https://hogist.com/food-api/get_transcript_audio_by_call/50db60bc-d41e-47ca-af02-3489eacd1bdc/
            const idRes = await fetch(`https://hogist.com/food-api/get_latest_call_id_by_number/+91${contact.contact_number}/`);
            const idData = await idRes.json();

            if (!idData.call_id) {
                setMessages([{ sender: "model", message: "⚠️ No call found for this number." }]);
                setLoading(false);
                return;
            }

            const convRes = await fetch(`https://hogist.com/food-api/get_transcript_audio_by_call/${idData.call_id}/`);
            const convData = await convRes.json();

            if (convData?.error) {
                setMessages([{ sender: "model", message: `⚠️ ${convData.error}` }]);
                setLoading(false);
                return;
            }

            const parsedMessages = convData.transcript.map((line) => ({
                sender: line.speaker.toLowerCase() === "user" ? "user" : "model",
                message: line.text
            }));

            setMessages(parsedMessages);
            setAudioURL(convData.audio_url || null);
        } catch (err) {
            console.error("❌ Error fetching conversation:", err);
            setMessages([{ sender: "model", message: "⚠️ Error fetching conversation." }]);
        }

        setLoading(false);
    };

    const handlePlayPause = (number) => {
        const audio = audioRef.current;
        if (!audio || !audioURL) return;

        if (playingNumber === number && isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.src = audioURL;
            audio.play();
            setIsPlaying(true);
            setPlayingNumber(number);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            setIsPlaying(false);
            setPlayingNumber(null);
        };

        audio.addEventListener("ended", handleEnded);
        return () => audio.removeEventListener("ended", handleEnded);
    }, []);

    return (
        <div className="py-6 px-4 min-h-screen bg-gradient-to-b from-black text-white font-sans">
            <div className="flex flex-col md:flex-row w-full h-[90vh] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">

                {/* Left Panel */}
                {!showChat || !isMobileView ? (
                    <div className="w-full md:w-1/3 bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col">
                        <div className="sticky top-0 bg-[#111] z-10 border-b border-gray-800">
                            <h2 className="text-xl font-semibold p-5 text-green-500 tracking-wide flex items-center gap-2">
                                <FiMessageSquare size={22} />
                                Transcript Contacts
                            </h2>
                            <div className="px-5 pb-3">
                                <input
                                    type="text"
                                    placeholder="Search by number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {filteredContacts.map((contact) => (
                                <div
                                    key={contact.contact_number}
                                    className={`flex items-center justify-between px-5 py-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-all duration-150 ${
                                        selectedNumber === contact.contact_number ? 'bg-gray-800' : ''
                                    }`}
                                >
                                    <div
                                        onClick={() => fetchConversation(contact)}
                                        className={`w-full truncate ${
                                            selectedNumber === contact.contact_number ? 'font-bold text-green-400' : 'text-gray-300'
                                        }`}
                                    >
                                        {contact.contact_number}
                                    </div>
                                    <button
                                        onClick={() => handlePlayPause(contact.contact_number)}
                                        disabled={!audioURL || selectedNumber !== contact.contact_number}
                                    >
                                        {playingNumber === contact.contact_number && isPlaying ? (
                                            <AiFillPauseCircle size={24} className="text-red-400" />
                                        ) : (
                                            audioURL &&
                                            selectedNumber === contact.contact_number && (
                                                <AiFillPlayCircle size={24} className="text-green-400" />
                                            )
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                {/* Right Panel */}
                {showChat && (
                    <div className="w-full md:w-2/3 flex flex-col bg-[#1a1a1a] bg-opacity-80 backdrop-blur-md max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-700 min-h-[60px]">
                            {isMobileView && (
                                <button
                                    onClick={() => setShowChat(false)}
                                    className="text-white bg-gray-700 p-2 rounded-full"
                                >
                                    <FiArrowLeft />
                                </button>
                            )}
                            <div className="bg-green-600 p-2 rounded-full"><BiUser size={20} /></div>
                            {
                               ! selectedNumber?<h2 className="text-lg font-semibold text-white leading-snug">
                                Please select the number
                            </h2>:<h2 className="text-lg font-semibold text-white leading-snug">
                                Conversation with <span className="text-green-400">{selectedNumber || "—"}</span>
                            </h2>
                            }
                            
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-20 space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    {Array(8).fill(0).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                                        >
                                            <div
                                                className="animate-pulse bg-gray-700 h-6 rounded-lg"
                                                style={{
                                                    width: `${60 + Math.random() * 30}%`,
                                                    padding: '1rem',
                                                    margin: '0.25rem 0',
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex justify-center mt-10">
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white text-sm shadow">
                                        <span className="text-yellow-400">⚠️</span>
                                        {
                                             ! selectedNumber?  <span>No Message</span>:
                                        <span>No call found for this number.</span>
                                        }
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} pt-3`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-5 py-3 rounded-xl text-sm shadow-md ${
                                                msg.sender === "user"
                                                    ? "bg-green-600 text-white rounded-br-none"
                                                    : "bg-gray-700 text-white rounded-bl-none"
                                            }`}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Audio player */}
            <audio ref={audioRef} />
        </div>
    );
};
