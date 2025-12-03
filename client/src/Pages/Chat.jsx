import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PageLayout from "../layout/PageLayout";

import { Search, Users, MessageCircle, Plus, ChevronLeft } from "lucide-react";
import ChatCard from "../components/cards/ChatCard";
import ChatWindow from "../components/ChatWindow";
import { useConversationStore } from "../store/conversationStore";
import { useAuthStore } from "../store/authStore";

const Chat = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const chat_id = searchParams.get("chat_id");
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { conversations, fetchAllConversation } = useConversationStore();
  const showChatArea = !isMobile || chat_id;

  useEffect(() => {
    const handleWindowResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  // Mock data - replace with actual API call

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        await fetchAllConversation(user.user_id);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    setChats(conversations);
    setFilteredChats(conversations);
  }, [conversations]);

  useEffect(() => {
    if (searchTerm) {
      const results = chats.filter(
        (chat) =>
          chat.group_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          chat.last_message?.toLowerCase().includes(searchTerm?.toLowerCase())
      );
      setFilteredChats(results);
    } else {
      setFilteredChats(chats);
    }
  }, [searchTerm, chats]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-gray-200 rounded-2xl h-96"></div>
                <div className="lg:col-span-3 bg-gray-200 rounded-2xl h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
console.log(chats)
  return (
    <PageLayout allowDefaultPadding={false}>
      <div className="flex  h-[84.5vh] bg-gray-50">
        {conversations && (
          <div
            className={`${
              isMobile && chat_id
                ? "hidden"
                : "w-full md:w-85 bg-white flex flex-col"
            }`}
          >
            {/* Search Bar: Fixed height section */}
            <div className="bg-white border border-gray-200 shadow-sm flex-shrink-0">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <ChatCard
                  key={chat.conversation_id}
                  chat={chat}
                  setChats={setChats}
                />
              ))}
            </div>
          </div>
        )}
        {showChatArea && (
          <div
            className={`flex-1 flex flex-col bg-white ${
              isMobile && !chat_id ? "hidden" : isMobile ? "w-full h-full" : ""
            }`}
          >
            {chat_id ? (
              <ChatWindow setChats={setChats} chatId={chat_id} mobile={isMobile} />
            ) : (
              <div className="w-full h-full flex items-center justify-center flex-col">
                <MessageCircle className="text-gray-600" size={36} />
                <p className="text-md text-gray-600">
                  open chat to start conversations
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Chat;
