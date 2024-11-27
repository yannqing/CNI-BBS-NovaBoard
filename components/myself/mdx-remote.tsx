import type { GetStaticProps } from "next";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import Welcome from "../../app/(main)/mdx-page/Welcome.mdx";

const components = { Welcome };

interface Props {
  mdxSource: MDXRemoteSerializeResult;
}

export default function ExamplePage({ mdxSource }: Props) {
  return (
    <div>
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}

export const getStaticProps: GetStaticProps<{
  mdxSource: MDXRemoteSerializeResult;
}> = async () => {
  const mdxSource = await serialize("some *mdx* content: <Welcome />");

  return { props: { mdxSource } };
};
