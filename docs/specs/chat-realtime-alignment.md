# Chat Realtime Alignment Spec

## Background
- Frontend chat experience is visually weak and has protocol/behavior mismatches with backend.
- Current chat only integrates a small subset of realtime module APIs.
- Existing repo currently has no runnable `test` and `test:e2e` scripts, so test baseline is failing by configuration.

## Goals
- Align frontend chat behavior with backend chat protocol.
- Fix known runtime bugs in message sending and realtime update.
- Improve chat page UX toward Telegram-like workflow.
- Build a clear interface implementation matrix and phased rollout.

## API Alignment Matrix

### Implemented (currently in frontend)
- `POST /chat/chat-list/list`
- `POST /chat/message/record`
- `POST /chat/message/send`

### Missing (high priority)
- `POST /chat/chat-list/createChatList`
- `POST /chat/chat-list/deleteChatList`
- `POST /chat/chat-list/setTopChatList`
- `GET /chat/chat-list/read/{fromId}/{toId}`
- `GET /chat/chat-list/read/all?userId=...`
- `POST /chat/chat-list/detail`
- `POST /chat/message/retraction`
- `POST /chat/message/reedit`
- `POST /chat/message/send/file`
- `POST /chat/message/send/media`
- `GET /chat/message/get/file`
- `GET /chat/message/get/media`

### Missing (medium priority)
- Chat group module (`/chat/group/*`)
- Chat group member list (`/chat/chat-group-member/list`)
- Group notice module (`/chat/group-notice/*`)

## Protocol Constraints (must follow)
- `source` must be one of: `user | group | system`.
- `messageType` must be one of: `message | notify | media`.
- `chatMessageContent.type` must be one of content types such as `text | image | file | video`.
- For file/media sending:
1. Pre-save message via `POST /chat/message/send` with `messageType=media`.
2. Upload binary via `/chat/message/send/file` or `/chat/message/send/media` with `userId` + `msgId`.

## Known Bugs To Fix
- Duplicate `ChatProvider` nesting causes repeated initialization.
- `useWebSocket` not actually consumed by chat page; incoming server push not reflected in UI.
- Message sender uses unsafe optional chaining patterns that can throw on null values.
- File sending is currently mock upload and not connected to backend file/media endpoints.
- Mobile chat main panel is hidden due to desktop-only layout.

## Delivery Plan

### Phase 1: Foundation and Critical Bug Fix
- Create runnable scripts for `test` and `test:e2e` (at minimum, explicit placeholders if real suites are absent).
- Remove duplicate chat provider wrapper.
- Add safe current-user extraction utility in chat flow.
- Wire websocket message callback into chat detail page.
- Align `messageType` and `chatMessageContent` values for text and media.

### Phase 2: Chat List and Message Operations
- Implement actions for unread/read/detail/pin/delete/create chat list.
- Implement message retraction/re-edit actions and UI affordances.
- Add integration tests for chat-list + message send + read flow.

### Phase 3: Media/File End-to-End
- Implement `send/media` and `send/file` pipeline with pre-saved `msgId`.
- Render media/file messages by backend payload.
- Add E2E coverage for image/video/file send scenarios.

### Phase 4: Group Chat and Notice
- Integrate group-related APIs.
- Add group details/member/notice views.

## Acceptance Criteria
- Text message send/receive works in realtime (without manual refresh).
- Chat list unread and read status update correctly.
- File/media messages are uploaded through backend endpoints (no mock blob-only behavior).
- No crash when user cookie is missing/invalid.
- Mobile can enter and use chat conversation.
- `pnpm test` and `npm run test:e2e` execute successfully in CI/local.
