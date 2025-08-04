import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AuthProvider } from "@/lib/auth"
import { AuthGuard } from "@/components/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  )
}
