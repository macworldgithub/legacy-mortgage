import { useState, useRef, useEffect } from "react";
import { Button, Input, Spin } from "antd";
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { SERVER_URL } from "../../config";
import axios from "axios";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you?", sender: "bot", showButtons: false },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URL}/api/chat/ask-bot`, {
        userQuery: input,
      });
      setMessages([
        ...newMessages,
        { text: response.data.message, sender: "bot", showButtons:  response.data.vehicleDetails?true:false },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          text: "Sorry, something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
       <Button
       type="primary"
       shape="circle"
       icon={<MessageOutlined style={{ fontSize: "1.7rem" }} />}
       className="shadow-lg hover:scale-110 transition-all duration-300 !w-16 !h-16 flex items-center justify-center"
       onClick={() => setIsOpen(true)}
     />
      )}

      {isOpen && (
        <div className="w-96 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200 animate-fade-in">
          <div className="flex justify-between items-center bg-blue-600 text-white p-3">
            <span className="font-semibold">Live Chat</span>
            <CloseOutlined
              className="cursor-pointer text-lg"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="h-72 p-3 space-y-6 overflow-y-auto custom-scrollbar">
            {messages.map((msg, index) => (
              <div>


              <div key={index} className="space-y-2 gap-2 flex">
                <img className={`h-10 w-10 ${
                    msg.sender === "user"
                      ? "hidden"
                      : "block"
                  }`} src={"https://lcmagentportal.appspot.com/avatar/serve?id=6520621183205376"}/>
                <div
                  className={`p-2 rounded-md max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
                </div>

                {msg.showButtons && (
                  <div className="flex space-x-2 mt-3">
                    <Button
                      type="primary"
                      onClick={() => console.log("Chuck Down Deposit clicked")}
                    >
                      Chuck Down Deposit
                    </Button>
                    <Button
                      type="default"
                      onClick={() => console.log("Book Test Drive clicked")}
                    >
                      Book Test Drive
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 p-2 rounded-md max-w-[80%] bg-gray-200 text-black animate-pulse">
                <Spin size="small" />
                <span>Searching Inventory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 flex items-center border-t bg-gray-100">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              className="flex-1"
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              className="ml-2"
              onClick={handleSend}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
