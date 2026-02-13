you can find backend-code in 
`/mnt/c/Users/leehua/Desktop/project/minejavaproject/CNI-BBS/CNI-BBS-TitanCore`



Based on my analysis of all 18 controller files in the core module, here is the complete API documentation organized by functional modules:

---

# CNI-BBS-TitanCore Core Module API Documentation

## 1. AI Module (AI Services)

### 1.1 AI Service Support (`AiAgentController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/aiService/chatAgent` | Intelligent customer service chat interface (SSE streaming) |

### 1.2 AI Local Message Management (`AiMessageController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/aiMessage/save` | Save message |
| GET | `/aiMessage/history` | Get historical messages |
| DELETE | `/aiMessage/history/{sessionId}` | Clear historical messages |

### 1.3 AI Local Session Management (`AiSessionController`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/aiSession/{sessionId}` | Query session info by session ID |
| GET | `/aiSession/user/{userId}` | Query current user's sessions |
| POST | `/aiSession/user/createSession` | Create session |
| DELETE | `/aiSession/{id}` | Delete session |

---

## 2. Post Module (BBS Posts)

### 2.1 Post Management (`PostController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/post/open/queryPostList` | Query post list (supports pagination) |
| GET | `/post/open/{postId}` | Query post details by ID |
| POST | `/post/createPost` | Create post (Step 2) |
| POST | `/post/cleanTemporaryCover` | Clean temporary covers during post creation |
| GET | `/post/createTemporaryPostId` | Create/get temporary post ID (Step 1) |
| GET | `/post/getUpdatePostInfo` | Get original post info for update (Step 2) |
| POST | `/post/updatePost` | Update post (Step 3) |
| DELETE | `/post/deletePost/{postId}` | Delete post |
| GET | `/post/frequency` | Get user post frequency data |
| POST | `/post/open/queryCommentListByPostId` | Get post comments (paginated) |
| POST | `/post/addPostComment` | Add post comment |
| DELETE | `/post/deletePostComment` | Delete post comment |

### 2.2 Category Management (`CategoryController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/category/open/list` | Get category list |
| POST | `/category/createCategory` | Create category |
| DELETE | `/category/deleteCategory` | Delete category |
| PUT | `/category/updateCategory` | Update category |

### 2.3 Tag Management (`TagController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/tag/open/list` | Get tag list |
| POST | `/tag/createTag` | Create tag |
| DELETE | `/tag/deleteTag` | Delete tag |
| PUT | `/tag/updateTag` | Update tag |

---

## 3. Real-time Communication Module (Chat)

### 3.1 Chat Group Management (`ChatGroupController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat/group/open/list` | Chat group list |
| POST | `/chat/group/create` | Create chat group |
| POST | `/chat/group/update` | Update chat group info |
| POST | `/chat/group/invite` | Invite members |
| POST | `/chat/group/quit` | Quit chat group |
| POST | `/chat/group/kick` | Kick from chat group |
| POST | `/chat/group/dissolve` | Dissolve chat group |
| POST | `/chat/group/transfer` | Transfer chat group ownership |
| GET | `/chat/group/open/details/{groupId}` | Group details |

### 3.2 Chat Group Member Management (`ChatGroupMemberController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat/chat-group-member/list` | Query group member list by group ID |

### 3.3 Chat Group Notice Management (`ChatGroupNoticeController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat/group-notice/create` | Create/edit group notice |
| POST | `/chat/group-notice/list` | Get group notice list (with history) |
| DELETE | `/chat/group-notice/delete/{noticeId}` | Delete group notice |

### 3.4 Chat List Management (`ChatListController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat/chat-list/list` | Get chat list |
| POST | `/chat/chat-list/createChatList` | Create chat session |
| POST | `/chat/chat-list/deleteChatList` | Delete chat session |
| POST | `/chat/chat-list/setTopChatList` | Pin chat session |
| GET | `/chat/chat-list/read/{fromId}/{toId}` | Mark messages as read |
| GET | `/chat/chat-list/read/all` | Mark all messages as read |
| POST | `/chat/chat-list/detail` | Get chat list details |

### 3.5 Chat Message Management (`ChatMessageController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat/message/send` | Send message |
| POST | `/chat/message/retraction` | Retract message |
| POST | `/chat/message/reedit` | Re-edit message (returns retracted message info) |
| POST | `/chat/message/record` | Historical chat records |
| POST | `/chat/message/send/file` | Send file (pre-save message first) |
| POST | `/chat/message/send/media` | Send media (pre-save message first) |
| GET | `/chat/message/get/file` | Get file (supports range requests) |
| GET | `/chat/message/get/media` | Get media |

### 3.6 Follow/Relationship Management (`FollowController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/follow/list` | Get follow list |
| POST | `/follow/buildFollow` | Establish follow relationship |
| POST | `/follow/changeFollowStatus` | Change follow status |
| POST | `/follow/changeBlockStatus` | Change block status (one-way) |
| POST | `/follow/removeFollow` | Cancel mutual follow |
| GET | `/follow/queryFollowCount/{userId}` | Query follow statistics |

---

## 4. User Module (User Management)

### 4.1 User Management (`UserController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/user/open/login` | User login |
| GET | `/user/getUserInfoByToken` | Get user info by token |
| GET | `/user/open/logout/{userId}` | User logout |
| GET | `/user/checkUserStoresLive` | Check user local storage status |
| GET | `/user/open/recommendedUser` | Recommended users to follow |
| GET | `/user/recommendedUser/{userId}` | Recommended users by user ID |
| POST | `/user/open/register` | User registration |
| GET | `/user/open/checkUserIfExist/{account}` | Check if user exists |
| POST | `/user/open/checkUserVerificationCode` | Verify user verification code and generate temporary pass |
| POST | `/user/open/resetPassword` | User password reset |
| POST | `/user/open/socialUserBindLocalUser` | Bind third-party user to local user |

### 4.2 Third-party Login (`RestAuthController`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/render/{source}` | Request authentication link from third-party |
| GET | `/auth/callback/{source}` | Third-party login callback |

---

## 5. Points Module (Points System)

### 5.1 Points Management (`PointsController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/points/addPointsRole` | Add points rule (admin only) |
| POST | `/points/addPointsRecord` | Add user points record |

---

## 6. Search Module (Elasticsearch)

### 6.1 ES Search (`ElasticSearchController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/es/postSearch` | ES full-text search |

---

## 7. Common Module (Common Services)

### 7.1 Common Services (`CommonController`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/common/open/sendCode` | Send verification code (email/SMS) |
| POST | `/common/upload/media` | Upload post media (image/video) |
| POST | `/common/upload/file` | File upload |
| POST | `/common/file/createTemporaryUrl` | Generate temporary file URL (for download) |
| POST | `/common/deleteFile` | Delete file |
| GET | `/common/queryFileList/{userId}` | Query file list by user ID |

---

## 8. Test Module

### 8.1 Test (`TestController`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/test/hello` | Test hello endpoint |
| GET | `/test/word/{word}` | Sensitive word filter test |

---

## API Summary Statistics

| Module | Controller Count | API Count |
|--------|-----------------|-----------|
| AI Module | 3 | 10 |
| Post Module | 3 | 19 |
| Real-time Communication | 5 | 29 |
| User Module | 2 | 13 |
| Points Module | 1 | 2 |
| Search Module | 1 | 1 |
| Common Module | 1 | 6 |
| Test Module | 1 | 2 |
| **Total** | **17** | **82** |