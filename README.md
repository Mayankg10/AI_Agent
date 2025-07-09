# 🤖 AI Chatbot - Modern Chat Interface

A sleek, modern AI chatbot built with Next.js, Tailwind CSS, and OpenAI's GPT-4o-mini. Features a beautiful, responsive design with real-time conversations.

![AI Chatbot Demo](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-blue?style=flat-square&logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?style=flat-square&logo=openai)

## ✨ Features

### 🎨 **Modern Design**
- Sleek, minimal interface with gradient backgrounds
- Smooth animations and transitions
- Custom scrollbars and hover effects
- Responsive design for all screen sizes

### 🤖 **AI-Powered**
- OpenAI GPT-4o-mini integration
- Real-time conversation with typing indicators
- Intelligent responses with context awareness
- Error handling and rate limit management

### 🚀 **User Experience**
- Suggested conversation starters
- Auto-resizing input field
- Message timestamps and copy functionality
- Keyboard shortcuts (Ctrl+K to focus, Ctrl+Shift+L to clear)
- Smooth message animations

### 🛠 **Technical Stack**
- ⚡ Next.js 15.3.4 with App Router
- 🎨 Tailwind CSS for styling
- 🔧 TypeScript for type safety
- 🌐 Modern React hooks and patterns
- 📱 Mobile-first responsive design

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- OpenAI API key (optional, for chat functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ai-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check code quality

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # OpenAI API endpoint
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page component
└── index.css               # Global styles with Tailwind
```

## API Routes

- `POST /api/chat` - Chat endpoint for OpenAI integration

## Customization

### Tailwind CSS

Tailwind CSS is configured in `tailwind.config.js`. You can customize the theme, add new utilities, or configure plugins as needed.

### Styling

Global styles are defined in `src/index.css` using Tailwind's utility classes.

## Deployment

This Next.js application can be deployed to various platforms:

- **Vercel** (recommended): Deploy directly from your Git repository
- **Netlify**: Connect your repository and deploy
- **AWS**: Use AWS Amplify or deploy manually
- **Docker**: Build a Docker image and deploy to any container platform

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Migration Notes

This project was converted from Create React App to Next.js with the following changes:

- Migrated from React Router to Next.js App Router
- Converted React components to Next.js pages/components
- Set up API routes for server-side functionality
- Configured Tailwind CSS for Next.js
- Removed React-specific dependencies and configurations
