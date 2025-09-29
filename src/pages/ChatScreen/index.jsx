// import { useState, useRef, useEffect } from "react";
// import { Button, Input, Spin, DatePicker } from "antd";
// import { SendOutlined, CloseOutlined } from "@ant-design/icons";
// import { SERVER_URL } from "../../config";
// import image from "../../../public/pic.jpeg";
// import axios from "axios";
// import "./ChatWidget.css";

// export default function ChatWidget() {
//   const widgetId = "mortgage";
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { text: "Hello! May I have your full name, please?", sender: "bot", showButtons: false },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [showAppointmentPicker, setShowAppointmentPicker] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading, showAppointmentPicker]);

//   const handleOpenChat = async () => {
//     setIsOpen(true);
//     window.parent.postMessage(
//       {
//         event: "iframeButtonClick",
//       },
//       "*"
//     );
//     let userIP = "";
//     try {
//       const ipRes = await axios.get("https://api64.ipify.org?format=json");
//       userIP = ipRes.data.ip;
//     } catch (e) {
//       console.error("IP fetch failed", e);
//     }
//     try {
//       await axios.post(`https://widgetsanalytics.vercel.app/api/track-visitor`, {
//         event: "chat_opened",
//         timestamp: new Date().toISOString(),
//         widgetId,
//         ip: userIP,
//       });
//     } catch (error) {
//       console.error("Failed to track visitor:", error);
//     }
//   };

//   function parseLinks(text) {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.replace(urlRegex, (url) => {
//       return `<a href="${url}" target="_blank" style="color: #DEA74E; text-decoration: underline;">${url}</a>`;
//     });
//   }

//   const handleSend = async () => {
//     if (input.trim() === "") return;

//     const newMessages = [...messages, { text: input, sender: "user", showButtons: false }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     const requestBody = { query: input };
//     if (sessionId) requestBody.session_id = sessionId;

//     try {
//       const response = await axios.post(`${SERVER_URL}/query`, requestBody);
//       const newMessage = {
//         text: response.data.message,
//         sender: "bot",
//         showButtons: response.data.message.toLowerCase().includes("preferred day") || 
//                      response.data.message.toLowerCase().includes("preferred time"),
//       };
//       setMessages([...newMessages, newMessage]);
//       setSessionId(response.data.session_id);
//       if (newMessage.showButtons) {
//         setShowAppointmentPicker(true);
//       } else {
//         setShowAppointmentPicker(false);
//       }
//     } catch (error) {
//       setMessages([
//         ...newMessages,
//         {
//           text: "Sorry, something went wrong. Please try again.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookAppointment = async (date) => {
//     if (!sessionId || !date) {
//       setMessages([
//         ...messages,
//         {
//           text: "Please select a date and time for the appointment.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       return;
//     }

//     setLoading(true);
//     const preferredDay = date.format("YYYY-MM-DD");
//     const preferredTime = date.format("HH:mm");

//     try {
//       const response = await axios.post(`${SERVER_URL}/book_appointment`, {
//         session_id: sessionId,
//         preferred_day: preferredDay,
//         preferred_time: preferredTime,
//       });
//       setMessages([
//         ...messages,
//         {
//           text: response.data.message,
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       setShowAppointmentPicker(false);
//     } catch (error) {
//       const errorMessage = error.response?.data?.detail || "Error booking appointment. Please try again.";
//       setMessages([
//         ...messages,
//         {
//           text: errorMessage,
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="ai-chat-widget-wrapper">
//       {!isOpen && (
//         <div className="chat-button-container" onClick={handleOpenChat}>
//           <button className="chat-button">
//             <svg className="chat-button-icon" viewBox="64 64 896 896" focusable="false" fill="currentColor">
//               <path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path>
//             </svg>
//             <span className="chat-button-text">How can I help?</span>
//           </button>
//         </div>
//       )}

//       {isOpen && (
//         <div className="chat-popup">
//           <div className="chat-popup-header">
//             <span>Legacy Mortgage Chat</span>
//             <CloseOutlined
//               className="chat-popup-close"
//               onClick={() => setIsOpen(false)}
//             />
//           </div>
        
