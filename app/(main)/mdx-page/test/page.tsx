// app/example/page.tsx
import { serialize } from "next-mdx-remote/serialize";

// 确保路径正确

import Example from "@/components/post/example";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const components = { Example };

const ExamplePage = async () => {
  // 动态 Markdown 字符串
  const mdxString = `
    # 这是一个标题
    这里是一些 *Markdown* 内容。

    <Example />
  `;

  const mdxSource = await serialize(mdxString);

  return (
    <div>
      <h1>动态 Markdown 渲染</h1>
      <MarkdownRenderer components={components} mdxSource={mdxSource} />
    </div>
  );
};

export default ExamplePage;
