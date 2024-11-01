export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="inline-block max-w-lg text-center justify-center">
      {children}
    </div>
  );
}
