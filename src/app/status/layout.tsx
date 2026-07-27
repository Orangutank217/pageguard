export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-full">{children}</main>;
}
