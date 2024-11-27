# CNI-BBS-NovaBoard 论坛

> ps：BBS-NovaBoard 是 BBS 论坛项目前端项目

## 介绍

技术栈：nextjs 框架

### 依赖项

- UI + 样式

  - [NextUI](https://nextui.org/)

  - [Tailwind CSS](https://tailwindcss.com/)

  - [消息提示 UI: Sonner](https://sonner.emilkowal.ski/)

  - [对 nextui 的扩展: shadcn + shadcn-ui](https://ui.shadcn.com/)

  - [clsx 动态类库](https://www.npmjs.com/package/clsx)

  - [Icon 图标库 lucide-react](https://lucide.dev/guide/packages/lucide-react)

  - [svg 图标处理库 @svgr/webpack]()

  - [MDX：markdown + jsx 渲染 html](https://mdxjs.com/)

- 工具库

  - axios： 请求处理
  - crypto-js： 加密和哈希
  - js-cookie： 进行 cookie 处理



### 子系统

CNI-BBS 包括四个子系统，以及对应的功能点如下：

- 用户登录注册子系统 - Auth
  - 用户登录
  - 用户注册
  - 忘记密码
  - 对接第三方登录

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







## Auth



### 用户注册

需要的参数：

```json
    loginName: "",
    userName: "",
    sex: 0,
    password: "",
    phoneNumber: "",
    emailNumber: "",
    bio: "",
    inviteUrl: "",
    isPrivate: 0,
    remark: "2",
```

#### 逻辑

1. **判空：**判断除了 bio 和 inviteUrl 之外的字段均不能为空
2. **有效判断：**账号，密码，电话，邮箱，邀请码（不为空的话）
3. 构建请求参数
4. 是否勾选**同意协议**
5. 发送请求





### 忘记密码

step：

1. 用户输入账号（手机号/邮箱）
2. 点击发送验证码
3. 调用接口判断账号是否有效，有效则发送验证码（5 min有效）
4. 点击下一步
5. 调用接口判断验证码是否有效，（返回临时通行码）
6. 用户输入两次新密码
7. 新密码，临时通行码，手机号重置密码



#### 重置密码逻辑

1. 确认两次输入密码是否相同
2. 判断密码逻辑（大小写+数字+特殊字符 +8位以上）
3. 判断用户输入的 account 是否为空
4. 判断临时通行码是否为默认值（0）是的话，让用户重新获取验证码
5. 发送请求，重置密码



PS：将所有的提示字符串给抽象为 枚举





## UserHome



### /home

url：

- https://ibw.bwnet.com.tw/ac_gallery/2023/03/537517ab-4f2b-16cd-095e-b5857110dfdd_620.jpg
- https://ibw.bwnet.com.tw/AC_Gallery/2023/03/88d700a4-e06f-d1ac-3153-976ace4ce9b5.jpg
- https://ibw.bwnet.com.tw/AC_Gallery/2023/03/4ba10704-2a05-c83f-116e-ba3fd026f107.jpg



### /chat





### 待完善

- 分类为空时，展示对应的样式
- 切换分类时，显示加载状态 loading
- 常量抽离 `components/home/topbar.tsx`
- 



## UserDashBoard

> ps：（用户后台系统）用户对自己发布的内容进行管理的后台页面

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









## AdminDashBoard





## 开发规范



1. 对所有的手机号，邮箱，密码，账号做格式校验
2. 将所有的提示字符串给抽象为常量放一个单独的 ts 文件中
3. page 页面不能以组件形式调用，例如<HomePage />
4. 全局状态管理，上下文 Context，要确定不是 undefined 才能返回 children
5. 用户输入的 md 文件需要确认安全后再投入使用。由于前端使用的是 mdx，是一门编程语言，所以要确保用户输入的代码的安全性！



## 待完善



### 样式优化

1. 主题/字体色调整
2. 全局路由跳转，加载样式 loading
3. 移动端适配



### 代码规范优化

1. 所有固定字符串全部抽离出来
2. 接口调用位置重构
3. 类型定义位置重构