//           <div className="chat-popup-messages">
//             {messages.map((msg, index) => (
//               <div key={index} className="message-wrapper">
//                 {msg.sender !== "user" && (
//                   <img
//                     className="bot-avatar"
//                     src={image}
//                     alt="Bot Avatar"
//                   />
//                 )}
//                 <div
//                   className={msg.sender === "user" ? "user-message" : "bot-message"}
//                   dangerouslySetInnerHTML={{ __html: parseLinks(msg.text) }}
//                 ></div>
//               </div>
//             ))}
//             {showAppointmentPicker && (
//               <div className="message-wrapper">
//                 <div className="bot-message date-picker-container">
//                   <DatePicker
//                     showTime
//                     format="YYYY-MM-DD HH:mm"
//                     placeholder="Select date and time"
//                     onOk={handleBookAppointment}
//                     popupClassName="custom-date-picker"
//                   />
//                 </div>
//               </div>
//             )}
//             {loading && (
//               <div className="loading-message">
//                 <Spin size="small" />
//                 <span>Processing...</span>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//           <div className="powered-by-strip">
//             Powered by <a href="https://omnisuiteai.com/" target="_blank" rel="noopener noreferrer">OmniSuiteAI</a>
//           </div>
//           <div className="chat-popup-input">
//             <Input
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onPressEnter={handleSend}
//               disabled={showAppointmentPicker}
//             />
//             <Button
//               shape="circle"
//               icon={<SendOutlined />}
//               className="custom-send-button"
//               onClick={handleSend}
//               disabled={loading || showAppointmentPicker}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import { useState, useRef, useEffect } from "react";
// import { Button, Input, Spin, DatePicker, TimePicker } from "antd";
// import { SendOutlined, CloseOutlined } from "@ant-design/icons";
// import { SERVER_URL } from "../../config";
// import image from "../../../public/pic.jpeg";
// import axios from "axios";
// import "./ChatWidget.css";

// export default function ChatWidget() {
//   const widgetId = "mortgage";
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { text: "Hello! May I have your full name, please?", sender: "bot", showButtons: false },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [showAppointmentPicker, setShowAppointmentPicker] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//     // Detect mobile
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, [messages, loading, showAppointmentPicker]);

//   const handleOpenChat = async () => {
//     setIsOpen(true);
//     window.parent.postMessage(
//       {
//         event: "iframeButtonClick",
//       },
//       "*"
//     );
//     let userIP = "";
//     try {
//       const ipRes = await axios.get("https://api64.ipify.org?format=json");
//       userIP = ipRes.data.ip;
//     } catch (e) {
//       console.error("IP fetch failed", e);
//     }
//     try {
//       await axios.post(`https://widgetsanalytics.vercel.app/api/track-visitor`, {
//         event: "chat_opened",
//         timestamp: new Date().toISOString(),
//         widgetId,
//         ip: userIP,
//       });
//     } catch (error) {
//       console.error("Failed to track visitor:", error);
//     }
//   };

//   function parseLinks(text) {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.replace(urlRegex, (url) => {
//       return `<a href="${url}" target="_blank" style="color: #DEA74E; text-decoration: underline;">${url}</a>`;
//     });
//   }

//   const handleSend = async () => {
//     if (input.trim() === "") return;

//     const newMessages = [...messages, { text: input, sender: "user", showButtons: false }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     const requestBody = { query: input };
//     if (sessionId) requestBody.session_id = sessionId;

//     try {
//       const response = await axios.post(`${SERVER_URL}/query`, requestBody);
//       const newMessage = {
//         text: response.data.message,
//         sender: "bot",
//         showButtons: response.data.message.toLowerCase().includes("preferred day") || 
//                      response.data.message.toLowerCase().includes("preferred time"),
//       };
//       setMessages([...newMessages, newMessage]);
//       setSessionId(response.data.session_id);
//       if (newMessage.showButtons) {
//         setShowAppointmentPicker(true);
//       } else {
//         setShowAppointmentPicker(false);
//       }
//     } catch (error) {
//       setMessages([
//         ...newMessages,
//         {
//           text: "Sorry, something went wrong. Please try again.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirm = () => {
//     if (!sessionId || !selectedDate) {
//       setMessages([
//         ...messages,
//         {
//           text: "Please select a date and time for the appointment.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       return;
//     }

//     if (isMobile && !selectedTime) {
//       setMessages([
//         ...messages,
//         {
//           text: "Please select a time for your appointment.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       return;
//     }

