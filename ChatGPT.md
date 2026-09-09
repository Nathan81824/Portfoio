# ChatGPT Assistant

An interactive AI-powered chat assistant built into the portfolio website. The assistant provides visitors with a simple way to interact with the portfolio and learn more about the developer, projects, skills, and available services.

## Overview

The ChatGPT assistant is integrated into the portfolio as a floating chat interface.

It is designed to:

* Answer questions about the portfolio
* Provide information about projects and skills
* Help visitors navigate the portfolio
* Provide a conversational user experience
* Keep the interface lightweight and easy to use

## Component

The main chat component is:

```text
ChatController.jsx
```

The project uses `ChatController.jsx` as the main chat UI/controller component.

## Suggested Structure

```text
src/
├── components/
│   └── chat/
│       └── ChatController.jsx
│
├── data/
│   └── ...
│
└── ...
```

## Features

### Floating Chat Button

The assistant can be opened through a floating chat button that remains accessible while browsing the portfolio.

### Chat Interface

The chat interface provides:

* User messages
* Assistant responses
* Message history
* Input field
* Send button
* Loading state
* Close/minimize controls

### Portfolio Knowledge

The assistant can be configured with information about:

* About section
* Skills
* Projects
* Services
* Contact information
* Social links

## Technologies

The assistant is built as part of the React portfolio application.

Main technologies include:

* React
* JavaScript
* CSS
* React components
* API integration where required

The portfolio also contains supporting packages such as:

* `lucide-react`
* `framer-motion`
* `clsx`

## Configuration

If the assistant connects to an external AI API, API configuration should be stored securely.

Never place private API keys directly inside React components or expose secret keys in frontend code.

For example, sensitive configuration should be handled through environment variables and, when necessary, a backend service.

## Development

Start the portfolio development server:

```bash
npm run dev
```

Then open the local development URL provided by Vite.

## Production

Before deploying:

```bash
npm run build
```

Test the production build before publishing the portfolio.

## Design Goals

The assistant should match the overall portfolio design.

Important design principles:

* Clean interface
* Responsive layout
* Smooth animations
* Clear message hierarchy
* Accessible controls
* Consistent typography
* Consistent theme colors
* Mobile-friendly layout

## Social Links

The assistant/portfolio can provide the developer's official social links when requested.

### LinkedIn

https://www.linkedin.com/in/nathan-moses-b13b143bb/

### GitHub

https://github.com/Nathan81824?tab=repositories

## Important Security Note

Do not commit `.env` files containing API keys, passwords, tokens, or other secrets.

Make sure `.env` is included in `.gitignore`.

## Future Improvements

Possible improvements include:

* Streaming AI responses
* Typing animation
* Conversation history
* Suggested questions
* Better portfolio-specific knowledge
* Error handling
* Offline fallback responses
* Voice interaction
* Improved mobile experience

## Status

The ChatGPT assistant is part of the portfolio's interactive features and can be expanded as the portfolio develops.
