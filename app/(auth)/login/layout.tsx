export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={"w-full h-full bg-gradient-to-r from-slate-950 to-pink-500"}
    >
      <div className="inline-block max-w-lg bg-amber-500">{children}</div>
      <div>xxx</div>
    </div>
  );
}
