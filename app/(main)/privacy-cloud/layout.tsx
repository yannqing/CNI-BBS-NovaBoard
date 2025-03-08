import LeftBox from "@/components/privacy-cloud/LeftBox";

export default function PrivacyCloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-row w-full mt-5">
        <div className={"flex h-[100vh]"}>
          <LeftBox children={undefined} />
        </div>
        <main className="w-full ml-5">{children}</main>
      </div>
    </section>
  );
}
