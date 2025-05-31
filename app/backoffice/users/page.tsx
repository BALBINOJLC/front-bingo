import { BackofficeLayout } from "@/modules/backoffice/presentation/components/backoffice-layout"
import { UserManagement } from "@/modules/backoffice/presentation/pages/user-management"

// Mock user for demo purposes
const mockUser = {
  id: "admin-1",
  email: "admin@goldenbingo.com",
  name: "Admin Principal",
  role: "SUPER_ADMIN",
  avatar: "/placeholder.svg?height=40&width=40",
  isActive: true,
}

export default function UsersPage() {
  return (
    <BackofficeLayout user={mockUser} onLogout={() => console.log("Logout")}>
      <UserManagement />
    </BackofficeLayout>
  )
}
