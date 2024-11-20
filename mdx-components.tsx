import type { MDXComponents } from "mdx/types";

// 这个文件允许你提供自定义 React 组件
// 以在 MDX 文件中使用。你可以导入和使用任何
// 你想要的 React 组件，包括内联样式、
// 其他库的组件等等。

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold my-4">{children}</h1>
    ),
    ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
    li: ({ children }) => <li className="my-1">{children}</li>,
    ...components,
  };
}
