import { getSupabaseServerClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/actions/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, the login page will be rendered directly via page.tsx
  // Wait, the middleware protects `/admin` except `/admin/login`. 
  // But if this layout is used by `/admin/login`, it will show the sidebar. 
  // We need to exclude the sidebar on the login page or move the login page out of `/admin/login` (e.g. to `/login`) or create a route group.
  
  // Let's use a trick: if no user, render children (the login page) without the sidebar.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-paper-soft overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