//     setLoading(true);
//     const date = isMobile ? selectedDate.clone().set({
//       hour: selectedTime.hour(),
//       minute: selectedTime.minute(),
//     }) : selectedDate;

//     const preferredDay = date.format("YYYY-MM-DD");
//     const preferredTime = date.format("HH:mm");

//     try {
//       const response = axios.post(`${SERVER_URL}/book_appointment`, {
//         session_id: sessionId,
//         preferred_day: preferredDay,
//         preferred_time: preferredTime,
//       });
//       setMessages([
//         ...messages,
//         {
//           text: response.data.message,
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       setShowAppointmentPicker(false);
//       setSelectedDate(null);
//       setSelectedTime(null);
//     } catch (error) {
//       const errorMessage = error.response?.data?.detail || "Error booking appointment. Please try again.";
//       setMessages([
//         ...messages,
//         {
//           text: errorMessage,
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="ai-chat-widget-wrapper">
//       {!isOpen && (
//         <div className="chat-button-container" onClick={handleOpenChat}>
//           <button className="chat-button">
//             <svg className="chat-button-icon" viewBox="64 64 896 896" focusable="false" fill="currentColor">
//               <path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path>
//             </svg>
//             <span className="chat-button-text">How can I help?</span>
//           </button>
//         </div>
//       )}

//       {isOpen && (
//         <div className="chat-popup">
//           <div className="chat-popup-header">
//             <span>Legacy Mortgage Chat</span>
//             <CloseOutlined
//               className="chat-popup-close"
//               onClick={() => setIsOpen(false)}
//             />
//           </div>
        
//           <div className="chat-popup-messages">
//             {messages.map((msg, index) => (
//               <div key={index} className="message-wrapper">
//                 {msg.sender !== "user" && (
//                   <img
//                     className="bot-avatar"
//                     src={image}
//                     alt="Bot Avatar"
//                   />
//                 )}
//                 <div
//                   className={msg.sender === "user" ? "user-message" : "bot-message"}
//                   dangerouslySetInnerHTML={{ __html: parseLinks(msg.text) }}
//                 ></div>
//               </div>
//             ))}
//             {showAppointmentPicker && (
//               <div className="message-wrapper">
//                 <div className="bot-message date-picker-container">
//                   {!isMobile ? (
//                     <div>
//                       <DatePicker
//                         showTime
//                         format="YYYY-MM-DD HH:mm"
//                         placeholder="Select date and time"
//                         onChange={(date) => setSelectedDate(date)}
//                         popupClassName="custom-date-picker"
//                       />
//                       <Button
//                         type="primary"
//                         size="small"
//                         onClick={handleConfirm}
//                         style={{ marginTop: 8, width: "100%" }}
//                       >
//                         Confirm
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="mobile-date-time-picker">
//                       <DatePicker
//                         format="YYYY-MM-DD"
//                         placeholder="Select date"
//                         onChange={(date) => setSelectedDate(date)}
//                         popupClassName="custom-date-picker"
//                       />
//                       <TimePicker
//                         format="HH:mm"
//                         placeholder="Select time"
//                         onChange={(time) => setSelectedTime(time)}
//                         popupClassName="custom-date-picker"
//                       />
//                       <Button
//                         type="primary"
//                         size="small"
//                         onClick={handleConfirm}
//                         style={{ marginTop: 8 }}
//                       >
//                         Confirm
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//             {loading && (
//               <div className="loading-message">
//                 <Spin size="small" />
//                 <span>Processing...</span>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//           <div className="powered-by-strip">
//             Powered by <a href="https://omnisuiteai.com/" target="_blank" rel="noopener noreferrer">OmniSuiteAI</a>
//           </div>
//           <div className="chat-popup-input">
//             <Input
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onPressEnter={handleSend}
//               disabled={showAppointmentPicker}
//             />
//             <Button
//               shape="circle"
//               icon={<SendOutlined />}
//               className="custom-send-button"
//               onClick={handleSend}
//               disabled={loading || showAppointmentPicker}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import { useState, useRef, useEffect } from "react";
// import { Button, Input, Spin, DatePicker, TimePicker } from "antd";
// import { SendOutlined, CloseOutlined } from "@ant-design/icons";
// import { SERVER_URL } from "../../config";
// import image from "../../../public/pic.jpeg";
// import axios from "axios";
// import "./ChatWidget.css";
// import moment from "moment"; // Ensure Moment.js is imported

