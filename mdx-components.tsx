import type { MDXComponents } from "mdx/types";

// 这个文件允许你提供自定义 React 组件
// 以在 MDX 文件中使用。你可以导入和使用任何
// 你想要的 React 组件，包括内联样式、
// 其他库的组件等等。

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
