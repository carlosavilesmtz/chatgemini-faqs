# Project: AI Customer Assistant Widget

## 🎯 Project Goal
This project is a self-contained, embeddable AI customer assistant chat widget. It's designed to be placed on any website to provide instant, AI-powered customer support based on a configurable set of company information. The entire application runs in the client's browser and communicates directly with the Google Gemini API.

## 🛠️ Tech Stack
- **Framework**: React 19 (via CDN)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **AI**: Google Gemini API (`@google/genai` library via CDN)
- **Backend**: None (purely client-side)

## Key Features
- **Embeddable Widget**: A floating button that opens a chat interface.
- **Dynamic Configuration**: A settings panel allows real-time updates to the assistant's personality, company information, product details, promotions, and FAQs.
- **Persistent Settings**: All configurations are saved to the browser's `localStorage`.
- **Cost & Token Tracking**: The UI displays token usage and estimated cost in MXN for each interaction with the Gemini API.
- **"Human-like" Responses**: Longer messages are automatically split into smaller parts to simulate a more natural conversation flow.
- **Proactive Mode**: The assistant can be configured to initiate the conversation with a welcome message.
- **Responsive Design**: The layout adapts for a good experience on both desktop and mobile devices.

## 📂 Project Structure
- `index.html`: Main entry point, includes CDN links for Tailwind CSS and dependencies.
- `App.tsx`: The root React component, manages the chat widget's state (open/closed) and the settings panel visibility.
- `components/`: Contains all UI components.
  - `ChatWindow.tsx`: Displays the conversation history.
  - `MessageInput.tsx`: The text area for user input, also shows token/cost stats.
  - `SettingsPanel.tsx`: The form for configuring the assistant.
  - `BusinessProfile.tsx`: A component to display business info (likely outside the chat widget itself).
- `services/geminiService.ts`: A dedicated module to handle all communication with the Google Gemini API.
- `types.ts`: Contains all TypeScript type definitions for the application (e.g., `Message`, `ChatConfig`).
- `vite.config.ts`: Vite build configuration.