// export default function ChatWidget() {
//   const widgetId = "mortgage";
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { text: "Hello! May I have your full name, please?", sender: "bot", showButtons: false },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [showAppointmentPicker, setShowAppointmentPicker] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//     // Detect mobile
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, [messages, loading, showAppointmentPicker]);

//   const handleOpenChat = async () => {
//     setIsOpen(true);
//     window.parent.postMessage(
//       {
//         event: "iframeButtonClick",
//       },
//       "*"
//     );
//     let userIP = "";
//     try {
//       const ipRes = await axios.get("https://api64.ipify.org?format=json");
//       userIP = ipRes.data.ip;
//     } catch (e) {
//       console.error("IP fetch failed", e);
//     }
//     try {
//       await axios.post(`https://widgetsanalytics.vercel.app/api/track-visitor`, {
//         event: "chat_opened",
//         timestamp: new Date().toISOString(),
//         widgetId,
//         ip: userIP,
//       });
//     } catch (error) {
//       console.error("Failed to track visitor:", error);
//     }
//   };

//   function parseLinks(text) {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     return text.replace(urlRegex, (url) => {
//       return `<a href="${url}" target="_blank" style="color: #DEA74E; text-decoration: underline;">${url}</a>`;
//     });
//   }

//   const handleSend = async () => {
//     if (input.trim() === "") return;

//     const newMessages = [...messages, { text: input, sender: "user", showButtons: false }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     const requestBody = { query: input };
//     if (sessionId) requestBody.session_id = sessionId;

//     try {
//       const response = await axios.post(`${SERVER_URL}/query`, requestBody);
//       const newMessage = {
//         text: response.data.message,
//         sender: "bot",
//         showButtons:
//           response.data.message.toLowerCase().includes("preferred day") ||
//           response.data.message.toLowerCase().includes("preferred time"),
//       };
//       setMessages([...newMessages, newMessage]);
//       setSessionId(response.data.session_id);
//       if (newMessage.showButtons) {
//         setShowAppointmentPicker(true);
//       } else {
//         setShowAppointmentPicker(false);
//       }
//     } catch (error) {
//       setMessages([
//         ...newMessages,
//         {
//           text: "Sorry, something went wrong. Please try again.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirm = async () => {
//     if (!sessionId) {
//       setMessages([
//         ...messages,
//         {
//           text: "Session expired. Please start a new conversation.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       setShowAppointmentPicker(false);
//       return;
//     }

//     if (!selectedDate) {
//       setMessages([
//         ...messages,
//         {
//           text: "Please select a date for your appointment.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       return;
//     }

//     if (isMobile && !selectedTime) {
//       setMessages([
//         ...messages,
//         {
//           text: "Please select a time for your appointment.",
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       return;
//     }

//     setLoading(true);
//     let preferredDay, preferredTime;

//     if (isMobile) {
//       const dateTime = selectedDate.clone().set({
//         hour: selectedTime.hour(),
//         minute: selectedTime.minute(),
//       });
//       preferredDay = dateTime.format("YYYY-MM-DD");
//       preferredTime = dateTime.format("HH:mm");
//     } else {
//       preferredDay = selectedDate.format("YYYY-MM-DD");
//       preferredTime = selectedDate.format("HH:mm");
//     }

//     try {
//       const response = await axios.post(`${SERVER_URL}/book_appointment`, {
//         session_id: sessionId,
//         preferred_day: preferredDay,
//         preferred_time: preferredTime,
//       });
//       setMessages([
//         ...messages,
//         {
//           text: response.data.message,
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//       setShowAppointmentPicker(false);
//       setSelectedDate(null);
//       setSelectedTime(null);
//     } catch (error) {
//       const errorMessage = error.response?.data?.detail || "Error booking appointment. Please try again.";
//       setMessages([
//         ...messages,
//         {
//           text: errorMessage,
//           sender: "bot",
//           showButtons: false,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="ai-chat-widget-wrapper">
//       {!isOpen && (
//         <div className="chat-button-container" onClick={handleOpenChat}>
//           <button className="chat-button">
//             <svg className="chat-button-icon" viewBox="64 64 896 896" focusable="false" fill="currentColor">
//               <path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path>
//             </svg>
//             <span className="chat-button-text">How can I help?</span>
//           </button>
//         </div>
//       )}

