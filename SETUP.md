# Setup Instructions

## Environment Variables

To use the AI chatbot, you need to set up your OpenAI API key:

### 1. Get your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the generated API key

### 2. Create Environment File

1. In the root directory of the project, create a file named `.env.local`
2. Add your OpenAI API key:

```env
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Restart the Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Features

- **Fast Response Times**: Using GPT-3.5 Turbo for optimal speed
- **Modern Design**: Clean, minimal interface built with Tailwind CSS
- **Responsive**: Works perfectly on desktop and mobile devices
- **User-Friendly Features**:
  - Suggested prompts to get started
  - Copy message functionality
  - Clear chat option
  - Keyboard shortcuts (Ctrl+K to focus, Ctrl+Shift+L to clear)
  - Auto-resizing input field
  - Typing indicators
  - Message timestamps

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Ctrl + K** (or Cmd + K): Focus input field
- **Ctrl + Shift + L** (or Cmd + Shift + L): Clear chat

## Troubleshooting

### API Key Issues

- Make sure your API key is valid and has sufficient credits
- Ensure there are no extra spaces in your `.env.local` file
- The file should be in the root directory (same level as `package.json`)

### Connection Issues

- Check your internet connection
- Verify the OpenAI API status at [status.openai.com](https://status.openai.com)

### Build Issues

- Run `npm install` to ensure all dependencies are installed
- Try clearing the Next.js cache: `rm -rf .next` and restart the dev server
