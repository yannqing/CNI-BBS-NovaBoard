// components/MarkdownRenderer.tsx
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface MarkdownRendererProps {
  mdxSource: MDXRemoteSerializeResult;
  components?: Record<string, React.ComponentType>;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  mdxSource,
  components,
}) => {
  return <MDXRemote {...mdxSource} components={components} />;
};

export default MarkdownRenderer;
