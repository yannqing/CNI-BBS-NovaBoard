# CNI-BBS-NovaBoard 论坛

> ps：BBS-NovaBoard 是 BBS 论坛项目前端项目

## 介绍

技术栈：nextjs 框架

### 依赖项

- UI + 样式

  - [NextUI](https://nextui.org/)

  - [Tailwind CSS](https://tailwindcss.com/)

  - [Sonner](https://sonner.emilkowal.ski/)： 消息提示 UI

  - [shadcn + shadcn-ui](https://ui.shadcn.com/)： 对 nextui 的扩展

  - [clsx 动态类库](https://www.npmjs.com/package/clsx)

- 工具库

  - axios： 请求处理
  - crypto-js： 加密和哈希
  - js-cookie： 进行 cookie 处理



### 子系统

CNI-BBS 包括三个子系统，以及对应的功能点如下：

- 用户主页子系统 - UserHome
  - CNI-BBS 论坛介绍 + 合作意向等
  - 用户帖子，作者推荐展示：用户发布的帖子，按热度等展示
  - 密聊：web 端在线实时聊天
- 用户后台子系统 - UserDashBoard
  - 个人作品管理
  - 个人数据统计
  - 朋友管理
  - 帖子评论管理
- 管理后台子系统 - AdminDashBoard
  - 用户管理
  - 权限管理
  - 帖子管理
  - 聊天管理



## 认证和鉴权

### axios 拦截器

- 添加 token
- post 请求加密
- 响应解密
- 错误处理



### 自定义错误码











## 用户主页子系统 - UserHome





## 用户后台子系统 - UserDashBoard

> ps：用户对自己发布的内容进行管理的后台页面

### 页面

#### 侧边栏

> ps：使用 shadcn-ui 中的 sidebar

步骤：

1. 安装 shadcn `npm install shadcn`
2. 安装 shadcn-ui `npm install shadcn-ui`
3. 设置包管理器为 pnpm ：在 package.json 中添加 `"packageManager": "pnpm@9.12.2"`
4. 初始化 `pnpm dlx shadcn@latest init`
5. 使用 sidebar 组件 `pnpm dlx shadcn@latest add sidebar`



### 功能点

#### 仪表盘

1. 数据总览（各个卡片展示）
2. **自定义实现贡献图组件**：<ContributionGraph />
3. 







## 管理后台子系统 - AdminDashBoard









