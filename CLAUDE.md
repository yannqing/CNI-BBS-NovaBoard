# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CNI-BBS-NovaBoard is a Next.js-based forum/BBS application with real-time chat, user management, and private cloud storage features. The backend API runs on `http://localhost:8080` and WebSocket server on `ws://localhost:9100`.

## Tech Stack

- **Framework**: Next.js 14.2.13 (App Router with Route Groups)
- **UI Libraries**: NextUI, Tailwind CSS, shadcn/shadcn-ui, Radix UI
- **Styling**: Tailwind CSS with custom typography plugin
- **State Management**: React Context (UserContext, ChatContext, PostContext)
- **Real-time Communication**: WebSocket (custom hook in `app/(main)/chat/useWebSocket.ts`)
- **HTTP Client**: Axios with request/response encryption
- **Content**: MDX support for markdown content with JSX
- **Icons**: lucide-react, @radix-ui/react-icons
- **Notifications**: Sonner (toast notifications)
- **Package Manager**: pnpm 9.12.2

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)

# Build
pnpm build            # Production build

# Start production server
pnpm start            # Start production server

# Linting
pnpm lint             # Run ESLint with auto-fix
```

## Project Structure

### Route Groups (App Router)

The app uses Next.js App Router with route groups for organization:

- **`app/(auth)/`** - Authentication pages (login, register, forget password, bind)
  - Has its own layout without navbar/footer
  - Routes: `/login`, `/register`, `/forget`, `/bind`

- **`app/(main)/`** - Main application pages
  - Has navbar and footer layout
  - Routes: `/home`, `/chat`, `/about`, `/privacy-cloud`, `/search`, `/mdx-page/[slug]`
  - Contains PostContext for post-related state

- **`app/dashboard/[subdomain]/`** - User dashboard with dynamic subdomain routing
  - User management, statistics, posts, comments
  - Uses shadcn-ui sidebar component

### Key Directories

- **`components/`** - Reusable React components organized by feature (home, chat, dashboard, post, privacy-cloud, ui)
- **`types/`** - TypeScript type definitions organized by domain (auth, chat, cloud, dashboard, post, error, follow)
- **`utils/`** - Utility functions:
  - `axios.ts` - Axios instance with encryption/decryption interceptors
  - `tools.ts` - Encryption/decryption, validation (password, email, phone), path matching
  - `cookies.ts` - Cookie management utilities
  - `upload.ts` - File upload utilities
- **`common/`** - Shared constants (auth constants, encryption keys, white lists)
- **`config/`** - Configuration files (`site.ts` for nav/links, `fonts.ts`)
- **`hooks/`** - Custom React hooks (`use-mobile.tsx`)
- **`lib/`** - Library utilities (`utils.ts` for cn() class merging)
- **`styles/`** - Global CSS styles

## Architecture Patterns

### Authentication & Authorization

1. **Cookie-based auth**: User info (including token) stored in cookie named `userInfo`
2. **Axios interceptors** (in `utils/axios.ts`):
   - Request: Add token header, encrypt POST request bodies (AES-CTR encryption)
   - Response: Decrypt responses, handle token expiration
   - White list for public endpoints (defined in `common/auth/constant.ts`)
3. **Middleware** (`middleware.ts`): Route protection, redirects for unauthenticated users accessing `/chat`

### Encryption System

- **Algorithm**: AES-CTR mode with no padding
- **Key**: Shared secret `keyOne` in `common/auth/constant.ts`
- **IV**: Randomly generated 16-byte IV for each request, sent in request/response headers
- **Format**: Base64-encoded with URL-safe modifications (`/` → `_`, `+` → `-`)
- **POST requests**: Request body encrypted, FormData excluded
- **Responses**: Decrypted using IV from response header

### Real-time Communication (WebSocket)

- **Hook**: `app/(main)/chat/useWebSocket.ts`
- **Connection**: Singleton pattern, requires user token
- **Features**: Auto-reconnect on abnormal disconnect, 30s heartbeat interval
- **URL**: Includes token as query parameter: `/ws?x-token=${token}`

### Context Providers

Global state managed via React Context, nested in `app/layout.tsx`:

1. **UserProvider** (`app/UserContext.tsx`) - User authentication state
2. **ChatProvider** (`app/(main)/chat/ChatContext.tsx`) - Chat/messaging state
3. **PostContext** (`app/(main)/PostContext.tsx`) - Post/content state
4. **Providers** (`app/(main)/providers.tsx`) - Theme provider (NextUI)

### API Proxy

Next.js rewrites proxy `/api/*` to `http://localhost:8080/*` (see `next.config.js`)

## Development Guidelines

### Code Style (ESLint Rules)

- **Import order**: type → builtin → external → internal → parent → sibling → index (with newlines between groups)
- **JSX props**: Sort with callbacks last, shorthand first, reserved first
- **Unused imports**: Auto-removed on lint
- **Padding**: Blank line before returns and after variable declarations
- **React**: No prop-types, no React import needed in JSX

### Validation Requirements

All user inputs must be validated:

- **Password**: `validatePassword()` - uppercase + lowercase + number + special char + 8+ chars
- **Email**: `validEmail()` - standard email format
- **Phone**: `validatePhoneNumber()` - Chinese mobile format (1[3-9]xxxxxxxxx)

### Security Practices

1. **Never commit secrets**: `.env` file is gitignored
2. **MDX safety**: User-generated MDX must be sanitized (MDX is executable code)
3. **OWASP awareness**: Watch for XSS, SQL injection, command injection
4. **Cookie expiration**: 7 days if "remember me", 1 day otherwise

### Constants Management

Extract all hard-coded strings to constant files. Don't scatter magic strings/numbers throughout code.

### Component Guidelines

- **Page files cannot be used as components**: Don't call `<HomePage />`, use proper routing
- **Context validation**: Always check context is not undefined before returning children
- **Avoid creating new methods**: Prefer adding to existing methods when possible
- **No empty fallbacks**: If category/data is empty, show appropriate empty state UI

## MDX Configuration

- **Supported extensions**: `.md`, `.mdx`, `.js`, `.jsx`, `.ts`, `.tsx`
- **Route**: MDX pages served at `/mdx-page/[slug]`
- **Rendering**: Uses `@mdx-js/react`, `next-mdx-remote`, `react-markdown`
- **Editor**: `react-markdown-editor-lite` for authoring

## SVG Handling

Webpack configured to handle SVGs two ways:
- **As React component**: `import Logo from './logo.svg'` (via @svgr/webpack)
- **As URL**: `import logoUrl from './logo.svg?url'`

## Environment Variables

See `.env` file:
- `NEXT_PUBLIC_BackEndUrl` - Backend API base URL (client-side accessible)
- `BackEndUrl` - Backend API base URL (server-side)
- `NEXT_PUBLIC_BACKEND_WEBSOCKET_URL` - WebSocket server URL

## Path Aliases

TypeScript configured with `@/*` pointing to project root for clean imports.

## Common Issues

### Build Errors

If you encounter cache-related errors on startup:
```bash
rm -rf .next/cache
```

### Git Status Note

The following files are currently modified but not committed:
- `.env` - Local environment configuration
- `app/(main)/chat/useWebSocket.ts` - WebSocket implementation
- `app/(main)/mdx-page/[slug]/page.tsx` - MDX page rendering
- `config/site.ts` - Site configuration
- `utils/axios.ts` - Axios interceptors

## Subsystems

1. **Auth** - Login/register/password reset/third-party OAuth (WeChat, Gitee, Google)
2. **UserHome** - Forum posts, author recommendations, live chat
3. **UserDashboard** - Personal content management, statistics, friend management, comment management
4. **AdminDashboard** - User/permission/post/chat management
