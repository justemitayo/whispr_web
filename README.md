

# 🗣️ Whisper — Real-Time Encrypted Chat App

Whisper is a modern, real-time chat application built with **React**, featuring **secure message encryption**, **WebSocket-powered live messaging**, and a **clean, responsive UI** inspired by platforms like ChatGPT and Messenger.  

Deployed on **Netlify**, Whisper allows users to connect instantly and communicate privately with **end-to-end encryption** via [ByteLock](https://www.npmjs.com/package/bytlock).

---

## 🚀 Features

- 🔒 **End-to-End Encryption** using `MessageCipher` (ByteLock)
- 💬 **Real-Time Messaging** via WebSocket
- 👥 **1-on-1 Conversations** with route-based navigation (`/message/:chat_id`)
- ⚡ **Infinite Scrolling** for chat history using React Query
- 🧭 **Online Status & Typing Indicators**
- 📲 **Responsive Design** (mobile & desktop)
- 🧠 **Zustand State Management**
- 🔁 **Optimistic UI Updates** for smoother interactions
- 🧑‍💻 **Authentication** (login, signup, session persistence)
- 🌙 **Dark/Light Mode Support**

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend Framework | React |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Encryption | ByteLock (`MessageCipher`) |
| Real-Time Updates | WebSocket |
| Styling | Tailwind CSS |
| Deployment | Netlify |

---

src/
│
├── components/        # UI components (chat list, message box, etc.)
├── pages/             # App pages and route structure
├── store/             # Zustand stores (auth, chat, socket)
├── hooks/             # Custom hooks (dark mode, socket, encryption)
├── utils/             # Utility functions (encryption, formatters)
├── assets/            # Icons and images
└── App.tsx            # Root component





You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
