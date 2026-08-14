import { AdminAuthProvider } from "./_lib/auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-background">{children}</div>
    </AdminAuthProvider>
  );
}
