"use client";

import Welcome from "@/app/(main)/mdx-page/Welcome.mdx";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <article className="prose">
      <Welcome />
    </article>
  );
}
