export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center md:py-10">
      <div className={"w-full h-full bg-gradient-to-r from-slate-950 to-pink-500"}>
        <div className="inline-block max-w-lg bg-amber-500">
          {children}
        </div>
      </div>
    </section>
  );
}
