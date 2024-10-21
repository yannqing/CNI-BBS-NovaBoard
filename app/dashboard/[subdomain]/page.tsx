export default function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  return (
    <div className={"bg-blue-500"}>
      <div>个人主页，仪表盘：{params.subdomain}</div>
    </div>
  );
}
