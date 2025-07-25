import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "./index"; // your existing ChatWidget
import "./ChatWidget.css"; // import widget CSS

// Mount widget when page fully loads
window.addEventListener("load", () => {
  if (document.getElementById("bike-chat-widget-container")) return;

  const container = document.createElement("div");
  container.id = "bike-chat-widget-container";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<ChatWidget />);
});