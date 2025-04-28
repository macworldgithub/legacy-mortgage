import { useState, useRef, useEffect } from "react";
import { Button, Input, Spin } from "antd";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { SERVER_URL } from "../../config";
import image from "../../../public/pic.jpeg";
import axios from "axios";
import "./ChatWidget.css"; // Updated CSS!

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

  function parseLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" style="color: #1D4ED8; text-decoration: underline;">${url}</a>`;
    });
  }

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URL}/query`, {
        query: input,
      });
      setMessages([
        ...newMessages,
        {
          text: response.data.message,
          sender: "bot",
          showButtons: response.data.vehicleDetails ? true : false,
        },
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
    <div className="ai-chat-widget-wrapper fixed z-50">
      {/* Modern Yellow Button */}
      {!isOpen && (
        <div className="chat-button-container" onClick={() => setIsOpen(true)}>
          <button className="chat-button">
            <svg className="chat-button-icon" viewBox="64 64 896 896" focusable="false" fill="currentColor">
              <path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path>
            </svg>
            <span className="chat-button-text">How can I help?</span>
          </button>
        </div>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] max-w-sm bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200 animate-fade-in z-50">
<div className="flex justify-between items-center chat-popup-header p-3">
            <span className="font-semibold">Live Chat</span>
            <CloseOutlined
              className="cursor-pointer text-lg"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="h-60 sm:h-72 md:h-80 p-3 space-y-6 overflow-y-auto custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index}>
                <div className="space-y-2 gap-2 flex">
                  <img
                    className={`h-10 w-10 ${msg.sender === "user" ? "hidden" : "block"}`}
                    src={image}
                    alt="Bot Avatar"
                  />
                  <div
  className={`p-2 rounded-md max-w-[80%] ${
    msg.sender === "user"
      ? "user-message-bubble ml-auto"
      : "bg-gray-200 text-black"
  }`}

                    style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                    dangerouslySetInnerHTML={{ __html: parseLinks(msg.text) }}
                  ></div>
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
  shape="circle"
  icon={<SendOutlined />}
  className="ml-2 custom-send-button"
  onClick={handleSend}
  disabled={loading}
/>

          </div>
        </div>
      )}
    </div>
  );
}


// import { useState, useRef, useEffect } from "react";
// import { Button, Input, Spin } from "antd";
// import { MessageOutlined, SendOutlined, CloseOutlined } from "@ant-design/icons";
// import { SERVER_URL } from "../../config";
// import image from "../../../public/pic.jpeg";
// import axios from "axios";
// import "./ChatWidget.css";  // Make sure to create and import the CSS file

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can I assist you?", sender: "bot", showButtons: false },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   function parseLinks(text) {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.replace(urlRegex, (url) => {
//       return `<a href="${url}" target="_blank" style="color: #1D4ED8; text-decoration: underline;">${url}</a>`;
//     });
//   }

//   const handleSend = async () => {
//     if (input.trim() === "") return;

//     const newMessages = [...messages, { text: input, sender: "user" }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await axios.post(`${SERVER_URL}/query`, {
//         query: input,
//       });
//       setMessages([
//         ...newMessages,
//         {
//           text: response.data.message,
//           sender: "bot",
//           showButtons: response.data.vehicleDetails ? true : false,
//         },
//       ]);
//     } catch (error) {
//       setMessages([
//         ...newMessages,
//         {
//           text: "Sorry, something went wrong. Please try again.",
//           sender: "bot",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="ai-chat-widget-wrapper fixed z-50">
//       {/* Toggle Button at Bottom-Right */}
//       {!isOpen && (
//         <div className="fixed bottom-4 right-0">
//           <Button
//             type="primary"
//             icon={<MessageOutlined />}
//             className="rounded-l-none rounded-r-none !h-32 w-12 text-xs flex flex-col justify-center items-center whitespace-nowrap"
//             style={{
//               writingMode: "vertical-rl",
//               textOrientation: "mixed",
//             }}
//             onClick={() => setIsOpen(true)}
//           >
//             How can I help?
//           </Button>
//         </div>
//       )}

//       {/* Chat Widget */}
//       {isOpen && (
//         <div className="fixed bottom-6 right-6 w-[90vw] max-w-sm bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200 animate-fade-in z-50">
//           <div className="flex justify-between items-center bg-blue-600 text-white p-3">
//             <span className="font-semibold">Live Chat</span>
//             <CloseOutlined
//               className="cursor-pointer text-lg"
//               onClick={() => setIsOpen(false)}
//             />
//           </div>

//           <div className="h-60 sm:h-72 md:h-80 p-3 space-y-6 overflow-y-auto custom-scrollbar">
//             {messages.map((msg, index) => (
//               <div key={index}>
//                 <div className="space-y-2 gap-2 flex">
//                   <img
//                     className={`h-10 w-10 ${
//                       msg.sender === "user" ? "hidden" : "block"
//                     }`}
//                     src={image}
//                     alt="Bot Avatar"
//                   />
//                   <div
//                     className={`p-2 rounded-md max-w-[80%] ${
//                       msg.sender === "user"
//                         ? "bg-blue-500 text-white ml-auto"
//                         : "bg-gray-200 text-black"
//                     }`}
//                     style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
//                     dangerouslySetInnerHTML={{ __html: parseLinks(msg.text) }}
//                   ></div>
//                 </div>

//                 {msg.showButtons && (
//                   <div className="flex space-x-2 mt-3">
//                     <Button
//                       type="primary"
//                       onClick={() => console.log("Chuck Down Deposit clicked")}
//                     >
//                       Chuck Down Deposit
//                     </Button>
//                     <Button
//                       type="default"
//                       onClick={() => console.log("Book Test Drive clicked")}
//                     >
//                       Book Test Drive
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {loading && (
//               <div className="flex items-center space-x-2 p-2 rounded-md max-w-[80%] bg-gray-200 text-black animate-pulse">
//                 <Spin size="small" />
//                 <span>Searching Inventory...</span>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-3 flex items-center border-t bg-gray-100">
//             <Input
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onPressEnter={handleSend}
//               className="flex-1"
//             />
//             <Button
//               type="primary"
//               shape="circle"
//               icon={<SendOutlined />}
//               className="ml-2"
//               onClick={handleSend}
//               disabled={loading}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