//       {isOpen && (
//         <div className="chat-popup">
//           <div className="chat-popup-header">
//             <span>Legacy Mortgage Chat</span>
//             <CloseOutlined
//               className="chat-popup-close"
//               onClick={() => setIsOpen(false)}
//             />
//           </div>

//           <div className="chat-popup-messages">
//             {messages.map((msg, index) => (
//               <div key={index} className="message-wrapper">
//                 {msg.sender !== "user" && (
//                   <img
//                     className="bot-avatar"
//                     src={image}
//                     alt="Bot Avatar"
//                   />
//                 )}
//                 <div
//                   className={msg.sender === "user" ? "user-message" : "bot-message"}
//                   dangerouslySetInnerHTML={{ __html: parseLinks(msg.text) }}
//                 ></div>
//               </div>
//             ))}
//             {showAppointmentPicker && (
//               <div className="message-wrapper">
//                 <div className="bot-message date-picker-container">
//                   {!isMobile ? (
//                     <div>
//                       <DatePicker
//                         showTime
//                         format="YYYY-MM-DD HH:mm"
//                         placeholder="Select date and time"
//                         onChange={(date) => setSelectedDate(date)}
//                         popupClassName="custom-date-picker"
//                       />
//                       <Button
//                         type="primary"
//                         size="small"
//                         onClick={handleConfirm}
//                         style={{ marginTop: 8, width: "100%" }}
//                         disabled={!selectedDate}
//                       >
//                         Confirm
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="mobile-date-time-picker">
//                       <DatePicker
//                         format="YYYY-MM-DD"
//                         placeholder="Select date"
//                         onChange={(date) => setSelectedDate(date)}
//                         popupClassName="custom-date-picker"
//                       />
//                       <TimePicker
//                         format="HH:mm"
//                         placeholder="Select time"
//                         onChange={(time) => setSelectedTime(time)}
//                         popupClassName="custom-date-picker"
//                       />
//                       <Button
//                         type="primary"
//                         size="small"
//                         onClick={handleConfirm}
//                         style={{ marginTop: 8 }}
//                         disabled={!selectedDate || !selectedTime}
//                       >
//                         Confirm
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//             {loading && (
//               <div className="loading-message">
//                 <Spin size="small" />
//                 <span>Processing...</span>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//           <div className="powered-by-strip">
//             Powered by <a href="https://omnisuiteai.com/" target="_blank" rel="noopener noreferrer">OmniSuiteAI</a>
//           </div>
//           <div className="chat-popup-input">
//             <Input
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onPressEnter={handleSend}
//               disabled={showAppointmentPicker}
//             />
//             <Button
//               shape="circle"
//               icon={<SendOutlined />}
//               className="custom-send-button"
//               onClick={handleSend}
//               disabled={loading || showAppointmentPicker}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useRef, useEffect } from "react";
import { Button, Input, Spin, DatePicker, TimePicker, Form } from "antd";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { SERVER_URL } from "../../config";
import image from "../../../public/pic.jpeg";
import axios from "axios";
import "./ChatWidget.css";
import moment from "moment";

export default function ChatWidget() {
  const widgetId = "mortgage";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);
  const isFirstMessage = useRef(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [messages, loading, showAppointmentForm]);

  const handleOpenChat = async () => {
    setIsOpen(true);
    setMessages([{ text: "How can I help you?", sender: "bot", showButtons: false }]);
    isFirstMessage.current = false;
    window.parent.postMessage({ event: "iframeButtonClick" }, "*");
    let userIP = "";
    try {
      const ipRes = await axios.get("https://api64.ipify.org?format=json");
      userIP = ipRes.data.ip;
    } catch (e) {
      console.error("IP fetch failed", e);
    }
    try {
      await axios.post(`https://widgetsanalytics.vercel.app/api/track-visitor`, {
        event: "chat_opened",
        timestamp: new Date().toISOString(),
        widgetId,
        ip: userIP,
      });
    } catch (error) {
      console.error("Failed to track visitor:", error);
    }
  };

  function parseLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" style="color: #DEA74E; text-decoration: underline;">${url}</a>`;
    });
  }

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user", showButtons: false }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const requestBody = { query: input };
    if (sessionId) requestBody.session_id = sessionId;

    try {
      const response = await axios.post(`${SERVER_URL}/query`, requestBody);
      const newMessage = {
        text: response.data.message,
        sender: "bot",
        showButtons: response.data.message.includes("Please provide your full name"),
      };
      setMessages([...newMessages, newMessage]);
      setSessionId(response.data.session_id);
      setShowAppointmentForm(newMessage.showButtons);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          text: "Sorry, something went wrong. Please try again.",
          sender: "bot",
          showButtons: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async (values) => {
    if (!sessionId) {
      setMessages([
        ...messages,
        {
          text: "Session expired. Please start a new conversation.",
          sender: "bot",
          showButtons: false,
        },
      ]);
      setShowAppointmentForm(false);
      return;
    }

    setLoading(true);
    const preferredDay = values.date.format("YYYY-MM-DD");
    const preferredTime = isMobile ? values.time.format("HH:mm") : values.date.format("HH:mm");

    try {
      const response = await axios.post(`${SERVER_URL}/book_appointment`, {
        session_id: sessionId,
        preferred_day: preferredDay,
        preferred_time: preferredTime,
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
      });
      setMessages([
        ...messages,
        {
          text: response.data.message,
          sender: "bot",
          showButtons: false,
        },
      ]);
      setShowAppointmentForm(false);
      form.resetFields();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Error booking appointment. Please try again.";
      setMessages([
        ...messages,
        {
          text: errorMessage,
          sender: "bot",
          showButtons: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-widget-wrapper">
      {!isOpen && (
        <div className="chat-button-container" onClick={handleOpenChat}>
          <button className="chat-button">
            <svg className="chat-button-icon" viewBox="64 64 896 896" focusable="false" fill="currentColor">
              <path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path>
            </svg>
            <span className="chat-button-text">How can I help?</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-popup-header">
            <span>Legacy Mortgage Chat</span>
            <CloseOutlined
              className="chat-popup-close"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="chat-popup-messages">
            {messages.map((msg, index) => (
              <div key={index} className="message-wrapper">
                {msg.sender !== "user" && (
                  <img
                    className="bot-avatar"
                    src={image}
                    alt="Bot Avatar"
                  />
                )}
                <div
                  className={msg.sender === "user" ? "user-message" : "bot-message"}
                  dangerouslySetInnerHTML={{ __html: parseLinks(msg.text) }}
                ></div>
              </div>
            ))}
            {showAppointmentForm && (
              <div className="message-wrapper">
                <div className="bot-message form-container">
                  <Form
                    form={form}
                    onFinish={handleAppointmentSubmit}
                    layout="vertical"
                  >
                    <Form.Item
                      name="full_name"
                      label="Full Name"
                      rules={[{ required: true, message: "Please enter your full name" }]}
                    >
                      <Input placeholder="Enter your full name" />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, message: "Please enter a valid email", type: "email" }]}
                    >
                      <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[{ required: true, message: "Please enter your phone number" }]}
                    >
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>
                    {!isMobile ? (
                      <Form.Item
                        name="date"
                        label="Date and Time"
                        rules={[{ required: true, message: "Please select a date and time" }]}
                      >
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm"
                          placeholder="Select date and time"
                          popupClassName="custom-date-picker"
                        />
                      </Form.Item>
                    ) : (
                      <>
                        <Form.Item
                          name="date"
                          label="Date"
                          rules={[{ required: true, message: "Please select a date" }]}
                        >
                          <DatePicker
                            format="YYYY-MM-DD"
                            placeholder="Select date"
                            popupClassName="custom-date-picker"
                          />
                        </Form.Item>
                        <Form.Item
                          name="time"
                          label="Time"
                          rules={[{ required: true, message: "Please select a time" }]}
                        >
                          <TimePicker
                            format="HH:mm"
                            placeholder="Select time"
                            popupClassName="custom-date-picker"
                          />
                        </Form.Item>
                      </>
                    )}
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                        disabled={loading}
                      >
                        Confirm Appointment
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            )}
            {loading && (
              <div className="loading-message">
                <Spin size="small" />
                <span>Processing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="powered-by-strip">
            Powered by <a href="https://omnisuiteai.com/" target="_blank" rel="noopener noreferrer">OmniSuiteAI</a>
          </div>
          <div className="chat-popup-input">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              disabled={showAppointmentForm || loading}
            />
            <Button
              shape="circle"
              icon={<SendOutlined />}
              className="custom-send-button"
              onClick={handleSend}
              disabled={showAppointmentForm || loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}